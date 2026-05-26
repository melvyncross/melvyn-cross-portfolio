/**
 * api/contact.js — Vercel serverless function
 * Receives a contact form submission, sends:
 *   1. Auto-reply to the visitor
 *   2. Lead notification to Melvyn
 *
 * Requires RESEND_API_KEY in Vercel environment variables.
 * Never hardcode the API key — it is read exclusively from process.env.
 */

const RESEND_URL   = 'https://api.resend.com/emails';
const FROM_SENDER  = 'Melvyn Cross <onboarding@resend.dev>';
const FROM_SYSTEM  = 'Portfolio Contact <onboarding@resend.dev>';
const NOTIFY_EMAIL = 'melvyn.cross05@gmail.com';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function autoReplyHtml(name, message) {
  const firstName = name.split(' ')[0];
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
        <h1 style="font-family:Georgia,'Times New Roman',serif;font-size:2.2rem;font-weight:300;line-height:1.15;color:#0A1628;margin:0;">Thanks, ${firstName}.</h1>
      </td></tr>
      <tr><td style="padding-top:28px;padding-bottom:28px;">
        <p style="font-family:-apple-system,BlinkMacSystemFont,'Inter','Helvetica Neue',sans-serif;font-size:1rem;line-height:1.75;color:#2A2419;margin:0 0 16px;">Your message came through. I'll read it properly and get back to you — usually within a day or two.</p>
        <p style="font-family:-apple-system,BlinkMacSystemFont,'Inter','Helvetica Neue',sans-serif;font-size:1rem;line-height:1.75;color:#2A2419;margin:0;">If it's urgent, reach me directly on <a href="https://www.linkedin.com/in/melvyn-botlhe" style="color:#0A1628;text-decoration:underline;">LinkedIn</a>.</p>
      </td></tr>
      <tr><td style="padding-top:8px;padding-bottom:32px;">
        <p style="font-family:Georgia,'Times New Roman',serif;font-size:1rem;font-style:italic;color:#6B5F4C;margin:0;">— Melvyn</p>
      </td></tr>
      <tr><td style="border-top:1px solid rgba(10,22,40,0.1);padding-top:24px;">
        <p style="font-family:'Courier New',monospace;font-size:10px;letter-spacing:0.08em;color:#9E8E7E;margin:0;">melvyn.cross05@gmail.com · melvyncross.com</p>
      </td></tr>
    </table>
  </td></tr>
</table>
</body>
</html>`;
}

function notificationHtml(name, email, message) {
  const safeMsg = message.replace(/</g, '&lt;').replace(/>/g, '&gt;');
  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#ffffff;">
<table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 24px;">
  <tr><td align="center">
    <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">
      <tr><td style="padding-bottom:24px;">
        <span style="font-family:'Courier New',monospace;font-size:10px;letter-spacing:0.12em;text-transform:uppercase;color:#6B5F4C;">🔔 New lead — Portfolio Contact Form</span>
      </td></tr>
      <tr><td style="padding:16px 0;border-top:1px solid #e8e0d6;border-bottom:1px solid #e8e0d6;">
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td width="72" style="font-family:'Courier New',monospace;font-size:10px;letter-spacing:0.08em;text-transform:uppercase;color:#6B5F4C;vertical-align:top;padding:10px 0;border-bottom:1px solid #f0e8e0;">Name</td>
            <td style="font-family:-apple-system,BlinkMacSystemFont,'Helvetica Neue',sans-serif;font-size:15px;color:#0A1628;padding:10px 0 10px 20px;border-bottom:1px solid #f0e8e0;">${name}</td>
          </tr>
          <tr>
            <td width="72" style="font-family:'Courier New',monospace;font-size:10px;letter-spacing:0.08em;text-transform:uppercase;color:#6B5F4C;vertical-align:top;padding:10px 0;border-bottom:1px solid #f0e8e0;">Email</td>
            <td style="font-family:-apple-system,BlinkMacSystemFont,'Helvetica Neue',sans-serif;font-size:15px;color:#0A1628;padding:10px 0 10px 20px;border-bottom:1px solid #f0e8e0;"><a href="mailto:${email}" style="color:#0A1628;">${email}</a></td>
          </tr>
          <tr>
            <td width="72" style="font-family:'Courier New',monospace;font-size:10px;letter-spacing:0.08em;text-transform:uppercase;color:#6B5F4C;vertical-align:top;padding:10px 0;">Message</td>
            <td style="font-family:-apple-system,BlinkMacSystemFont,'Helvetica Neue',sans-serif;font-size:15px;color:#0A1628;line-height:1.6;padding:10px 0 10px 20px;white-space:pre-wrap;">${safeMsg}</td>
          </tr>
        </table>
      </td></tr>
      <tr><td style="padding-top:24px;">
        <p style="font-family:'Courier New',monospace;font-size:10px;color:#9E8E7E;margin:0;">Sent via melvyncross.com · <a href="mailto:${email}" style="color:#9E8E7E;">Reply directly</a></p>
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
  // Only accept POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, email, message } = req.body ?? {};

  // Validation
  if (!name?.trim())                return res.status(400).json({ error: 'Name is required.' });
  if (!email?.trim())               return res.status(400).json({ error: 'Email is required.' });
  if (!EMAIL_RE.test(email.trim())) return res.status(400).json({ error: 'Please enter a valid email address.' });
  if (!message?.trim())             return res.status(400).json({ error: 'Message is required.' });

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error('[contact] RESEND_API_KEY not set');
    return res.status(500).json({ error: 'Server configuration error.' });
  }

  const n = name.trim();
  const e = email.trim().toLowerCase();
  const m = message.trim();

  try {
    // Send both emails concurrently
    await Promise.all([
      sendEmail(apiKey, {
        from:    FROM_SENDER,
        to:      e,
        subject: `Got your message, ${n.split(' ')[0]}`,
        html:    autoReplyHtml(n, m),
      }),
      sendEmail(apiKey, {
        from:    FROM_SYSTEM,
        to:      NOTIFY_EMAIL,
        subject: `New lead: ${n}`,
        html:    notificationHtml(n, e, m),
      }),
    ]);

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('[contact]', err.message);
    return res.status(500).json({ error: 'Could not send your message. Please try again or email me directly.' });
  }
}
