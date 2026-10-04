import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';

/** Catch-all so unknown URLs render the styled 404 inside the locale layout. */
export default async function CatchAll({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  notFound();
}
