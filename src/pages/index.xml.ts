import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { getPublicPosts, postUrl } from '../lib/posts';

export async function GET(context: APIContext) {
  return rss({
    title: "Y.Paang's Blog",
    description: '关于技术、阅读与生活的笔记。',
    site: context.site!,
    items: (await getPublicPosts()).map(post => ({
      title: post.data.title, description: post.data.description,
      pubDate: post.data.date, link: postUrl(post.id),
    })),
  });
}
