import nodemailer from "nodemailer"

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
})

interface SendEmailParams {
  to: string
  participantName: string
  eventName: string
  eventDate: string
  eventVenue: string
}

export async function sendConfirmationEmail({
  to,
  participantName,
  eventName,
  eventDate,
  eventVenue,
}: SendEmailParams) {
  const formattedDate = new Date(eventDate).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  })

  const mailOptions = {
    from: `"Nexura Club" <${process.env.MAIL_USER}>`,
    to,
    subject: `Registration Confirmed — ${eventName}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body {
            background-color: #08050e;
            color: #F5F4FA;
            font-family: 'Outfit', 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            margin: 0;
            padding: 40px 20px;
          }
          .container {
            max-width: 580px;
            margin: 0 auto;
            background-color: #0f0a1d;
            border: 1px solid rgba(139, 34, 184, 0.25);
            border-radius: 16px;
            overflow: hidden;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
          }
          .header {
            background: linear-gradient(135deg, #8B22B8, #AA27E5);
            padding: 30px 20px;
            text-align: center;
          }
          .header h1 {
            margin: 0;
            font-size: 24px;
            font-weight: 700;
            letter-spacing: 2px;
            color: #F5F4FA;
          }
          .content {
            padding: 40px 30px;
          }
          .welcome-text {
            font-size: 18px;
            color: #AA27E5;
            font-weight: 600;
            margin-bottom: 20px;
          }
          .message {
            font-size: 15px;
            line-height: 1.6;
            color: #A0AEC0;
            margin-bottom: 30px;
          }
          .details-card {
            background-color: rgba(139, 34, 184, 0.08);
            border: 1px solid rgba(139, 34, 184, 0.15);
            border-radius: 12px;
            padding: 20px;
            margin-bottom: 30px;
          }
          .detail-row {
            display: flex;
            margin-bottom: 12px;
            font-size: 14px;
          }
          .detail-row:last-child {
            margin-bottom: 0;
          }
          .detail-label {
            width: 100px;
            color: #AA27E5;
            font-weight: 600;
            flex-shrink: 0;
          }
          .detail-value {
            color: #F5F4FA;
          }
          .footer {
            text-align: center;
            padding: 20px;
            border-top: 1px solid rgba(139, 34, 184, 0.1);
            font-size: 12px;
            color: #A0AEC0;
          }
          .footer-logo {
            color: #AA27E5;
            font-weight: 700;
            letter-spacing: 1px;
            margin-bottom: 5px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>NEXURA CLUB</h1>
          </div>
          <div class="content">
            <div class="welcome-text">Hello ${participantName},</div>
            <div class="message">
              Your registration for the upcoming event <strong>${eventName}</strong> has been successfully confirmed. We are thrilled to have you join us! Please review the event details below:
            </div>
            <div class="details-card">
              <div class="detail-row">
                <div class="detail-label">Event:</div>
                <div class="detail-value">${eventName}</div>
              </div>
              <div class="detail-row">
                <div class="detail-label">Date:</div>
                <div class="detail-value">${formattedDate}</div>
              </div>
              <div class="detail-row">
                <div class="detail-label">Venue:</div>
                <div class="detail-value">${eventVenue}</div>
              </div>
            </div>
            <div class="message">
              If you have any questions or require support, please contact us at nexurargpv@gmail.com.
            </div>
          </div>
          <div class="footer">
            <div class="footer-logo">NEXURA</div>
            Student-led Automobile Engineering Club<br>
            UIT-RGPV, Bhopal
          </div>
        </div>
      </body>
      </html>
    `,
  }

  await transporter.sendMail(mailOptions)
}
