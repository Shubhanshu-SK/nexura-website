import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)
const FROM = process.env.RESEND_FROM || "onboarding@resend.dev"
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "nexurargpv@gmail.com"

// ── Registration confirmation → participant ──────────────────────────
export async function sendConfirmationEmail({
  to, participantName, eventName, eventDate, eventVenue, eventTime,
}: {
  to: string; participantName: string; eventName: string
  eventDate: string; eventVenue: string; eventTime?: string
}) {
  const { error } = await resend.emails.send({
    from: `Nexura Club <${FROM}>`,
    to: [to],
    subject: `Registration Confirmed — ${eventName}`,
    html: `
      <body style="margin:0;padding:0;background:#08050e;font-family:Inter,sans-serif;">
      <div style="max-width:520px;margin:0 auto;padding:40px 20px;">

        <div style="text-align:center;margin-bottom:32px;">
          <span style="font-size:24px;font-weight:800;color:#AA27E5;letter-spacing:6px;">NEXURA</span>
          <p style="color:#A0AEC0;font-size:11px;letter-spacing:3px;
                    text-transform:uppercase;margin:4px 0 0;">UIT-RGPV · Automobile Engineering</p>
        </div>

        <div style="background:#0f0a1d;border:1px solid rgba(139,34,184,0.3);border-radius:16px;overflow:hidden;">
          <div style="height:4px;background:linear-gradient(90deg,#8B22B8,#AA27E5,#CC55FF);"></div>
          <div style="padding:32px;">

            <h1 style="color:#AA27E5;font-size:22px;font-weight:700;margin:0 0 8px;">
              You're registered! 🎉
            </h1>
            <p style="color:#A0AEC0;font-size:14px;margin:0 0 24px;line-height:1.6;">
              Hi <strong style="color:#F5F4FA;">${participantName}</strong>,
              your spot is confirmed.
            </p>

            <div style="background:rgba(8,5,14,0.6);border:1px solid rgba(139,34,184,0.2);
                        border-radius:12px;padding:20px;margin-bottom:20px;">
              <p style="color:#F5F4FA;font-size:17px;font-weight:700;margin:0 0 14px;">${eventName}</p>
              <p style="color:#AA27E5;font-size:12px;margin:0 0 4px;">📅 ${eventDate}</p>
              ${eventTime ? `<p style="color:#A0AEC0;font-size:12px;margin:0 0 4px;">🕐 ${eventTime}</p>` : ""}
              <p style="color:#A0AEC0;font-size:12px;margin:0;">📍 ${eventVenue}</p>
            </div>

            <p style="color:#A0AEC0;font-size:13px;line-height:1.7;margin:0;">
              Questions? Email us at
              <a href="mailto:nexurargpv@gmail.com" style="color:#AA27E5;">nexurargpv@gmail.com</a>
            </p>

          </div>
        </div>

        <p style="color:#A0AEC0;font-size:11px;text-align:center;margin-top:20px;">
          © 2025 Nexura Club · UIT-RGPV, Bhopal
        </p>
      </div>
      </body>
    `,
  })

  if (error) {
    console.error("[Resend] Registration email error:", error)
    throw new Error(error.message)
  }
}

// ── Contact notification → admin ─────────────────────────────────────
export async function sendContactNotification({
  senderName, senderEmail, message,
}: {
  senderName: string; senderEmail: string; message: string
}) {
  const { error } = await resend.emails.send({
    from: `Nexura Website <${FROM}>`,
    to: [ADMIN_EMAIL],
    replyTo: senderEmail,
    subject: `New Contact Message from ${senderName} — Nexura`,
    html: `
      <body style="margin:0;padding:0;background:#08050e;font-family:Inter,sans-serif;">
      <div style="max-width:520px;margin:0 auto;padding:40px 20px;">

        <div style="text-align:center;margin-bottom:24px;">
          <span style="font-size:20px;font-weight:800;color:#AA27E5;letter-spacing:6px;">NEXURA</span>
          <p style="color:#A0AEC0;font-size:11px;letter-spacing:2px;
                    text-transform:uppercase;margin:4px 0 0;">New Contact Message</p>
        </div>

        <div style="background:#0f0a1d;border:1px solid rgba(139,34,184,0.3);
                    border-radius:16px;overflow:hidden;">
          <div style="height:4px;background:linear-gradient(90deg,#8B22B8,#AA27E5);"></div>
          <div style="padding:28px;">

            <p style="color:#A0AEC0;font-size:12px;margin:0 0 4px;">
              <strong style="color:#AA27E5;">From:</strong> ${senderName}
            </p>
            <p style="color:#A0AEC0;font-size:12px;margin:0 0 20px;">
              <strong style="color:#AA27E5;">Email:</strong>
              <a href="mailto:${senderEmail}" style="color:#AA27E5;">${senderEmail}</a>
            </p>

            <div style="background:rgba(8,5,14,0.5);border:1px solid rgba(139,34,184,0.15);
                        border-radius:10px;padding:16px;">
              <p style="color:#A0AEC0;font-size:11px;text-transform:uppercase;
                         letter-spacing:1px;margin:0 0 10px;">Message</p>
              <p style="color:#F5F4FA;font-size:14px;line-height:1.7;
                         margin:0;white-space:pre-wrap;">${message}</p>
            </div>

            <p style="color:#A0AEC0;font-size:12px;margin:16px 0 0;">
              Reply to this email to respond to ${senderName}.
            </p>

          </div>
        </div>

      </div>
      </body>
    `,
  })

  if (error) {
    console.error("[Resend] Contact notification error:", error)
    throw new Error(error.message)
  }
}
