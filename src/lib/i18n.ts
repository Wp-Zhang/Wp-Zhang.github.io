export type Locale = "zh" | "en";
export const locales: Locale[] = ["zh", "en"];
export const languageName = { zh: "中文", en: "English" };
export const htmlLang = { zh: "zh-CN", en: "en" };
export const sitePath = (locale: Locale, path = "") =>
  `${locale === "en" ? "/en" : ""}/${path}`;
export const ui = {
  zh: {
    description: "Weipeng Zhang 的博客，记录技术、阅读与生活。",
    posts: "文章",
    about: "关于",
    navigation: "主导航",
    skip: "跳转到正文",
    headline: ["记录，思考，", "继续探索。"],
    subtitle: "关于技术、阅读与生活的笔记。",
    latest: "最近的文章",
    all: "全部文章",
    empty: "新的篇章，正在酝酿。",
    next: "下一篇文章见。",
    noPosts: "还没有公开文章，敬请期待。",
    hello: "你好，我是 Weipeng Zhang。",
    bio: "这里是我的个人博客，用来记录技术、阅读与生活中的思考。",
    note: "写下来，让想法有迹可循。",
    github: "在 GitHub 找到我",
    dark: "切换到深色主题",
    light: "切换到浅色主题",
  },
  en: {
    description: "Notes on technology, reading, and life by Weipeng Zhang.",
    posts: "Posts",
    about: "About",
    navigation: "Main navigation",
    skip: "Skip to content",
    headline: ["Write. Reflect.", "Keep exploring."],
    subtitle: "Notes on technology, reading, and life.",
    latest: "Latest posts",
    all: "All posts",
    empty: "A new chapter is taking shape.",
    next: "See you in the next post.",
    noPosts: "No published posts yet. Stay tuned.",
    hello: "Hi, I’m Weipeng Zhang.",
    bio: "This is my personal blog, a place for thoughts on technology, reading, and life.",
    note: "Writing gives ideas a place to grow.",
    github: "Find me on GitHub",
    dark: "Switch to dark theme",
    light: "Switch to light theme",
  },
};
