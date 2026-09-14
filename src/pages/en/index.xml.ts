import rss from "@astrojs/rss";
import type { APIContext } from "astro";
import { getPublicPosts, postUrl, selectPosts } from "../../lib/posts";

export async function GET(context: APIContext) {
  return rss({
    title: "Weipeng Zhang / Blog",
    description: "Notes on technology, reading, and life.",
    site: context.site!,
    items: selectPosts(await getPublicPosts(), "en").map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.date,
      link: postUrl(post),
    })),
  });
}
