import { z } from 'zod';
import { localized, orTodo } from './common';

export const teamSchema = z.object({
  members: z
    .array(
      z.object({
        slug: z.string().regex(/^[a-z0-9-]+$/),
        name: z.string().min(1),
        role: localized,
        experience: localized,
        bio: orTodo(localized),
        links: z.object({ github: z.url().nullable(), linkedin: z.url().nullable() }),
      }),
    )
    .min(1),
});

export type Team = z.infer<typeof teamSchema>;
