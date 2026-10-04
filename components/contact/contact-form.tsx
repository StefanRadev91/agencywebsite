'use client';

import { useLocale, useTranslations } from 'next-intl';
import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox, Input, Select, Textarea } from '@/components/ui/form-fields';
import { Link } from '@/i18n/navigation';
import { siteConfig } from '@/lib/config';
import { validateContact } from '@/lib/contact-validation';
import { budgets, projectTypes, timelines } from '@/lib/schemas/contact-options';

type Status = 'idle' | 'submitting' | 'success' | 'error' | 'rate-limited';

const empty = {
  name: '',
  email: '',
  company: '',
  projectType: '',
  budget: '',
  timeline: '',
  message: '',
  consent: false,
  hp: '',
};

export function ContactForm() {
  const t = useTranslations('Contact');
  const locale = useLocale();
  const [values, setValues] = useState(empty);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<Status>('idle');
  const resultRef = useRef<HTMLDivElement>(null);

  // Move focus to the result so screen-reader users hear it.
  useEffect(() => {
    if (status === 'success' || status === 'error' || status === 'rate-limited') {
      resultRef.current?.focus();
    }
  }, [status]);

  const set =
    (field: keyof typeof empty) =>
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const value =
        event.target instanceof HTMLInputElement && event.target.type === 'checkbox'
          ? event.target.checked
          : event.target.value;
      setValues((v) => ({ ...v, [field]: value }));
      setErrors((e) => ({ ...e, [field]: '' }));
    };

  const err = (field: string) => (errors[field] ? t(`errors.${errors[field]}`) : undefined);
  const options = (group: string, keys: readonly string[]) =>
    keys.map((key) => ({ value: key, label: t(`options.${group}.${key}`) }));

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    const found = validateContact(values);
    if (Object.keys(found).length > 0) {
      setErrors(found);
      setStatus('idle');
      return;
    }

    setStatus('submitting');
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...values, locale }),
      });
      if (response.ok) {
        setStatus('success');
        setValues(empty);
        return;
      }
      if (response.status === 429) return setStatus('rate-limited');
      if (response.status === 400) {
        const body = (await response.json().catch(() => null)) as {
          fields?: Record<string, string>;
        } | null;
        if (body?.fields) {
          setErrors(body.fields);
          return setStatus('idle');
        }
      }
      setStatus('error');
    } catch {
      setStatus('error');
    }
  }

  if (status === 'success') {
    return (
      <div
        ref={resultRef}
        tabIndex={-1}
        role="status"
        className="border-accent-ink bg-surface rounded-lg border p-8 outline-none"
      >
        <h2 className="font-display text-h3 font-extrabold">{t('success.title')}</h2>
        <p className="text-muted mt-3">{t('success.text')}</p>
        <div className="mt-6">
          <Button variant="secondary" onClick={() => setStatus('idle')}>
            {t('success.again')}
          </Button>
        </div>
      </div>
    );
  }

  const hasErrors = Object.values(errors).some(Boolean);

  return (
    <form onSubmit={onSubmit} noValidate className="grid gap-6" aria-label={t('form.label')}>
      {(status === 'error' || status === 'rate-limited') && (
        <div
          ref={resultRef}
          tabIndex={-1}
          role="alert"
          className="border-danger text-danger rounded-md border p-4 text-sm outline-none"
        >
          {t(status === 'error' ? 'status.error' : 'status.rateLimited', {
            email: siteConfig.email,
          })}
        </div>
      )}
      {hasErrors && (
        <p role="alert" className="text-danger text-sm">
          {t('status.fixErrors')}
        </p>
      )}

      <div className="grid gap-6 sm:grid-cols-2">
        <Input
          label={t('form.name')}
          name="name"
          autoComplete="name"
          required
          value={values.name}
          onChange={set('name')}
          error={err('name')}
        />
        <Input
          label={t('form.email')}
          name="email"
          type="email"
          autoComplete="email"
          required
          value={values.email}
          onChange={set('email')}
          error={err('email')}
        />
      </div>

      <Input
        label={t('form.company')}
        name="company"
        autoComplete="organization"
        optionalLabel={t('form.optional')}
        value={values.company}
        onChange={set('company')}
        error={err('company')}
      />

      <div className="grid gap-6 sm:grid-cols-3">
        <Select
          label={t('form.projectType')}
          name="projectType"
          placeholder={t('form.select')}
          options={options('projectType', projectTypes)}
          required
          value={values.projectType}
          onChange={set('projectType')}
          error={err('projectType')}
        />
        <Select
          label={t('form.budget')}
          name="budget"
          placeholder={t('form.select')}
          options={options('budget', budgets)}
          required
          value={values.budget}
          onChange={set('budget')}
          error={err('budget')}
        />
        <Select
          label={t('form.timeline')}
          name="timeline"
          placeholder={t('form.select')}
          options={options('timeline', timelines)}
          required
          value={values.timeline}
          onChange={set('timeline')}
          error={err('timeline')}
        />
      </div>

      <Textarea
        label={t('form.message')}
        name="message"
        hint={t('form.messageHint')}
        required
        value={values.message}
        onChange={set('message')}
        error={err('message')}
      />

      {/* Honeypot: hidden from people and assistive tech, tempting for bots. */}
      <div aria-hidden className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label>
          {t('form.honeypot')}
          <input
            type="text"
            name="hp"
            tabIndex={-1}
            autoComplete="off"
            value={values.hp}
            onChange={set('hp')}
          />
        </label>
      </div>

      <Checkbox
        name="consent"
        checked={values.consent}
        onChange={set('consent')}
        error={err('consent')}
        label={t.rich('form.consent', {
          privacy: (chunks) => (
            <Link href="/legal/privacy" className="underline underline-offset-4">
              {chunks}
            </Link>
          ),
        })}
      />

      <div>
        <Button type="submit" size="lg" disabled={status === 'submitting'} magnetic={false}>
          {status === 'submitting' ? t('form.submitting') : t('form.submit')}
        </Button>
      </div>
    </form>
  );
}
