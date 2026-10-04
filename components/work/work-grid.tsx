'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { ProjectCard } from '@/components/ui/project-card';
import type { WorkItem } from '@/lib/content/card';
import { duration, easeOutExpo } from '@/lib/motion';
import { cn } from '@/lib/utils/cn';

export type FilterKey = 'all' | 'website' | 'webapp' | 'ecommerce' | 'concept';
const filters: FilterKey[] = ['all', 'website', 'webapp', 'ecommerce', 'concept'];

function matches(item: WorkItem, filter: FilterKey) {
  if (filter === 'all') return true;
  if (filter === 'concept') return item.isConcept;
  return item.categories.includes(filter);
}

export function WorkGrid({ items }: { items: WorkItem[] }) {
  const t = useTranslations('Work.page');
  const [filter, setFilter] = useState<FilterKey>('all');
  const visible = items.filter((item) => matches(item, filter));

  return (
    <div>
      <div role="group" aria-label={t('filterLabel')} className="mb-4 flex flex-wrap gap-2">
        {filters.map((key) => {
          const active = filter === key;
          return (
            <button
              key={key}
              type="button"
              aria-pressed={active}
              onClick={() => setFilter(key)}
              className={cn(
                'rounded-full border px-5 py-2 text-sm font-medium transition-colors duration-(--dur-fast)',
                active
                  ? 'border-accent bg-accent text-accent-foreground'
                  : 'border-border text-muted hover:border-foreground hover:text-foreground',
              )}
            >
              {t(`filters.${key}`)}
            </button>
          );
        })}
      </div>
      <p role="status" className="text-muted mb-8 text-sm">
        {t('count', { count: visible.length })}
      </p>

      <ul className="grid gap-8 md:grid-cols-2">
        <AnimatePresence mode="popLayout">
          {visible.map(({ slug, card }) => (
            <motion.li
              key={slug}
              layout
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.97 }}
              transition={{ duration: duration.base, ease: easeOutExpo }}
            >
              <ProjectCard {...card} />
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>
    </div>
  );
}
