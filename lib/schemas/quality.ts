import { z } from 'zod';

const score = z.number().int().min(0).max(100);

/** Written by CI (Phase 8). `null` until the first measured run — never hand-edit numbers in. */
export const qualityReportSchema = z.object({
  generatedAt: z.iso.datetime().nullable(),
  lighthouse: z
    .object({ performance: score, accessibility: score, bestPractices: score, seo: score })
    .nullable(),
  e2eTests: z.number().int().nonnegative().nullable(),
  unitTests: z.number().int().nonnegative().nullable(),
  runUrl: z.url().nullable(),
});

export type QualityReport = z.infer<typeof qualityReportSchema>;
