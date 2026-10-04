import { Inter, JetBrains_Mono, Onest } from 'next/font/google';

// next/font needs literal option values (static analysis), so subsets are inlined.
export const onest = Onest({
  subsets: ['latin', 'cyrillic'],
  weight: ['600', '800'],
  variable: '--font-onest',
  display: 'swap',
});

export const inter = Inter({
  subsets: ['latin', 'cyrillic'],
  variable: '--font-inter',
  display: 'swap',
});

export const jetbrains = JetBrains_Mono({
  subsets: ['latin', 'cyrillic'],
  weight: ['500'],
  variable: '--font-jetbrains',
  display: 'swap',
});

export const fontVariables = `${onest.variable} ${inter.variable} ${jetbrains.variable}`;
