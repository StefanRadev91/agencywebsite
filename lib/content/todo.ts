/** Marker for content the studio still has to fill in. Hidden in production, shown in dev. */
export const TODO = '[TODO]' as const;

export const isTodo = (value: unknown): value is typeof TODO => value === TODO;

export const SHOW_TODO = process.env.NODE_ENV !== 'production';

/** True when a field has real content, or when we are in dev and want to see the TODO slot. */
export const isVisible = (value: unknown) => !isTodo(value) || SHOW_TODO;
