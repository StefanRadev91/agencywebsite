import { Onest } from 'next/font/google';

// One variable font family for the whole site keeps font payload small (critical for LCP).
// next/font needs literal option values (static analysis), so subsets are inlined.
export const onest = Onest({
  subsets: ['latin', 'cyrillic'],
  variable: '--font-onest',
  display: 'swap',
});

export const fontVariables = onest.variable;
