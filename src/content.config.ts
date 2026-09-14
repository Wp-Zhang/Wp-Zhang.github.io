import { defineCollection } from "astro:content";
import { z } from "astro/zod";
import { glob } from "astro/loaders";

const posts = defineCollection({
  loader: glob({
    pattern: "**/*.md",
    base: "./content/posts",
    generateId: ({ entry }) => {
      if (!/^(.+)\.(zh|en)\.md$/.test(entry))
        throw new Error(`Use .zh.md or .en.md for article filenames: ${entry}`);
      return entry.replace(/\.md$/, "");
    },
  }),
  schema: z.object({
    title: z.string(),
    description: z.string().default(""),
    date: z.coerce.date(),
    status: z.enum(["draft", "private", "public"]).default("draft"),
    tags: z.array(z.string()).default([]),
  }),
});

export const collections = { posts };
