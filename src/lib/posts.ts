import { getCollection } from "astro:content";
import { isPublished } from "./publication.mjs";
import { sitePath, type Locale } from "./i18n";

export function postIdentity(id: string): { slug: string; locale: Locale } {
  const match = id.match(/^(.+)\.(zh|en)$/);
  if (!match)
    throw new Error(`Article filename must end in .zh.md or .en.md: ${id}`);
  return { slug: match[1], locale: match[2] as Locale };
}
export async function getPublicPosts() {
  return (await getCollection("posts", ({ data }) => isPublished(data)))
    .map((post) => ({ ...post, ...postIdentity(post.id) }))
    .sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
}
export type Post = Awaited<ReturnType<typeof getPublicPosts>>[number];
// Show each article once, preferring the interface language when available.
export function selectPosts(posts: Post[], locale: Locale) {
  const selected = new Map<string, Post>();
  for (const post of posts) {
    if (!selected.has(post.slug) || post.locale === locale)
      selected.set(post.slug, post);
  }
  return [...selected.values()].sort(
    (a, b) => b.data.date.getTime() - a.data.date.getTime(),
  );
}
export const postUrl = (post: Pick<Post, "slug" | "locale">) =>
  sitePath(
    post.locale,
    `posts/${post.slug.split("/").map(encodeURIComponent).join("/")}/`,
  );
export const formatDate = (date: Date, locale: Locale) =>
  date.toLocaleDateString(locale === "zh" ? "zh-CN" : "en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "Asia/Shanghai",
  });

// Encode code points to keep arbitrary tags (C++, 中文, a/b) collision-free and route-safe.
export const tagSlug = (tag: string) => Array.from(tag).map(char => char.codePointAt(0)!.toString(16)).join('-');
export const tagUrl = (tag: string, locale: Locale) => sitePath(locale, `tags/${tagSlug(tag)}/`);
export const publicTags = (posts: Post[]) => [...new Set(posts.flatMap(post => post.data.tags).filter(Boolean))].sort((a, b) => a.localeCompare(b));
