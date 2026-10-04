import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { rateLimit, resetRateLimit } from '@/lib/utils/rate-limit';

describe('rateLimit', () => {
  beforeEach(() => {
    resetRateLimit();
    vi.useFakeTimers();
  });
  afterEach(() => vi.useRealTimers());

  it('blocks after the limit and recovers after the window', () => {
    const opts = { limit: 2, windowMs: 1000 };
    expect(rateLimit('a', opts).ok).toBe(true);
    expect(rateLimit('a', opts).ok).toBe(true);
    expect(rateLimit('a', opts).ok).toBe(false);
    expect(rateLimit('b', opts).ok).toBe(true);

    vi.advanceTimersByTime(1001);
    expect(rateLimit('a', opts).ok).toBe(true);
  });
});
