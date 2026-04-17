// Resend wrapper. No-ops gracefully if RESEND_API_KEY is missing.
import { Resend } from 'resend';

let cached;
function client() {
  if (cached !== undefined) return cached;
  const key = process.env.RESEND_API_KEY;
  cached = key && key.startsWith('re_') ? new Resend(key) : null;
  return cached;
}

export function emailConfigured() { return !!client(); }

/**
 * send — fire-and-forget email. Never throws; logs on failure so the order
 * flow keeps moving even if the email provider is down.
 */
export async function send({ to, subject, html, text, replyTo }) {
  const c = client();
  if (!c) { console.warn('[email] RESEND_API_KEY missing — skipping', subject); return null; }
  const from = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev';
  const reply_to = replyTo || process.env.RESEND_REPLY_TO || undefined;
  try {
    return await c.emails.send({ from, to, subject, html, text, reply_to });
  } catch (e) {
    console.error('[email] send failed', e?.message || e);
    return null;
  }
}

// -----------------------------------------------------------------------------
// Template helpers. Minimal inline HTML — brand accent + serif heading.
// -----------------------------------------------------------------------------
export function wrap({ title, body, cta }) {
  return `<!doctype html><html><body style="margin:0;padding:0;background:#0f0f1a;">
  <div style="max-width:560px;margin:0 auto;padding:40px 24px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;color:#f5f3ee;">
    <div style="font-family:Georgia,'Fraunces',serif;font-size:28px;font-weight:500;line-height:1.2;margin:0 0 16px;color:#fff;">${title}</div>
    <div style="font-size:16px;line-height:1.6;color:#cfc9d6;">${body}</div>
    ${cta ? `<div style="margin-top:28px;"><a href="${cta.href}" style="display:inline-block;background:linear-gradient(90deg,#FF6B35,#E91E8C,#7B2FF7);color:#fff;text-decoration:none;padding:14px 28px;border-radius:999px;font-weight:600;">${cta.label}</a></div>` : ''}
    <div style="margin-top:40px;padding-top:20px;border-top:1px solid #2c2c48;font-size:12px;color:#6a6580;">
      Songzy · A song written from your words · <a href="${process.env.SITE_URL || 'https://songzy.com'}" style="color:#a8a3b5;">songzy.com</a>
    </div>
  </div></body></html>`;
}
