'use client';

import { useSyncExternalStore } from 'react';

type Theme = 'dark' | 'light';

function subscribe(onChange: () => void) {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
  return () => observer.disconnect();
}

const getSnapshot = (): Theme =>
  document.documentElement.dataset.theme === 'light' ? 'light' : 'dark';

export type ThemeLabels = { toLight: string; toDark: string };

export function ThemeToggle({ labels }: { labels: ThemeLabels }) {
  const theme = useSyncExternalStore(subscribe, getSnapshot, () => 'dark' as Theme);

  function toggle() {
    const next: Theme = theme === 'dark' ? 'light' : 'dark';
    document.documentElement.dataset.theme = next;
    try {
      localStorage.setItem('theme', next);
    } catch {
      /* storage unavailable — theme still applies for this session */
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={theme === 'dark' ? labels.toLight : labels.toDark}
      className="border-border text-foreground hover:border-foreground inline-flex size-10 items-center justify-center rounded-full border transition-colors duration-(--dur-fast)"
    >
      <span aria-hidden>{theme === 'dark' ? '☀' : '☾'}</span>
    </button>
  );
}
