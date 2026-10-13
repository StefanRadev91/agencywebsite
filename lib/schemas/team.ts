import { z } from 'zod';
import { localized, orTodo } from './common';

/** The founders are presented together on one card; per-person links are optional. */
export const teamSchema = z.object({
  role: localized,
  experience: localized,
  bio: orTodo(localized),
  members: z
    .array(
      z.object({
        slug: z.string().regex(/^[a-z0-9-]+$/),
        name: z.string().min(1),
        links: z.object({ github: z.url().nullable(), linkedin: z.url().nullable() }),
      }),
    )
    .min(1),
});

export type Team = z.infer<typeof teamSchema>;
