/** Motion tokens for Framer Motion. Keep in sync with --dur-* / --ease-* in globals.css. */
export const duration = { fast: 0.15, base: 0.3, slow: 0.7 } as const;

export const easeOutExpo = [0.16, 1, 0.3, 1] as const;
export const easeInOutQuart = [0.76, 0, 0.24, 1] as const;

export const spring = { type: 'spring', stiffness: 220, damping: 22, mass: 0.6 } as const;
