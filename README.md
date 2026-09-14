# Y.Paang's Blog

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

文章放在 `content/posts/`，例如：

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
