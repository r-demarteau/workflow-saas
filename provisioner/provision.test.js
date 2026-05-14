'use strict';

const { test, describe } = require('node:test');
const assert = require('node:assert/strict');
const mysql = require('mysql2');
const { randomString, randomPassword, hashToken, isValidSlug } = require('./utils');

// ── randomString ──────────────────────────────────────────────────────────────

describe('randomString', () => {
  test('returns a hex string of the expected length', () => {
    const s = randomString(24);
    assert.match(s, /^[0-9a-f]+$/);
    assert.equal(s.length, 48); // 24 bytes → 48 hex chars
  });

  test('defaults to 32 bytes (64 hex chars)', () => {
    assert.equal(randomString().length, 64);
  });

  test('each call produces a unique value', () => {
    assert.notEqual(randomString(), randomString());
  });
});

// ── randomPassword ────────────────────────────────────────────────────────────

describe('randomPassword', () => {
  const CHARSET = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789!@#';

  test('returns a string of the correct length', () => {
    assert.equal(randomPassword(16).length, 16);
    assert.equal(randomPassword(24).length, 24);
  });

  test('only contains characters from the allowed charset', () => {
    const p = randomPassword(64);
    for (const ch of p) {
      assert.ok(CHARSET.includes(ch), `unexpected char: ${ch}`);
    }
  });

  test('each call produces a unique value', () => {
    assert.notEqual(randomPassword(), randomPassword());
  });
});

// ── hashToken ─────────────────────────────────────────────────────────────────

describe('hashToken', () => {
  test('returns a 64-char lowercase hex string', () => {
    const h = hashToken('test');
    assert.equal(h.length, 64);
    assert.match(h, /^[0-9a-f]{64}$/);
  });

  test('is deterministic for the same input', () => {
    assert.equal(hashToken('abc'), hashToken('abc'));
  });

  test('produces different hashes for different tokens', () => {
    assert.notEqual(hashToken(randomString()), hashToken(randomString()));
  });

  test('raw token does NOT equal its hash', () => {
    const raw = randomString(32);
    assert.notEqual(raw, hashToken(raw));
  });

  test('matches known SHA-256 vector', () => {
    // echo -n "hello" | sha256sum → 2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824
    assert.equal(hashToken('hello'), '2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824');
  });
});

// ── isValidSlug ───────────────────────────────────────────────────────────────

describe('isValidSlug', () => {
  test('accepts valid slugs', () => {
    assert.ok(isValidSlug('acme'));
    assert.ok(isValidSlug('my-store'));
    assert.ok(isValidSlug('abc123'));
    assert.ok(isValidSlug('a1'));
    assert.ok(isValidSlug('x'.repeat(32)));
  });

  test('rejects slugs that are too short', () => {
    assert.ok(!isValidSlug('a'));   // only 1 char — pattern requires [a-z0-9]{1,31} after first
    assert.ok(!isValidSlug(''));
  });

  test('rejects slugs that are too long', () => {
    assert.ok(!isValidSlug('a'.repeat(33)));
  });

  test('rejects slugs starting with a hyphen', () => {
    assert.ok(!isValidSlug('-acme'));
  });

  test('rejects uppercase, spaces, and special characters', () => {
    assert.ok(!isValidSlug('Acme'));
    assert.ok(!isValidSlug('my store'));
    assert.ok(!isValidSlug('acme!'));
    assert.ok(!isValidSlug('acme_store'));
  });

  test('rejects non-string values', () => {
    assert.ok(!isValidSlug(null));
    assert.ok(!isValidSlug(undefined));
    assert.ok(!isValidSlug(123));
  });
});

// ── SQL escaping via mysql2 ───────────────────────────────────────────────────

describe('mysql2.escape — SQL injection prevention', () => {
  test('wraps strings in single quotes', () => {
    assert.equal(mysql.escape('hello'), "'hello'");
  });

  test('escapes embedded single quotes', () => {
    assert.equal(mysql.escape("O'Brien"), "'O\\'Brien'");
  });

  test('escapes SQL meta-characters that could end the statement', () => {
    const malicious = "'; DROP TABLE settings; --";
    const escaped = mysql.escape(malicious);
    // mysql2 produces: '\'; DROP TABLE settings; --'
    // Strip the outer wrapping quotes, then remove all \' (legitimately escaped) sequences.
    // Any remaining bare ' would be an injection hole.
    const interior = escaped.slice(1, -1);
    const withEscapedRemoved = interior.replace(/\\'/g, '');
    assert.ok(
      !withEscapedRemoved.includes("'"),
      `found unescaped single quote after stripping \\' sequences: ${withEscapedRemoved}`
    );
  });

  test('null is rendered as NULL (not a quoted string)', () => {
    assert.equal(mysql.escape(null), 'NULL');
  });

  test('numbers are rendered without quotes', () => {
    assert.equal(mysql.escape(42), '42');
  });

  test('email with plus sign is preserved correctly', () => {
    const email = 'user+tag@example.com';
    const escaped = mysql.escape(email);
    assert.ok(escaped.includes('user+tag@example.com'));
  });
});

// ── Token hashing end-to-end ──────────────────────────────────────────────────

describe('token hash round-trip (provisioner → auth verification)', () => {
  test('verifying the hash of the raw token succeeds', () => {
    const rawToken  = randomString(32);
    const storedHash = hashToken(rawToken);

    // Simulates what auth.ts does: hash the incoming URL token and compare to DB value
    assert.equal(hashToken(rawToken), storedHash);
  });

  test('a different token does not match the stored hash', () => {
    const rawToken   = randomString(32);
    const storedHash = hashToken(rawToken);
    const wrongToken = randomString(32);

    assert.notEqual(hashToken(wrongToken), storedHash);
  });

  test('raw token cannot be used as-is to match a hashed DB value', () => {
    const rawToken   = randomString(32);
    const storedHash = hashToken(rawToken);

    assert.notEqual(rawToken, storedHash);
  });
});
