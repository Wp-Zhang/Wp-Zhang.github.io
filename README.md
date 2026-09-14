# Weipeng Zhang / Blog

Pages CMS → GitHub → GitHub Actions → Astro → GitHub Pages。

## 本地开发

使用 Node.js 24（`.nvmrc`）。

```sh
npm ci
npm run dev
```

```sh
npm run check
npm test
npm run test:publication
npm run build
npm run preview
```

## 写作

在 [Pages CMS](https://app.pagescms.org/) 用 GitHub 登录，为该仓库授权，选择 `master` 分支。
根目录 `.pages.yml` 配置文章编辑器和图片上传；保存提交后会触发 Actions。
GitHub App 授权需要仓库所有者在浏览器中完成。

文章放在 `content/posts/`，以 `.zh.md` / `.en.md` 结尾，例如 `my-first-post.zh.md`：

```markdown
---
title: 我的新文章
description: 一句话摘要
date: 2026-09-14
status: draft
tags: [随笔]
---

正文从这里开始。
```

- `draft`：草稿，不生成页面。
- `private`：不公开到网站，不生成页面。
- `public`：日期不晚于构建时间时发布。
- 未填写状态默认 `draft`；非法状态导致构建失败。

首页、文章列表、文章路由、RSS 和 sitemap 共用同一发布筛选。未来日期的文章需要在日期到达后重新构建；没有定时发布任务。
上传到 `public/uploads/` 的图片始终公开，不要上传私密附件。公开仓库中的草稿和 private 文章源码也仍然公开。
文件名决定 URL，发布后避免随意改名。

## 历史内容

原 Hugo 文件原样保存在 `archive/hugo/`，包括 4 篇 Markdown 文章和旧 HTML、RSS、搜索索引、图片。
这些文件不参与构建，也没有公开的文章路由。旧 URL 在新站部署后返回 404。
不修改 Git 历史，也不删除历史内容。构建后自动检查未公开文章标题、旧文章路径和源码未进入 `dist/`。

## 部署

工作流在推送 `master` 或手动运行时检查、构建并部署；PR 只检查和构建。
GitHub 仓库 **Settings → Pages → Source** 应设为 **GitHub Actions**，不再使用 `master:/docs`。
只上传 `dist/`，不提交生成文件。

参考：[Astro 的 Pages 部署文档](https://docs.astro.build/en/guides/deploy/github/)、[Pages CMS 配置文档](https://pagescms.org/docs/configuration/)。

## 中英文内容

- 中文界面：`/`；英文界面：`/en/`。首页、文章列表、关于页面均可切换。
- `my-first-post.zh.md` 与 `my-first-post.en.md` 是同一篇文章的两种语言版本，分别提供正文和元数据。
- 中文文章地址 `/posts/my-first-post/`；英文文章地址 `/en/posts/my-first-post/`。
- 只提供一种语言也可以。列表优先当前界面语言，没有时展示已有版本并标注语言；单语文章不显示语言切换，也不生成另一语言的 URL。
- 只有已公开且到达发布日期的译文才会出现在切换入口中。两种语言的发布状态独立。
- 文件后缀决定语言，去掉语言后缀的文件名决定配对。没有语言后缀会导致构建报错，防止错配。
- Pages CMS 分为「中文文章」与「English posts」，填写相同的「文章标识」即可生成一对文件。文件名决定配对与 URL，发布后保持不变。
- 两种语言各有 RSS：`/index.xml` 和 `/en/index.xml`。各自遵循列表的语言优先规则。

## 主题

首次访问跟随系统明暗设置。导航栏的主题按钮可手动切换，并通过本地存储记住选择；在存储被禁用时仍可正常切换。页面加载前应用主题以避免闪烁。
