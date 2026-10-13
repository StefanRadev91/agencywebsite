import type { FaqEntry } from '@/lib/schemas/faq';

type Locale = 'bg' | 'en';

const TRANSLIT: [string, string][] = [
  ['sht', 'щ'],
  ['sh', 'ш'],
  ['ch', 'ч'],
  ['zh', 'ж'],
  ['ts', 'ц'],
  ['yu', 'ю'],
  ['ya', 'я'],
  ['a', 'а'],
  ['b', 'б'],
  ['v', 'в'],
  ['w', 'в'],
  ['g', 'г'],
  ['d', 'д'],
  ['e', 'е'],
  ['z', 'з'],
  ['i', 'и'],
  ['j', 'й'],
  ['k', 'к'],
  ['l', 'л'],
  ['m', 'м'],
  ['n', 'н'],
  ['o', 'о'],
  ['p', 'п'],
  ['r', 'р'],
  ['s', 'с'],
  ['t', 'т'],
  ['u', 'у'],
  ['f', 'ф'],
  ['h', 'х'],
  ['c', 'ц'],
  ['y', 'ъ'],
  ['x', 'кс'],
  ['q', 'я'],
];

export function normalize(text: string) {
  return text
    .toLowerCase()
    .replace(/ё/g, 'е')
    .replace(/[^\p{L}\p{N}\s]/gu, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/** "kolko struva" -> "колко струва": lets visitors who type Bulgarian in Latin letters be understood. */
export function translit(text: string) {
  let out = normalize(text);
  for (const [from, to] of TRANSLIT) out = out.split(from).join(to);
  return out;
}

function score(query: string, keywords: string[]) {
  const tokens = query.split(' ');
  let total = 0;
  for (const keyword of keywords) {
    if (keyword.includes(' ')) {
      if (query.includes(keyword)) total += keyword.length * 1.5;
    } else if (keyword.length <= 3) {
      if (tokens.includes(keyword)) total += keyword.length;
    } else if (tokens.some((token) => token.startsWith(keyword))) {
      total += keyword.length;
    }
  }
  return total;
}

const MIN_SCORE = 4;

/** The best matching entry for a visitor's message, or null when nothing is close enough. */
export function findAnswer(message: string, entries: FaqEntry[], locale: Locale): FaqEntry | null {
  const variants = [{ query: normalize(message), locale }];
  if (locale === 'bg' && !/\p{Script=Cyrillic}/u.test(message)) {
    variants.push({ query: translit(message), locale });
  }
  if (locale === 'bg' || locale === 'en') {
    // A visitor on the Bulgarian site may still write in English, and vice versa.
    variants.push({ query: normalize(message), locale: locale === 'bg' ? 'en' : 'bg' });
  }

  let best: FaqEntry | null = null;
  let bestScore = 0;
  for (const entry of entries) {
    for (const variant of variants) {
      const s = score(variant.query, entry.keywords[variant.locale]);
      if (s > bestScore) {
        bestScore = s;
        best = entry;
      }
    }
  }
  return bestScore >= MIN_SCORE ? best : null;
}

/** Fills {contact} etc. in an answer. Empty values drop cleanly. */
export function fillAnswer(text: string, values: Record<string, string>) {
  return text.replace(/\{(\w+)\}/g, (match, key: string) => values[key] ?? match);
}
