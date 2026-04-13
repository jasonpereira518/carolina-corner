export type EmailProviderName = "resend" | "sendgrid";

export interface SendEmailInput {
  to: string;
  subject: string;
  html: string;
  text: string;
}

export interface SendEmailResult {
  provider: EmailProviderName;
  messageId?: string;
}

function getProvider(): EmailProviderName {
  const configured = Deno.env.get("EMAIL_PROVIDER")?.toLowerCase();
  if (configured === "sendgrid") {
    return "sendgrid";
  }
  return "resend";
}

async function sendViaResend(input: SendEmailInput): Promise<SendEmailResult> {
  const apiKey = Deno.env.get("RESEND_API_KEY");
  const from = Deno.env.get("EMAIL_FROM");
  if (!apiKey || !from) {
    throw new Error("RESEND_API_KEY and EMAIL_FROM are required for Resend");
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [input.to],
      subject: input.subject,
      html: input.html,
      text: input.text,
    }),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Resend API failed: ${response.status} ${body}`);
  }

  const json = (await response.json()) as { id?: string };
  return { provider: "resend", messageId: json.id };
}

async function sendViaSendGrid(input: SendEmailInput): Promise<SendEmailResult> {
  const apiKey = Deno.env.get("SENDGRID_API_KEY");
  const from = Deno.env.get("EMAIL_FROM");
  if (!apiKey || !from) {
    throw new Error("SENDGRID_API_KEY and EMAIL_FROM are required for SendGrid");
  }

  const response = await fetch("https://api.sendgrid.com/v3/mail/send", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      personalizations: [{ to: [{ email: input.to }] }],
      from: { email: from },
      subject: input.subject,
      content: [
        { type: "text/plain", value: input.text },
        { type: "text/html", value: input.html },
      ],
    }),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`SendGrid API failed: ${response.status} ${body}`);
  }

  return { provider: "sendgrid" };
}

export async function sendEmail(input: SendEmailInput): Promise<SendEmailResult> {
  const provider = getProvider();
  if (provider === "sendgrid") {
    return sendViaSendGrid(input);
  }
  return sendViaResend(input);
}
