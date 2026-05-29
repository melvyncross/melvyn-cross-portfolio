/**
 * api/subscribe.js — Vercel serverless function
 * Handles newsletter subscription:
 *   1. Validates email
 *   2. Sends welcome email to subscriber
 *   3. Sends subscriber notification to Melvyn
 *
 * RESEND_API_KEY must be set in Vercel environment variables — never committed.
 *
 * Note: To auto-email subscribers when a new blog post goes live, wire up
 * a Sanity webhook → /api/blog-notify (future feature).
 */

const RESEND_URL    = 'https://api.resend.com/emails';
const RESEND_CONTACTS_URL = 'https://api.resend.com/audiences';
const FROM_SENDER   = 'Melvyn Cross <onboarding@resend.dev>';
const FROM_SYSTEM   = 'Portfolio <onboarding@resend.dev>';
const NOTIFY_EMAIL  = 'melvyn.cross05@gmail.com';

// ── Add email to Resend Contacts audience (non-fatal if not configured) ──
async function addToAudience(apiKey, email) {
  const audienceId = process.env.RESEND_AUDIENCE_ID;
  if (!audienceId) return; // silently skip if not configured
  try {
    await fetch(`${RESEND_CONTACTS_URL}/${audienceId}/contacts`, {
      method:  'POST',
      headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body:    JSON.stringify({ email, unsubscribed: false }),
    });
  } catch (err) {
    // Non-fatal — welcome email still goes out
    console.error('[subscribe] Contacts API error (non-fatal):', err.message);
  }
}

const EMAIL_RE  = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_EMAIL = 254; // RFC 5321 max

// Full HTML entity escaping — consistent with contact.js
function esc(s) {
  return String(s || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

// ── Origin allowlist — only accept requests from the live site and local dev ──
const ALLOWED_ORIGINS = new Set([
  'https://melvyncross.com',
  'https://www.melvyncross.com',
]);
function isOriginAllowed(req) {
  const origin = (req.headers.origin || '').trim();
  if (!origin) return false;
  if (ALLOWED_ORIGINS.has(origin)) return true;
  if (/^https:\/\/[\w-]+-melvyn-cross-projects\.vercel\.app$/.test(origin)) return true;
  if (/^https?:\/\/localhost(:\d+)?$/.test(origin)) return true;
  if (/^https?:\/\/127\.0\.0\.1(:\d+)?$/.test(origin)) return true;
  return false;
}

function welcomeHtml(emailRaw) {
  const email = esc(emailRaw);
  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#F5EDE0;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#F5EDE0;padding:48px 24px;">
  <tr><td align="center">
    <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#F5EDE0;">
      <tr><td style="padding-bottom:32px;">
        <span style="font-family:'Courier New',monospace;font-size:11px;letter-spacing:0.12em;text-transform:uppercase;color:#6B5F4C;">MC — The Dispatch</span>
      </td></tr>
      <tr><td style="padding-bottom:24px;border-bottom:1px solid rgba(10,22,40,0.1);">
        <h1 style="font-family:Georgia,'Times New Roman',serif;font-size:2.2rem;font-weight:300;line-height:1.15;color:#0A1628;margin:0;">You're in.</h1>
      </td></tr>
      <tr><td style="padding-top:28px;padding-bottom:28px;">
        <p style="font-family:-apple-system,BlinkMacSystemFont,'Inter','Helvetica Neue',sans-serif;font-size:1rem;line-height:1.75;color:#2A2419;margin:0 0 16px;">Welcome to The Dispatch. When I publish a new article — case studies, e-commerce thinking, things I'm building or learning — you'll get it straight to your inbox.</p>
        <p style="font-family:-apple-system,BlinkMacSystemFont,'Inter','Helvetica Neue',sans-serif;font-size:1rem;line-height:1.75;color:#2A2419;margin:0;">No noise. No fluff. Just the work.</p>
      </td></tr>
      <tr><td style="padding-bottom:28px;">
        <a href="https://melvyncross.com/blog" style="display:inline-block;background:#0A1628;color:#F5EDE0;font-family:'Courier New',monospace;font-size:11px;letter-spacing:0.1em;text-transform:uppercase;text-decoration:none;padding:14px 24px;border-radius:3px;">Read the latest →</a>
      </td></tr>
      <tr><td style="padding-top:8px;padding-bottom:32px;">
        <p style="font-family:Georgia,'Times New Roman',serif;font-size:1rem;font-style:italic;color:#6B5F4C;margin:0;">— Melvyn</p>
      </td></tr>
      <tr><td style="border-top:1px solid rgba(10,22,40,0.1);padding-top:24px;">
        <p style="font-family:'Courier New',monospace;font-size:10px;letter-spacing:0.08em;color:#9E8E7E;margin:0;">melvyncross.com · You subscribed with ${email}</p>
      </td></tr>
    </table>
  </td></tr>
</table>
</body>
</html>`;
}

function notifyHtml(email) {
  const safeEmail = esc(email);
  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#ffffff;">
<table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 24px;">
  <tr><td align="center">
    <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">
      <tr><td style="padding-bottom:24px;">
        <span style="font-family:'Courier New',monospace;font-size:10px;letter-spacing:0.12em;text-transform:uppercase;color:#6B5F4C;">📬 New Dispatch subscriber</span>
      </td></tr>
      <tr><td style="padding:20px 0;border-top:1px solid #e8e0d6;border-bottom:1px solid #e8e0d6;">
        <p style="font-family:-apple-system,BlinkMacSystemFont,'Helvetica Neue',sans-serif;font-size:15px;color:#0A1628;margin:0;"><strong>${safeEmail}</strong> just subscribed to The Dispatch.</p>
      </td></tr>
      <tr><td style="padding-top:24px;">
        <p style="font-family:'Courier New',monospace;font-size:10px;color:#9E8E7E;margin:0;">Via melvyncross.com footer · <a href="mailto:${safeEmail}" style="color:#9E8E7E;">Reply to subscriber</a></p>
      </td></tr>
    </table>
  </td></tr>
</table>
</body>
</html>`;
}

async function sendEmail(apiKey, payload) {
  const res = await fetch(RESEND_URL, {
    method:  'POST',
    headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body:    JSON.stringify(payload),
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Resend ${res.status}: ${body}`);
  }
  return res.json();
}

export default async function handler(req, res) {
  res.setHeader('Content-Type', 'application/json');

  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    return res.status(204).end();
  }

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST, OPTIONS');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Origin guard — reject requests not from the live site or local dev
  if (!isOriginAllowed(req)) {
    return res.status(403).json({ error: 'Forbidden.' });
  }

  const { email, website } = req.body ?? {};

  // Honeypot — bots fill this hidden field; humans never see it
  if (website && website.trim() !== '') {
    return res.status(400).json({ error: 'Bad request.' });
  }

  if (!email?.trim())                          return res.status(400).json({ error: 'Please enter your email address.' });
  if (email.trim().length > MAX_EMAIL)         return res.status(400).json({ error: 'Email address is too long.' });
  if (!EMAIL_RE.test(email.trim()))            return res.status(400).json({ error: 'Please enter a valid email address.' });

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error('[subscribe] RESEND_API_KEY not set');
    return res.status(500).json({ error: 'Server configuration error.' });
  }

  const e = email.trim().toLowerCase();

  try {
    // Persist to audience list + send emails concurrently
    await Promise.all([
      addToAudience(apiKey, e),
      sendEmail(apiKey, {
        from:    FROM_SENDER,
        to:      e,
        subject: 'Welcome to The Dispatch',
        html:    welcomeHtml(e),
      }),
      sendEmail(apiKey, {
        from:    FROM_SYSTEM,
        to:      NOTIFY_EMAIL,
        subject: `New subscriber: ${e}`,
        html:    notifyHtml(e),
      }),
    ]);

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('[subscribe]', err.message);
    return res.status(500).json({ error: 'Something went wrong. Please try again.' });
  }
}
