import { getCollection } from "astro:content";
import { isPublished } from "./publication.mjs";

export async function getPublicPosts() {
  return (await getCollection("posts", ({ data }) => isPublished(data))).sort(
    (a, b) => b.data.date.getTime() - a.data.date.getTime(),
  );
}

export const postUrl = (id: string) =>
  `/posts/${id.split("/").map(encodeURIComponent).join("/")}/`;
export const formatDate = (date: Date) =>
  date.toLocaleDateString("zh-CN", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "Asia/Shanghai",
  });
