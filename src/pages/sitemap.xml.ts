import type { APIContext } from "astro";
import { getPublicPosts, postUrl, publicTags, tagUrl } from "../lib/posts";

export async function GET({ site }: APIContext) {
  const posts = await getPublicPosts();
  const paths = [
    "/",
    "/posts/",
    "/about/",
    "/en/",
    "/en/posts/",
    "/en/about/",
    ...posts.map((post) => postUrl(post)),
    ...publicTags(posts).flatMap(tag => [tagUrl(tag, "zh"), tagUrl(tag, "en")]),
  ];
  const xml = `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${paths.map((path) => `<url><loc>${new URL(path, site).href.replaceAll("&", "&amp;").replaceAll("<", "&lt;")}</loc></url>`).join("")}</urlset>`;
  return new Response(xml, { headers: { "Content-Type": "application/xml" } });
}
