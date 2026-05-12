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

async function sendWelcomeEmail({ email, slug, domain, adminPassword }) {
  const transporter = createTransport();
  const url = `https://${slug}.${domain}`;

  await transporter.sendMail({
    from:    `"NemoFirm" <${process.env.SMTP_FROM || 'noreply@nemofirm.com'}>`,
    to:      email,
    subject: `Your NemoFirm workspace is live — ${slug}.${domain}`,
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
    .url-box a { color: #2438ec; font-size: 20px; font-weight: 700; text-decoration: none; }
    .creds { background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 10px; padding: 20px 24px; margin: 24px 0; }
    .creds p { margin: 4px 0; font-size: 14px; color: #374151; }
    .creds code { font-family: monospace; background: #e5e7eb; padding: 2px 6px; border-radius: 4px; }
    .btn { display: inline-block; background: #2438ec; color: #fff; padding: 14px 32px; border-radius: 8px; font-weight: 700; text-decoration: none; font-size: 15px; }
    .footer { padding: 24px 40px; border-top: 1px solid #e5e7eb; }
    .footer p { font-size: 12px; color: #9ca3af; margin: 0; }
  </style>
</head>
<body>
  <div class="card">
    <div class="header">
      <h1>🎉 Your workspace is live!</h1>
    </div>
    <div class="body">
      <p style="color:#374151;font-size:15px;">Hi there,<br><br>
      Your NemoFirm workspace has been successfully provisioned. You can log in right now:</p>

      <div class="url-box">
        <p style="margin:0 0 6px;font-size:12px;font-weight:600;color:#5c83fc;text-transform:uppercase;letter-spacing:.05em;">Your workspace URL</p>
        <a href="${url}">${url}</a>
      </div>

      <div class="creds">
        <p style="margin:0 0 12px;font-size:12px;font-weight:600;color:#6b7280;text-transform:uppercase;letter-spacing:.05em;">Login credentials</p>
        <p><strong>Email:</strong> <code>${email}</code></p>
        <p><strong>Password:</strong> <code>${adminPassword}</code></p>
        <p style="margin-top:12px;font-size:12px;color:#9ca3af;">⚠️ Change your password after first login.</p>
      </div>

      <p style="color:#374151;font-size:14px;"><strong>Next steps:</strong></p>
      <ol style="color:#6b7280;font-size:14px;line-height:1.8;">
        <li>Log in and change your password</li>
        <li>Go to <strong>Settings → Integrations</strong> and connect your WooCommerce store</li>
        <li>Invite your team members</li>
      </ol>

      <br>
      <a href="${url}" class="btn">Open my workspace →</a>
    </div>
    <div class="footer">
      <p>NemoFirm · Questions? Reply to this email or contact support@${domain}</p>
    </div>
  </div>
</body>
</html>
    `,
    text: `Your NemoFirm workspace is live!\n\nURL: ${url}\nEmail: ${email}\nPassword: ${adminPassword}\n\nChange your password after first login.\n\nNext: go to Settings → Integrations to connect your WooCommerce store.`
  });

  console.log(`[email] Welcome email sent to ${email}`);
}

module.exports = { sendWelcomeEmail };
