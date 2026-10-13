'use client';

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import type { ChatLabels } from '@/components/chat/chat-widget';
import type { ConsentLabels } from '@/components/consent/cookie-banner';

// Both widgets are optional extras, so they stay out of the critical path: separate chunks, loaded
// only after the page has settled.
const CookieBanner = dynamic(
  () => import('@/components/consent/cookie-banner').then((m) => m.CookieBanner),
  {
    ssr: false,
  },
);
const ChatWidget = dynamic(
  () => import('@/components/chat/chat-widget').then((m) => m.ChatWidget),
  {
    ssr: false,
  },
);

type Props = {
  locale: 'bg' | 'en';
  consent: { labels: ConsentLabels; analyticsAvailable: boolean; policyHref: string | null };
  chat: { labels: ChatLabels; contact: string };
};

const DEFER_MS = 1500;

export function SiteWidgets({ locale, consent, chat }: Props) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setReady(true), DEFER_MS);
    return () => clearTimeout(timer);
  }, []);

  if (!ready) return null;
  return (
    <>
      <CookieBanner {...consent} />
      <ChatWidget locale={locale} labels={chat.labels} contact={chat.contact} />
    </>
  );
}
