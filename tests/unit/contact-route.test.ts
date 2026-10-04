import { beforeEach, describe, expect, it, vi } from 'vitest';
import { resetRateLimit } from '@/lib/utils/rate-limit';

const { sendMock } = vi.hoisted(() => ({ sendMock: vi.fn() }));
vi.mock('resend', () => ({
  Resend: class {
    emails = { send: sendMock };
  },
}));

import { POST } from '@/app/api/contact/route';

const valid = {
  name: 'Ivan Petrov',
  email: 'ivan@example.com',
  company: '',
  projectType: 'website',
  budget: 'unsure',
  timeline: 'flexible',
  message: 'We need a new website for our small business.',
  consent: true,
  hp: '',
  locale: 'en',
};

let ipCounter = 0;
const post = (body: unknown, ip = `10.0.0.${++ipCounter}`) =>
  POST(
    new Request('http://localhost/api/contact', {
      method: 'POST',
      headers: { 'content-type': 'application/json', 'x-forwarded-for': ip },
      body: typeof body === 'string' ? body : JSON.stringify(body),
    }),
  );

beforeEach(() => {
  resetRateLimit();
  sendMock.mockReset();
  sendMock.mockResolvedValue({ data: { id: '1' }, error: null });
  vi.stubEnv('RESEND_API_KEY', 're_test');
  vi.stubEnv('CONTACT_TO_EMAIL', 'team@example.com');
  vi.stubEnv('CONTACT_FROM_EMAIL', 'site@example.com');
});

describe('POST /api/contact', () => {
  it('sends an email for a valid enquiry', async () => {
    const res = await post(valid);
    expect(res.status).toBe(200);
    expect(sendMock).toHaveBeenCalledOnce();
    const args = sendMock.mock.calls[0]![0];
    expect(args).toMatchObject({ to: 'team@example.com', replyTo: 'ivan@example.com' });
    expect(args.text).toContain('We need a new website');
  });

  it('rejects invalid input with per-field errors', async () => {
    const res = await post({ ...valid, email: 'nope', consent: false });
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.fields).toMatchObject({ email: 'email', consent: 'consent' });
    expect(sendMock).not.toHaveBeenCalled();
  });

  it('uses translation keys even when a field is missing entirely', async () => {
    const { message: _message, ...withoutMessage } = valid;
    void _message;
    const body = await (await post(withoutMessage)).json();
    expect(body.fields.message).toBe('message');
  });

  it('rejects malformed JSON', async () => {
    expect((await post('{not json')).status).toBe(400);
  });

  it('silently drops honeypot submissions', async () => {
    const res = await post({ ...valid, hp: 'http://spam.example' });
    expect(res.status).toBe(200);
    expect(sendMock).not.toHaveBeenCalled();
  });

  it('rate limits repeated requests from one IP', async () => {
    for (let i = 0; i < 5; i++) expect((await post(valid, '9.9.9.9')).status).toBe(200);
    const res = await post(valid, '9.9.9.9');
    expect(res.status).toBe(429);
    expect(res.headers.get('Retry-After')).toBeTruthy();
  });

  it('keeps newlines out of the email subject', async () => {
    await post({ ...valid, name: 'Eve\r\nBcc: victim@example.com' });
    expect(sendMock.mock.calls[0]![0].subject).not.toMatch(/[\r\n]/);
  });

  it('returns 502 when Resend fails', async () => {
    sendMock.mockResolvedValue({ data: null, error: { message: 'boom' } });
    expect((await post(valid)).status).toBe(502);
  });

  it('returns 503 in production when email env vars are missing', async () => {
    vi.stubEnv('RESEND_API_KEY', '');
    vi.stubEnv('NODE_ENV', 'production');
    expect((await post(valid)).status).toBe(503);
  });
});
