import { queueAndSendEmailJob } from "../_shared/emailJobs.ts";
import { jsonResponse, maybeHandleOptions } from "../_shared/http.ts";

interface QueueEmailBody {
  sessionId?: string;
  email?: string;
}

Deno.serve(async (req) => {
  const preflight = maybeHandleOptions(req);
  if (preflight) {
    return preflight;
  }

  if (req.method !== "POST") {
    return jsonResponse(405, { error: "Method not allowed" });
  }

  let payload: QueueEmailBody;
  try {
    payload = (await req.json()) as QueueEmailBody;
  } catch {
    return jsonResponse(400, { error: "Invalid JSON body" });
  }

  if (!payload.sessionId || !payload.email) {
    return jsonResponse(400, {
      error: "Missing required fields: sessionId and email",
    });
  }

  const result = await queueAndSendEmailJob({
    sessionId: payload.sessionId,
    email: payload.email,
    type: "delivery",
    payload: { source: "queue-booth-email" },
  });

  if (result.status === "failed") {
    return jsonResponse(502, {
      ok: false,
      queued: true,
      sent: false,
      jobId: result.jobId,
      error: result.error,
    });
  }

  return jsonResponse(200, {
    ok: true,
    queued: true,
    sent: true,
    jobId: result.jobId,
    provider: result.provider,
    messageId: result.messageId,
  });
});
