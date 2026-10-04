import { z } from 'zod';
import { TODO } from '@/lib/content/todo';

export const localized = z.object({ bg: z.string().min(1), en: z.string().min(1) });
export const todo = z.literal(TODO);

/** A field that may still be the "[TODO]" placeholder. */
export const orTodo = <T extends z.ZodType>(schema: T) => z.union([schema, todo]);
