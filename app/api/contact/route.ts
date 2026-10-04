import { Resend } from 'resend';
import { contactSchema, fieldErrors, type ContactData } from '@/lib/schemas/contact';
import { rateLimit } from '@/lib/utils/rate-limit';

export const dynamic = 'force-dynamic';

const LIMIT = { limit: 5, windowMs: 10 * 60 * 1000 };
const MAX_BODY_BYTES = 20_000;

const json = (body: Record<string, unknown>, status = 200, headers?: HeadersInit) =>
  Response.json(body, { status, headers });

/** Header values must be single-line to prevent header injection. */
const oneLine = (value: string) => value.replace(/[\r\n]+/g, ' ').trim();

function clientIp(request: Request) {
  const forwarded = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim();
  return forwarded || request.headers.get('x-real-ip') || 'unknown';
}

function buildEmail(data: ContactData) {
  const text = [
    `Name: ${data.name}`,
    `Email: ${data.email}`,
    `Company: ${data.company || '-'}`,
    `Project type: ${data.projectType}`,
    `Budget: ${data.budget}`,
    `Timeline: ${data.timeline}`,
    `Site language: ${data.locale}`,
    '',
    data.message,
  ].join('\n');

  return { subject: `New enquiry from ${oneLine(data.name)} (${data.projectType})`, text };
}

export async function POST(request: Request) {
  const rate = rateLimit(clientIp(request), LIMIT);
  if (!rate.ok) {
    return json({ ok: false, error: 'rate-limited' }, 429, {
      'Retry-After': String(rate.retryAfter),
    });
  }

  const raw = await request.text();
  if (raw.length > MAX_BODY_BYTES) return json({ ok: false, error: 'too-large' }, 413);

  let payload: unknown;
  try {
    payload = JSON.parse(raw);
  } catch {
    return json({ ok: false, error: 'invalid-json' }, 400);
  }

  const parsed = contactSchema.safeParse(payload);
  if (!parsed.success) {
    return json({ ok: false, error: 'validation', fields: fieldErrors(parsed.error) }, 400);
  }
  const data = parsed.data;

  // Honeypot: bots fill hidden fields. Pretend success so they get no signal.
  if (data.hp) return json({ ok: true });

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL;
  const from = process.env.CONTACT_FROM_EMAIL;
  const { subject, text } = buildEmail(data);

  if (!apiKey || !to || !from) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn('[contact] Email env vars missing — dev mode, enquiry logged instead of sent.');
      console.info(`[contact] ${subject}\n${text}`);
      return json({ ok: true });
    }
    console.error(
      '[contact] RESEND_API_KEY / CONTACT_TO_EMAIL / CONTACT_FROM_EMAIL not configured',
    );
    return json({ ok: false, error: 'send-failed' }, 503);
  }

  try {
    const { error } = await new Resend(apiKey).emails.send({
      from,
      to,
      replyTo: data.email,
      subject,
      text,
    });
    if (error) throw new Error(error.message);
    return json({ ok: true });
  } catch (err) {
    console.error('[contact] Resend failed:', err instanceof Error ? err.message : err);
    return json({ ok: false, error: 'send-failed' }, 502);
  }
}
