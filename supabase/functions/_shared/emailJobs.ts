import { sendEmail } from "./emailProvider.ts";
import { getServiceSupabase } from "./supabase.ts";

type JobType = "delivery" | "preview";

interface QueueAndSendInput {
  sessionId: string;
  email: string;
  type: JobType;
  payload?: Record<string, unknown>;
}

function getTemplate(
  type: JobType,
  sessionId: string,
  payload: Record<string, unknown>,
): { subject: string; html: string; text: string } {
  if (type === "preview") {
    const previewUrl = String(payload.previewUrl ?? "");
    const subject = "Your Carolina Corner preview link";
    const text = previewUrl
      ? `Your preview link is ready: ${previewUrl}`
      : "Your preview link request has been received.";
    const html = previewUrl
      ? `<p>Your preview link is ready:</p><p><a href="${previewUrl}">${previewUrl}</a></p>`
      : "<p>Your preview link request has been received.</p>";
    return { subject, html, text };
  }

  const subject = "Your Carolina Corner story is on the way";
  const text = `Thanks for participating in Carolina Corner. Session ID: ${sessionId}`;
  const html = `<p>Thanks for participating in Carolina Corner.</p><p>Session ID: ${sessionId}</p>`;
  return { subject, html, text };
}

export async function queueAndSendEmailJob(input: QueueAndSendInput) {
  const supabase = getServiceSupabase();
  const payload = input.payload ?? {};
  const now = new Date().toISOString();

  const { data: inserted, error: insertError } = await supabase
    .from("booth_email_jobs")
    .insert({
      session_id: input.sessionId,
      email: input.email,
      type: input.type,
      status: "queued",
      payload,
      attempt_count: 0,
      updated_at: now,
    })
    .select("id")
    .single();

  if (insertError || !inserted) {
    throw new Error(`Failed to create email job: ${insertError?.message ?? "unknown"}`);
  }

  const jobId = inserted.id as string;
  const template = getTemplate(input.type, input.sessionId, payload);

  try {
    const result = await sendEmail({
      to: input.email,
      subject: template.subject,
      html: template.html,
      text: template.text,
    });

    const { error: updateError } = await supabase
      .from("booth_email_jobs")
      .update({
        status: "sent",
        provider: result.provider,
        provider_message_id: result.messageId ?? null,
        error_message: null,
        attempt_count: 1,
        sent_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq("id", jobId);

    if (updateError) {
      throw new Error(`Failed to mark email job as sent: ${updateError.message}`);
    }

    return {
      jobId,
      status: "sent" as const,
      provider: result.provider,
      messageId: result.messageId ?? null,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown email error";
    await supabase
      .from("booth_email_jobs")
      .update({
        status: "failed",
        error_message: message,
        attempt_count: 1,
        updated_at: new Date().toISOString(),
      })
      .eq("id", jobId);

    return {
      jobId,
      status: "failed" as const,
      error: message,
    };
  }
}
