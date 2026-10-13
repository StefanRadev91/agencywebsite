import { describe, expect, it } from 'vitest';
import faq from '@/content/faq.json';
import { findAnswer, fillAnswer, translit } from '@/lib/chat-match';
import { faqSchema } from '@/lib/schemas/faq';

const entries = faqSchema.parse(faq).entries;
const ids = entries.map((e) => e.id);

describe('faq content', () => {
  it('is valid and has unique ids', () => {
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('only links to existing entries', () => {
    for (const entry of entries) for (const id of entry.related) expect(ids).toContain(id);
  });

  it('never states a made-up price', () => {
    for (const entry of entries) {
      expect(entry.answer.bg).not.toMatch(/\d\s?(€|лв|eur|bgn)/i);
      expect(entry.answer.en).not.toMatch(/(€|\$)\s?\d|\d\s?(€|eur|bgn)/i);
    }
  });

  it('offers a handful of quick-reply chips', () => {
    const chips = entries.filter((e) => e.suggested).length;
    expect(chips).toBeGreaterThanOrEqual(4);
  });
});

describe('findAnswer', () => {
  it.each([
    ['Колко струва един сайт?', 'bg', 'pricing'],
    ['каква е цената', 'bg', 'pricing'],
    ['За колко време става?', 'bg', 'timeline'],
    ['Как протича работата ви', 'bg', 'process'],
    ['Предлагате ли поддръжка след пускане', 'bg', 'hosting'],
    ['Как да се свържа с вас', 'bg', 'contact'],
    ['какво е безплатният старт', 'bg', 'free-start'],
    ['kolko struva sajt', 'bg', 'pricing'],
    ['kakvi tehnologii polzvate', 'bg', 'tech'],
    ['How much does a website cost?', 'en', 'pricing'],
    ['how long will it take', 'en', 'timeline'],
    ['What is the free skeleton?', 'en', 'free-start'],
    ['Do you do hosting and maintenance?', 'en', 'hosting'],
    ['Who owns the code?', 'en', 'rights'],
    ['hello', 'en', 'hello'],
    ['thanks!', 'en', 'thanks'],
  ] as const)('"%s" (%s) -> %s', (message, locale, expected) => {
    expect(findAnswer(message, entries, locale)?.id).toBe(expected);
  });

  it('understands English on the Bulgarian site', () => {
    expect(findAnswer('how much does it cost', entries, 'bg')?.id).toBe('pricing');
  });

  it.each(['', '   ', 'asdkjh qwe', 'коя е най-добрата пица в града'])(
    'returns null for "%s"',
    (message) => {
      expect(findAnswer(message, entries, 'bg')).toBeNull();
    },
  );
});

describe('helpers', () => {
  it('transliterates Latin Bulgarian', () => {
    expect(translit('Kolko struva')).toBe('колко струва');
    expect(translit('cena')).toBe('цена');
  });

  it('fills {contact} and leaves unknown tokens alone', () => {
    expect(fillAnswer('Call {contact} {nope}', { contact: '+359' })).toBe('Call +359 {nope}');
  });
});
