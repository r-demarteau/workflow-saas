const nodemailer = require('nodemailer');

function createTransport() {
  return nodemailer.createTransport({
    host:   process.env.SMTP_HOST,
    port:   parseInt(process.env.SMTP_PORT || '587', 10),
    secure: process.env.SMTP_SECURE === 'true',
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
  });
}

const CSS = `
  body { font-family: Inter, system-ui, sans-serif; background: #f9fafb; margin: 0; padding: 40px 0; }
  .card { max-width: 560px; margin: 0 auto; background: #fff; border-radius: 16px; border: 1px solid #e5e7eb; overflow: hidden; }
  .header { background: #2438ec; padding: 32px 40px; }
  .header h1 { color: #fff; margin: 0; font-size: 24px; font-weight: 800; }
  .body { padding: 40px; }
  .btn { display: inline-block; background: #2438ec; color: #fff !important; padding: 14px 32px; border-radius: 8px; font-weight: 700; text-decoration: none; font-size: 15px; }
  .box { border-radius: 10px; padding: 20px 24px; margin: 20px 0; }
  .box-blue { background: #f0f4ff; border: 1px solid #bbd0ff; }
  .box-grey { background: #f9fafb; border: 1px solid #e5e7eb; }
  .box-green { background: #f0fdf4; border: 1px solid #86efac; }
  .label { font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: .05em; margin: 0 0 10px; }
  .label-blue { color: #2438ec; }
  .label-green { color: #16a34a; }
  .label-grey { color: #6b7280; }
  table.creds td { font-size: 14px; padding: 4px 0; }
  table.creds td:first-child { font-size: 12px; font-weight: 700; color: #6b7280; width: 110px; }
  table.creds td:last-child { font-family: monospace; color: #111827; }
  .step-pill { display: inline-block; background: #2438ec; color: #fff; font-size: 11px; font-weight: 700; border-radius: 4px; padding: 2px 7px; margin-right: 6px; }
  .expiry { font-size: 12px; color: #9ca3af; margin-top: 16px; }
  .footer { padding: 24px 40px; border-top: 1px solid #e5e7eb; }
  .footer p { font-size: 12px; color: #9ca3af; margin: 0; }
`;

// ── Email 1: WooCommerce package — fully automated, direct login ──────────────
async function sendWelcomeEmailReady({ email, slug, domain, wpAdminUrl, wpAdminUser, wpAdminPass, wpAppPassword }) {
  const workspaceUrl = `https://${slug}.${domain}`;
  const loginUrl     = `${workspaceUrl}/login`;

  await createTransport().sendMail({
    from:    `"Teamdock" <${process.env.SMTP_FROM || 'noreply@teamdock.ai'}>`,
    to:      email,
    subject: `Your WooCommerce store is live on Teamdock — log in now`,
    html: `<!DOCTYPE html><html><head><meta charset="utf-8"><style>${CSS}</style></head><body>
<div class="card">
  <div class="header"><h1>🎉 Your store is live!</h1></div>
  <div class="body">
    <p style="color:#374151;font-size:15px;">Hi there,<br><br>
    Your Teamdock workspace is provisioned and your WooCommerce store is already connected — no setup wizard needed. Just log in and you're ready to go.</p>

    <div class="box box-green">
      <p class="label label-green">✓ WooCommerce pre-connected</p>
      <p style="margin:0;font-size:14px;color:#374151;">Your store at <strong>${wpAdminUrl.replace('/wp-admin', '')}</strong> is already syncing orders, customers, and products.</p>
    </div>

    <p style="margin:28px 0 12px;font-size:13px;font-weight:700;color:#111827;">Log in to Teamdock</p>
    <a href="${loginUrl}" class="btn">Open my workspace →</a>

    <div class="box box-blue" style="margin-top:16px;">
      <p class="label label-blue">Your Teamdock login</p>
      <p style="margin:0 0 12px;font-size:13px;color:#374151;">Teamdock uses WordPress Application Passwords for authentication. Use the credentials below — <strong>not</strong> your regular WordPress password.</p>
      <table class="creds">
        <tr><td>URL</td><td><a href="${loginUrl}" style="color:#2438ec;">${loginUrl}</a></td></tr>
        <tr><td>Username</td><td>${wpAdminUser}</td></tr>
        <tr><td>App Password</td><td style="font-family:monospace;letter-spacing:.05em;">${wpAppPassword}</td></tr>
      </table>
      <p style="margin:12px 0 0;font-size:12px;color:#6b7280;">This is a generated Application Password — save it somewhere safe. You can create more in WP Admin → Profile → Application Passwords.</p>
    </div>

    <div class="box box-grey">
      <p class="label label-grey">WordPress admin</p>
      <p style="margin:0 0 8px;font-size:14px;color:#374151;">Manage your WordPress + WooCommerce back-end:</p>
      <a href="${wpAdminUrl}" style="color:#2438ec;font-weight:600;word-break:break-all;">${wpAdminUrl}</a>
      <table class="creds" style="margin-top:12px;">
        <tr><td>Username</td><td>${wpAdminUser}</td></tr>
        <tr><td>Password</td><td>${wpAdminPass}</td></tr>
      </table>
      <p style="margin:12px 0 0;font-size:12px;color:#6b7280;">⚠️ Change this password after your first login.</p>
    </div>

    <div class="box box-grey">
      <p class="label label-grey">📌 Bookmark your login page</p>
      <a href="${loginUrl}" style="color:#2438ec;font-weight:600;">${loginUrl}</a>
    </div>
  </div>
  <div class="footer"><p>Teamdock · Questions? Reply to this email or contact support@${domain}</p></div>
</div>
</body></html>`,
    text: `Your WooCommerce store is live on Teamdock!\n\nLog in at: ${loginUrl}\nUsername: ${wpAdminUser}\nApplication Password: ${wpAppPassword}\n(Use this — not your regular WordPress password)\n\nWordPress admin: ${wpAdminUrl}\nUsername: ${wpAdminUser}\nPassword: ${wpAdminPass}\n(Change this after first login)\n\nYour WooCommerce store is already connected and syncing.`,
  });

  console.log(`[email] Ready email sent to ${email}`);
}

// ── Email 2: Bring-your-own WooCommerce (or WP fallback) — setup wizard ───────
async function sendWelcomeEmailSetup({ email, slug, domain, setupToken, wpAdminUrl, wpAdminUser, wpAdminPass, wpInstalled = false, wcInstalled = false }) {
  const workspaceUrl = `https://${slug}.${domain}`;
  const setupUrl     = `${workspaceUrl}/auth/magic?token=${setupToken}`;
  const hasWp        = !!(wpAdminUrl && wpAdminUser && wpAdminPass);

  const wpStatusMsg = wcInstalled
    ? 'WordPress and WooCommerce are installed. Go to <em>WooCommerce → Settings → Advanced → REST API</em> to generate your API keys, then complete setup below.'
    : wpInstalled
      ? 'WordPress is installed. Log in, install WooCommerce, then generate REST API keys under <em>WooCommerce → Settings → Advanced → REST API</em>.'
      : 'Your WordPress site has been provisioned. Log in, complete the WordPress setup, install WooCommerce, and generate REST API keys.';

  const wpBlock = hasWp ? `
    <p style="margin:28px 0 6px;font-size:13px;font-weight:700;color:#111827;"><span class="step-pill">STEP 1</span> WordPress &amp; WooCommerce</p>
    <div class="box box-blue">
      <p class="label label-blue">🌐 Your WordPress site</p>
      <p style="margin:0 0 10px;font-size:14px;color:#374151;">${wpStatusMsg}</p>
      <a href="${wpAdminUrl}" style="color:#2438ec;font-weight:600;word-break:break-all;">${wpAdminUrl}</a>
      <table class="creds" style="margin-top:14px;">
        <tr><td>Username</td><td>${wpAdminUser}</td></tr>
        <tr><td>Password</td><td>${wpAdminPass}</td></tr>
      </table>
      <p style="margin:12px 0 0;font-size:12px;color:#6b7280;">⚠️ Change this password after your first login.</p>
    </div>
    <p style="margin:28px 0 6px;font-size:13px;font-weight:700;color:#111827;"><span class="step-pill">STEP 2</span> Activate Teamdock</p>
    <p style="margin:0 0 16px;font-size:14px;color:#374151;">Once WooCommerce is installed and your API keys are ready, click below to connect your store.</p>
  ` : '';

  const byoSteps = !hasWp ? `
    <div class="box box-grey">
      <p class="label label-grey">What happens next</p>
      <ol style="color:#6b7280;font-size:14px;line-height:1.8;margin:0;padding-left:18px;">
        <li>Connect your WooCommerce store with REST API keys</li>
        <li>Set up your WordPress Application Password for login</li>
        <li>Done — your dashboard is ready</li>
      </ol>
    </div>
  ` : '';

  await createTransport().sendMail({
    from:    `"Teamdock" <${process.env.SMTP_FROM || 'noreply@teamdock.ai'}>`,
    to:      email,
    subject: `Your Teamdock workspace is ready — activate it now`,
    html: `<!DOCTYPE html><html><head><meta charset="utf-8"><style>${CSS}</style></head><body>
<div class="card">
  <div class="header"><h1>🎉 Your workspace is ready!</h1></div>
  <div class="body">
    <p style="color:#374151;font-size:15px;">Hi there,<br><br>
    Your Teamdock workspace has been provisioned at <strong>${workspaceUrl}</strong>.${hasWp ? ' Follow the two steps below to get started.' : " Click the button below to activate it — you'll connect your WooCommerce store and set up your login in a few steps."}</p>

    ${wpBlock}

    <a href="${setupUrl}" class="btn">Activate my workspace →</a>

    <div class="box box-blue" style="margin-top:16px;">
      <p class="label label-blue">Or copy this link</p>
      <a href="${setupUrl}" style="color:#2438ec;word-break:break-all;">${setupUrl}</a>
    </div>

    ${byoSteps}

    <p class="expiry">⏰ This activation link is valid for 14 days. If it expires, visit your workspace and click "Resend activation link".</p>

    <div class="box box-grey">
      <p class="label label-grey">📌 Bookmark your login page</p>
      <p style="margin:0 0 6px;font-size:14px;color:#374151;">After setup, log in at:</p>
      <a href="${workspaceUrl}/login" style="color:#2438ec;font-weight:600;">${workspaceUrl}/login</a>
    </div>
  </div>
  <div class="footer"><p>Teamdock · Questions? Reply to this email or contact support@${domain}</p></div>
</div>
</body></html>`,
    text: `Your Teamdock workspace is ready!\n\n${hasWp ? `STEP 1 — WordPress & WooCommerce\n${wpAdminUrl}\nUsername: ${wpAdminUser}\nPassword: ${wpAdminPass}\n(Change password after first login)\n\nSTEP 2 — Activate Teamdock\n` : ''}Activation link (valid 14 days):\n${setupUrl}\n\nBookmark your login page: ${workspaceUrl}/login`,
  });

  console.log(`[email] Setup email sent to ${email}`);
}

module.exports = { sendWelcomeEmailReady, sendWelcomeEmailSetup };
