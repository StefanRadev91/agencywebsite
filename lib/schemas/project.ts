import { z } from 'zod';
import { TODO } from '@/lib/content/todo';

const localized = z.object({ bg: z.string().min(1), en: z.string().min(1) });
const todo = z.literal(TODO);
/** A field that may still be the "[TODO]" placeholder. */
const orTodo = <T extends z.ZodType>(schema: T) => z.union([schema, todo]);

const score = z.number().int().min(0).max(100);

/** A real screenshot stored under /public (served as a static asset). */
export const imageSchema = z.object({
  src: z.string().startsWith('/'),
  width: z.number().int().positive(),
  height: z.number().int().positive(),
});
export type ProjectImage = z.infer<typeof imageSchema>;

export const categorySchema = z.enum(['website', 'webapp', 'ecommerce']);
export type Category = z.infer<typeof categorySchema>;

export const projectSchema = z
  .object({
    slug: z.string().regex(/^[a-z0-9-]+$/),
    /** client = real client work, internal = our own product, concept = not a real client. */
    kind: z.enum(['client', 'internal', 'concept']),
    status: z.enum(['live', 'in-progress']).optional(),
    categories: z.array(categorySchema).min(1),
    featured: z.boolean(),
    order: z.number().int(),
    /** Hue (0–360) for the placeholder visual until real screenshots exist. */
    hue: z.number().min(0).max(360),
    /** Optional real cover screenshot; falls back to the placeholder visual. */
    cover: imageSchema.optional(),

    title: localized,
    summary: localized,

    client: z.object({ name: orTodo(z.string().min(1)), industry: orTodo(localized) }).nullable(),
    role: orTodo(localized),
    challenge: orTodo(localized),
    solution: orTodo(localized),
    stack: orTodo(z.array(z.string().min(1))),
    screens: orTodo(
      z.array(
        z.object({
          caption: localized,
          hue: z.number().min(0).max(360),
          image: imageSchema.optional(),
        }),
      ),
    ),
    results: orTodo(z.array(z.object({ label: localized, value: z.string().min(1) }))),
    quality: orTodo(
      z
        .object({
          lighthouse: z
            .object({ performance: score, accessibility: score, bestPractices: score, seo: score })
            .nullable(),
          e2eTests: z.number().int().nonnegative().nullable(),
        })
        .nullable(),
    ),
    liveUrl: orTodo(z.url()).nullable(),
  })
  .superRefine((p, ctx) => {
    if (p.kind !== 'concept') return;
    // Concepts must never look like real client work.
    const issue = (path: string, message: string) =>
      ctx.addIssue({ code: 'custom', path: [path], message });
    if (p.client !== null) issue('client', 'Concept projects must not have a client');
    if (p.liveUrl !== null) issue('liveUrl', 'Concept projects must not have a live URL');
    if (p.quality !== null) issue('quality', 'Concept projects must not have quality metrics');
    if (!Array.isArray(p.results) || p.results.length > 0)
      issue('results', 'Concept projects must not have results');
    if (p.status !== undefined) issue('status', 'Concept projects must not have a status');
  });

export type Project = z.infer<typeof projectSchema>;
