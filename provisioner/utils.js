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

const SLUG_RE = /^[a-z0-9][a-z0-9-]{1,31}$/;

function isValidSlug(slug) {
  return typeof slug === 'string' && SLUG_RE.test(slug);
}

module.exports = { randomString, randomPassword, hashToken, isValidSlug, SLUG_RE };
