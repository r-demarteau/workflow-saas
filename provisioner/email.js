const nodemailer = require('nodemailer');

function createTransport() {
  return nodemailer.createTransport({
    host:   process.env.SMTP_HOST,
    port:   parseInt(process.env.SMTP_PORT || '587', 10),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });
}

async function sendWelcomeEmail({ email, slug, domain, setupToken }) {
  const transporter = createTransport();
  const workspaceUrl = `https://${slug}.${domain}`;
  const setupUrl     = `${workspaceUrl}/auth/magic?token=${setupToken}`;

  await transporter.sendMail({
    from:    `"Teamdock" <${process.env.SMTP_FROM || 'noreply@teamdock.ai'}>`,
    to:      email,
    subject: `Your Teamdock workspace is ready — activate it now`,
    html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: Inter, system-ui, sans-serif; background: #f9fafb; margin: 0; padding: 40px 0; }
    .card { max-width: 560px; margin: 0 auto; background: #fff; border-radius: 16px; border: 1px solid #e5e7eb; overflow: hidden; }
    .header { background: #2438ec; padding: 32px 40px; }
    .header h1 { color: #fff; margin: 0; font-size: 24px; font-weight: 800; }
    .body { padding: 40px; }
    .url-box { background: #f0f4ff; border: 1px solid #bbd0ff; border-radius: 10px; padding: 20px 24px; margin: 24px 0; }
    .url-box a { color: #2438ec; font-size: 18px; font-weight: 700; text-decoration: none; word-break: break-all; }
    .info-box { background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 10px; padding: 20px 24px; margin: 24px 0; }
    .info-box p { margin: 4px 0; font-size: 14px; color: #374151; }
    .btn { display: inline-block; background: #2438ec; color: #fff; padding: 14px 32px; border-radius: 8px; font-weight: 700; text-decoration: none; font-size: 15px; }
    .footer { padding: 24px 40px; border-top: 1px solid #e5e7eb; }
    .footer p { font-size: 12px; color: #9ca3af; margin: 0; }
    .expiry { font-size: 12px; color: #9ca3af; margin-top: 16px; }
  </style>
</head>
<body>
  <div class="card">
    <div class="header">
      <h1>🎉 Your workspace is ready!</h1>
    </div>
    <div class="body">
      <p style="color:#374151;font-size:15px;">Hi there,<br><br>
      Your Teamdock workspace has been provisioned at <strong>${workspaceUrl}</strong>.<br><br>
      Click the button below to activate it — you'll connect your WooCommerce store and set up your login in just a few steps.</p>

      <br>
      <a href="${setupUrl}" class="btn">Activate my workspace →</a>

      <div class="url-box" style="margin-top:28px;">
        <p style="margin:0 0 6px;font-size:12px;font-weight:600;color:#5c83fc;text-transform:uppercase;letter-spacing:.05em;">Or copy this link</p>
        <a href="${setupUrl}">${setupUrl}</a>
      </div>

      <div class="info-box">
        <p style="margin:0 0 12px;font-size:12px;font-weight:600;color:#6b7280;text-transform:uppercase;letter-spacing:.05em;">What happens next</p>
        <ol style="color:#6b7280;font-size:14px;line-height:1.8;margin:0;padding-left:18px;">
          <li>Connect your WooCommerce store with REST API keys</li>
          <li>Set up your WordPress Application Password for login</li>
          <li>Done — your dashboard is ready</li>
        </ol>
      </div>

      <p class="expiry">⏰ This activation link is valid for 14 days. If it expires, visit your workspace and click "Resend activation link".</p>

      <div class="info-box" style="margin-top:24px;">
        <p style="margin:0 0 6px;font-size:12px;font-weight:600;color:#6b7280;text-transform:uppercase;letter-spacing:.05em;">📌 Bookmark your login page</p>
        <p style="margin:0;font-size:14px;color:#374151;">After setup, you can always log in at:</p>
        <a href="${workspaceUrl}/login" style="color:#2438ec;font-weight:600;word-break:break-all;">${workspaceUrl}/login</a>
      </div>
    </div>
    <div class="footer">
      <p>Teamdock · Questions? Reply to this email or contact support@${domain}</p>
    </div>
  </div>
</body>
</html>
    `,
    text: `Your Teamdock workspace is ready!\n\nActivate it here (valid 14 days):\n${setupUrl}\n\nWhat happens next:\n1. Connect your WooCommerce store\n2. Set up your WordPress Application Password\n3. Done!\n\nBookmark your login page: ${workspaceUrl}/login`
  });

  console.log(`[email] Welcome email sent to ${email}`);
}

module.exports = { sendWelcomeEmail };
