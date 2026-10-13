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

// The small cookie banner comes up almost at once; the heavier chat waits a little longer.
const BANNER_DELAY_MS = 400;
const CHAT_DELAY_MS = 1500;

export function SiteWidgets({ locale, consent, chat }: Props) {
  const [showBanner, setShowBanner] = useState(false);
  const [showChat, setShowChat] = useState(false);

  useEffect(() => {
    const banner = setTimeout(() => setShowBanner(true), BANNER_DELAY_MS);
    const chatTimer = setTimeout(() => setShowChat(true), CHAT_DELAY_MS);
    return () => {
      clearTimeout(banner);
      clearTimeout(chatTimer);
    };
  }, []);

  return (
    <>
      {showBanner && <CookieBanner {...consent} />}
      {showChat && <ChatWidget locale={locale} labels={chat.labels} contact={chat.contact} />}
    </>
  );
}
