'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { ChatIcon, CloseIcon, SendIcon } from '@/components/ui/icons';
import { Link } from '@/i18n/navigation';
import { fillAnswer, findAnswer } from '@/lib/chat-match';
import { CONSENT_CHANGE_EVENT, CONSENT_OPEN_EVENT, getConsent } from '@/lib/consent';
import type { FaqEntry } from '@/lib/schemas/faq';

export type ChatLabels = {
  open: string;
  close: string;
  title: string;
  status: string;
  disclaimer: string;
  welcome: string;
  fallback: string;
  inputLabel: string;
  placeholder: string;
  send: string;
  chips: string;
  typing: string;
  cta: string;
  teaser: string;
  teaserOpen: string;
  teaserDismiss: string;
};

type Message = { id: number; role: 'bot' | 'user'; text: string; cta?: boolean };

type Props = { labels: ChatLabels; locale: 'bg' | 'en'; contact: string };

const TEASER_KEY = 'nw_chat_teaser';
const TEASER_DELAY = 7000;
const TEASER_VISIBLE = 14000;
const MAX_CHIPS = 5;

const loadFaq = () =>
  import('@/content/faq.json').then((mod) => mod.default.entries as unknown as FaqEntry[]);

const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function safeSession(action: 'get' | 'set') {
  try {
    if (action === 'set') sessionStorage.setItem(TEASER_KEY, '1');
    else return sessionStorage.getItem(TEASER_KEY) === '1';
  } catch {
    // Storage can be blocked; the teaser then simply may show again.
  }
  return false;
}

/**
 * A small rule-based assistant: it answers frequent questions from content/faq.json.
 * It is clearly labelled as automatic and always points to a human contact for anything else.
 */
export function ChatWidget({ labels, locale, contact }: Props) {
  const [ready, setReady] = useState(false);
  const [open, setOpen] = useState(false);
  const [teaser, setTeaser] = useState(false);
  const [bannerOpen, setBannerOpen] = useState(() => !getConsent());
  const [entries, setEntries] = useState<FaqEntry[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [chips, setChips] = useState<FaqEntry[]>([]);
  const [typing, setTyping] = useState(false);
  const [streaming, setStreaming] = useState(false);
  const [announce, setAnnounce] = useState('');
  const [input, setInput] = useState('');

  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const launcherRef = useRef<HTMLButtonElement>(null);
  const nextId = useRef(1);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const faqRequested = useRef(false);

  const later = (fn: () => void, ms: number) => {
    timers.current.push(setTimeout(fn, ms));
  };

  // The launcher itself arrives a moment after the page settles.
  useEffect(() => {
    const timer = setTimeout(() => setReady(true), 1000);
    const pending = timers.current;
    return () => {
      clearTimeout(timer);
      pending.forEach(clearTimeout);
    };
  }, []);

  // Track the cookie banner so the invitation never competes with it.
  useEffect(() => {
    const close = () => setBannerOpen(false);
    const reopen = () => setBannerOpen(true);
    window.addEventListener(CONSENT_CHANGE_EVENT, close);
    window.addEventListener(CONSENT_OPEN_EVENT, reopen);
    return () => {
      window.removeEventListener(CONSENT_CHANGE_EVENT, close);
      window.removeEventListener(CONSENT_OPEN_EVENT, reopen);
    };
  }, []);

  // One friendly invitation per session, shortly after the visitor has settled in.
  useEffect(() => {
    if (!ready || bannerOpen || open || safeSession('get')) return;
    const show = setTimeout(() => {
      safeSession('set');
      setTeaser(true);
    }, TEASER_DELAY);
    return () => clearTimeout(show);
  }, [ready, bannerOpen, open]);

  useEffect(() => {
    if (!teaser) return;
    const hide = setTimeout(() => setTeaser(false), TEASER_VISIBLE);
    return () => clearTimeout(hide);
  }, [teaser]);

  const ensureFaq = useCallback(() => {
    if (faqRequested.current) return;
    faqRequested.current = true;
    loadFaq().then((all) => {
      setEntries(all);
      setChips(all.filter((e) => e.suggested).slice(0, MAX_CHIPS));
    });
  }, []);

  useEffect(() => {
    if (!open) return;
    ensureFaq();
    setMessages((current) =>
      current.length ? current : [{ id: nextId.current++, role: 'bot', text: labels.welcome }],
    );
    inputRef.current?.focus();
  }, [open, ensureFaq, labels.welcome]);

  // Follow new text, but never yank the visitor back down while they are reading earlier messages.
  const stickToBottom = useRef(true);
  useEffect(() => {
    const list = listRef.current;
    if (list && stickToBottom.current) list.scrollTo({ top: list.scrollHeight, behavior: 'auto' });
  }, [messages, typing]);

  const close = useCallback(() => {
    setOpen(false);
    launcherRef.current?.focus();
  }, []);

  // Escape closes the chat from anywhere (focus is often on the page after a chip is clicked).
  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => event.key === 'Escape' && close();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, close]);

  const toggle = () => {
    setTeaser(false);
    setOpen((value) => !value);
  };

  function reply(answer: string, cta: boolean, follow: FaqEntry[]) {
    const id = nextId.current++;
    const words = answer.split(' ');
    const instant = reducedMotion();
    setTyping(true);
    setStreaming(true);
    const thinking = instant ? 100 : Math.min(500 + answer.length * 4, 1100);

    later(() => {
      setTyping(false);
      if (instant) {
        setMessages((m) => [...m, { id, role: 'bot', text: answer, cta }]);
        finish();
        return;
      }
      setMessages((m) => [...m, { id, role: 'bot', text: '' }]);
      let shown = 0;
      const step = () => {
        shown = Math.min(words.length, shown + 2);
        const done = shown >= words.length;
        setMessages((m) =>
          m.map((msg) =>
            msg.id === id
              ? { ...msg, text: words.slice(0, shown).join(' '), cta: done && cta }
              : msg,
          ),
        );
        if (done) finish();
        else later(step, 32);
      };
      step();
    }, thinking);

    function finish() {
      setStreaming(false);
      setAnnounce(answer);
      setChips(follow.length ? follow : entries.filter((e) => e.suggested).slice(0, MAX_CHIPS));
    }
  }

  function ask(text: string, direct?: FaqEntry) {
    const question = text.trim();
    if (!question || typing || streaming) return;
    stickToBottom.current = true;
    setMessages((m) => [...m, { id: nextId.current++, role: 'user', text: question }]);
    setInput('');
    setChips([]);

    const entry = direct ?? findAnswer(question, entries, locale);
    if (!entry) {
      reply(fillAnswer(labels.fallback, { contact }), true, []);
      return;
    }
    const follow = entry.related
      .map((id) => entries.find((e) => e.id === id))
      .filter((e): e is FaqEntry => Boolean(e));
    reply(fillAnswer(entry.answer[locale], { contact }), entry.cta, follow);
  }

  if (!ready) return null;

  const busy = typing || streaming;

  return (
    <div className="chat-root">
      {open && (
        <section
          id="chat-panel"
          role="dialog"
          aria-modal="false"
          aria-label={labels.title}
          className="animate-pop border-border bg-surface shadow-card fixed inset-x-3 bottom-20 z-40 flex h-[min(34rem,calc(100dvh-7rem))] flex-col overflow-hidden rounded-lg border sm:inset-x-auto sm:right-6 sm:bottom-24 sm:w-96"
        >
          <header className="border-border flex items-center gap-3 border-b px-4 py-3">
            <span
              aria-hidden
              className="bg-accent text-accent-foreground font-display grid size-10 shrink-0 place-items-center rounded-full text-sm font-extrabold"
            >
              NW
            </span>
            <div className="min-w-0 flex-1">
              <p className="font-display truncate font-extrabold">{labels.title}</p>
              <p className="text-muted truncate text-xs">{labels.status}</p>
            </div>
            <button
              type="button"
              onClick={close}
              aria-label={labels.close}
              className="hover:border-foreground border-border grid size-9 shrink-0 place-items-center rounded-full border transition-colors"
            >
              <CloseIcon />
            </button>
          </header>

          <div
            ref={listRef}
            // Lenis (smooth scroll) otherwise captures the wheel and the list cannot be scrolled.
            data-lenis-prevent
            onScroll={(event) => {
              const el = event.currentTarget;
              stickToBottom.current = el.scrollHeight - el.scrollTop - el.clientHeight < 48;
            }}
            className="flex-1 space-y-3 overflow-y-auto overscroll-contain px-4 py-4"
            aria-live="off"
            tabIndex={0}
            aria-label={labels.title}
          >
            {messages.map((message) => (
              <div
                key={message.id}
                className={message.role === 'user' ? 'flex justify-end' : 'flex justify-start'}
              >
                <div className="max-w-[85%]">
                  <p
                    className={
                      message.role === 'user'
                        ? 'bg-accent text-accent-foreground rounded-2xl rounded-br-md px-4 py-2.5 text-sm'
                        : 'border-border bg-background rounded-2xl rounded-bl-md border px-4 py-2.5 text-sm'
                    }
                  >
                    {message.text}
                  </p>
                  {message.cta && (
                    <Link
                      href="/contact"
                      prefetch={false}
                      onClick={() => setOpen(false)}
                      className="bg-accent text-accent-foreground font-display mt-2 inline-flex h-10 items-center rounded-full px-5 text-sm font-semibold hover:shadow-(--glow)"
                    >
                      {labels.cta}
                    </Link>
                  )}
                </div>
              </div>
            ))}
            {typing && (
              <div className="flex justify-start" role="status" aria-label={labels.typing}>
                <div className="border-border bg-background flex gap-1 rounded-2xl rounded-bl-md border px-4 py-3.5">
                  {[0, 1, 2].map((i) => (
                    <span
                      key={i}
                      aria-hidden
                      className="bg-muted animate-dot block size-1.5 rounded-full"
                      style={{ animationDelay: `${i * 0.15}s` }}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="sr-only" role="status" aria-live="polite">
            {announce}
          </div>

          <div className="border-border border-t px-4 pt-3">
            {chips.length > 0 && !busy && (
              <div role="group" aria-label={labels.chips} className="mb-3 flex flex-wrap gap-2">
                {chips.map((entry) => (
                  <button
                    key={entry.id}
                    type="button"
                    onClick={() => ask(entry.question[locale], entry)}
                    className="border-border hover:border-foreground rounded-full border px-3.5 py-1.5 text-left text-xs transition-colors"
                  >
                    {entry.question[locale]}
                  </button>
                ))}
              </div>
            )}
            <form
              onSubmit={(event) => {
                event.preventDefault();
                ask(input);
              }}
              className="flex items-center gap-2"
            >
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(event) => setInput(event.target.value)}
                maxLength={300}
                autoComplete="off"
                aria-label={labels.inputLabel}
                placeholder={labels.placeholder}
                className="border-border bg-background placeholder:text-muted focus-visible:border-accent-ink h-11 min-w-0 flex-1 rounded-full border px-4 text-base sm:text-sm"
              />
              <button
                type="submit"
                disabled={busy || !input.trim()}
                aria-label={labels.send}
                className="bg-accent text-accent-foreground grid size-11 shrink-0 place-items-center rounded-full transition-opacity disabled:opacity-40"
              >
                <SendIcon />
              </button>
            </form>
            <p className="text-muted py-2 text-[11px] leading-snug">{labels.disclaimer}</p>
          </div>
        </section>
      )}

      <div className="fixed right-4 bottom-4 z-40 sm:right-6 sm:bottom-6">
        {teaser && !open && (
          <div
            role="status"
            className="animate-pop border-border bg-surface shadow-card absolute right-0 bottom-[4.5rem] w-64 rounded-lg border p-4"
          >
            <button
              type="button"
              onClick={() => setTeaser(false)}
              aria-label={labels.teaserDismiss}
              className="text-muted hover:text-foreground absolute top-2 right-2 grid size-7 place-items-center rounded-full"
            >
              <CloseIcon className="size-4" />
            </button>
            <p className="pr-6 text-sm">{labels.teaser}</p>
            <button
              type="button"
              onClick={toggle}
              className="text-accent-ink mt-2 text-sm font-semibold underline underline-offset-4"
            >
              {labels.teaserOpen}
            </button>
          </div>
        )}
        <button
          ref={launcherRef}
          type="button"
          onClick={toggle}
          onPointerEnter={ensureFaq}
          onFocus={ensureFaq}
          aria-label={open ? labels.close : labels.open}
          aria-expanded={open}
          aria-controls="chat-panel"
          className="bg-accent text-accent-foreground relative grid size-14 place-items-center rounded-full shadow-lg transition-transform duration-(--dur-base) hover:scale-105 hover:shadow-(--glow)"
        >
          {teaser && !open && (
            <span
              aria-hidden
              className="border-accent absolute inset-0 animate-ping rounded-full border-2 [animation-iteration-count:3] motion-reduce:hidden"
            />
          )}
          {open ? <CloseIcon /> : <ChatIcon />}
        </button>
      </div>
    </div>
  );
}
