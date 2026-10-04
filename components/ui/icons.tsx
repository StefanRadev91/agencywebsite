import type { ServiceSlug } from '@/lib/site-nav';

const svg = {
  width: 24,
  height: 24,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.75,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
} as const;

export const serviceIcons: Record<ServiceSlug, React.ReactNode> = {
  websites: (
    <svg {...svg}>
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <path d="M3 9h18M7 6.5h.01M10 6.5h.01" />
    </svg>
  ),
  webapps: (
    <svg {...svg}>
      <rect x="3" y="3" width="8" height="8" rx="1.5" />
      <rect x="13" y="3" width="8" height="5" rx="1.5" />
      <rect x="13" y="11" width="8" height="10" rx="1.5" />
      <rect x="3" y="14" width="8" height="7" rx="1.5" />
    </svg>
  ),
  ecommerce: (
    <svg {...svg}>
      <path d="M3 4h2l2.2 11h10.4L20 7H6" />
      <circle cx="9" cy="19.5" r="1.25" />
      <circle cx="17" cy="19.5" r="1.25" />
    </svg>
  ),
  qa: (
    <svg {...svg}>
      <path d="M12 3l8 3v5.5c0 4.5-3.2 8-8 9.5-4.8-1.5-8-5-8-9.5V6l8-3z" />
      <path d="M8.5 12l2.5 2.5 4.5-5" />
    </svg>
  ),
  hosting: (
    <svg {...svg}>
      <rect x="3" y="4" width="18" height="6.5" rx="1.5" />
      <rect x="3" y="13.5" width="18" height="6.5" rx="1.5" />
      <path d="M7 7.25h.01M7 16.75h.01" />
    </svg>
  ),
};

export function ArrowRight({ className }: { className?: string }) {
  return (
    <svg {...svg} className={className} width={18} height={18}>
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

export function ArrowLeft({ className }: { className?: string }) {
  return (
    <svg {...svg} className={className} width={16} height={16}>
      <path d="M19 12H5M11 6l-6 6 6 6" />
    </svg>
  );
}

export function ArrowUpRight({ className }: { className?: string }) {
  return (
    <svg {...svg} className={className} width={20} height={20}>
      <path d="M7 17L17 7M8 7h9v9" />
    </svg>
  );
}
