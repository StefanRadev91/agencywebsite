'use client';

import { useId, useState } from 'react';
import { cn } from '@/lib/utils/cn';

export type AccordionItem = { question: string; answer: string };

/** FAQ accordion. Panels animate via grid-template-rows (no JS height measuring). */
export function Accordion({ items, className }: { items: AccordionItem[]; className?: string }) {
  const [open, setOpen] = useState<number | null>(null);
  const baseId = useId();

  return (
    <div className={cn('divide-border border-border divide-y border-y', className)}>
      {items.map((item, i) => {
        const isOpen = open === i;
        const buttonId = `${baseId}-btn-${i}`;
        const panelId = `${baseId}-panel-${i}`;
        return (
          <div key={item.question}>
            <h3>
              <button
                id={buttonId}
                type="button"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpen(isOpen ? null : i)}
                className="font-display flex w-full items-center justify-between gap-6 py-5 text-left text-lg font-semibold md:text-xl"
              >
                {item.question}
                <span
                  aria-hidden
                  className={cn(
                    'text-accent-ink ease-out-expo text-2xl transition-transform duration-(--dur-base)',
                    isOpen && 'rotate-45',
                  )}
                >
                  +
                </span>
              </button>
            </h3>
            <div
              id={panelId}
              role="region"
              aria-labelledby={buttonId}
              className={cn(
                'ease-out-expo grid transition-[grid-template-rows,opacity] duration-(--dur-base)',
                isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0',
              )}
            >
              <div className="overflow-hidden">
                <p className="text-muted pb-5">{item.answer}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
