import fs from 'node:fs';
import path from 'node:path';
import type { z } from 'zod';

const root = path.join(process.cwd(), 'content');

/** Reads and validates every `<dir>/*.json`. Throws at build time on invalid content. */
export function loadJsonDir<T extends z.ZodType>(dir: string, schema: T): z.infer<T>[] {
  const full = path.join(root, dir);
  return fs
    .readdirSync(full)
    .filter((file) => file.endsWith('.json'))
    .map((file) => {
      const parsed = schema.safeParse(JSON.parse(fs.readFileSync(path.join(full, file), 'utf8')));
      if (!parsed.success)
        throw new Error(`Invalid content in ${dir}/${file}:\n${parsed.error.message}`);
      return { file, data: parsed.data as z.infer<T> };
    })
    .map(({ file, data }) => {
      const slug = (data as { slug?: string }).slug;
      if (slug && `${slug}.json` !== file) {
        throw new Error(`Slug "${slug}" must match file name ${dir}/${file}`);
      }
      return data;
    });
}

/** Reads and validates a single `content/<file>.json`. */
export function loadJsonFile<T extends z.ZodType>(file: string, schema: T): z.infer<T> {
  const parsed = schema.safeParse(JSON.parse(fs.readFileSync(path.join(root, file), 'utf8')));
  if (!parsed.success) throw new Error(`Invalid content in ${file}:\n${parsed.error.message}`);
  return parsed.data;
}
