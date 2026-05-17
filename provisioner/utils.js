const crypto = require('crypto');

function randomString(bytes = 32) {
  return crypto.randomBytes(bytes).toString('hex');
}

function randomPassword(length = 16) {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789!@#';
  return Array.from(crypto.randomBytes(length))
    .map(b => chars[b % chars.length])
    .join('');
}

function hashToken(raw) {
  return crypto.createHash('sha256').update(raw).digest('hex');
}

// Matches teamdock's encryptField in src/lib/encryption.ts.
// Output format: enc1:<iv_b64>.<authTag_b64>.<ciphertext_b64>
function encryptSetting(plaintext, rawKey) {
  const key        = crypto.createHash('sha256').update(rawKey).digest();
  const iv         = crypto.randomBytes(12);
  const cipher     = crypto.createCipheriv('aes-256-gcm', key, iv);
  const ciphertext = Buffer.concat([cipher.update(plaintext, 'utf8'), cipher.final()]);
  const tag        = cipher.getAuthTag();
  return 'enc1:' + [iv, tag, ciphertext].map(b => b.toString('base64')).join('.');
}

const SLUG_RE = /^[a-z0-9][a-z0-9-]{1,31}$/;

function isValidSlug(slug) {
  return typeof slug === 'string' && SLUG_RE.test(slug);
}

module.exports = { randomString, randomPassword, hashToken, isValidSlug, SLUG_RE, encryptSetting };
