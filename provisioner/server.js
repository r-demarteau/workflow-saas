require('dotenv').config();
const express = require('express');
const { provisionTenant } = require('./provision');

const app  = express();
const PORT = process.env.PROVISIONER_PORT || 3050;
const SECRET = process.env.PROVISION_API_SECRET;

if (!SECRET) {
  console.error('PROVISION_API_SECRET is not set — refusing to start.');
  process.exit(1);
}

app.use(express.json());

// ── Auth middleware ──────────────────────────────────────────────────────────
app.use((req, res, next) => {
  const auth = req.headers['authorization'] ?? '';
  if (auth !== `Bearer ${SECRET}`) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  next();
});

// ── Health ───────────────────────────────────────────────────────────────────
app.get('/health', (_, res) => res.json({ ok: true }));

// ── Provision ────────────────────────────────────────────────────────────────
app.post('/provision', async (req, res) => {
  const { slug, plan, email } = req.body ?? {};

  if (!slug || !plan || !email) {
    return res.status(400).json({ error: 'Missing slug, plan or email.' });
  }

  const slugPattern = /^[a-z0-9][a-z0-9-]{1,31}$/;
  if (!slugPattern.test(slug)) {
    return res.status(400).json({ error: 'Invalid slug.' });
  }

  console.log(`[provision] Starting provisioning for ${slug} (${plan}) — ${email}`);

  try {
    const result = await provisionTenant({ slug, plan, email });
    console.log(`[provision] Done: ${slug}.nemofirm.com on port ${result.port}`);
    return res.json({ ok: true, url: `https://${slug}.nemofirm.com`, port: result.port });
  } catch (err) {
    console.error(`[provision] Failed for ${slug}:`, err);
    return res.status(500).json({ error: String(err.message ?? err) });
  }
});

app.listen(PORT, '127.0.0.1', () => {
  console.log(`[provisioner] Listening on 127.0.0.1:${PORT}`);
});
