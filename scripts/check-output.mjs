import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import assert from "node:assert/strict";
import { parse } from "yaml";
import { isPublished } from "../src/lib/publication.mjs";

async function files(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  return (
    await Promise.all(
      entries.map((entry) =>
        entry.isDirectory()
          ? files(path.join(dir, entry.name))
          : path.join(dir, entry.name),
      ),
    )
  ).flat();
}

const outputFiles = await files("dist");
const output = (
  await Promise.all(
    outputFiles
      .filter((file) => /\.(html|xml|json|js|txt|css)$/.test(file))
      .map((file) => readFile(file, "utf8")),
  )
).join("\n");
const escapeHtml = (value) =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
const unpublished = [];
const publishedTitles = new Set();
for (const dir of ["archive/hugo/content/posts", "content/posts"]) {
  for (const file of (await files(dir)).filter((file) =>
    file.endsWith(".md"),
  )) {
    const text = await readFile(file, "utf8");
    const match = text.match(/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/);
    assert.ok(match, `Missing frontmatter: ${file}`);
    const data = parse(match[1]);
    if (file.startsWith("archive/") || !isPublished(data)) {
      unpublished.push(data.title);
      if (!file.startsWith("archive/")) {
        const match = file
          .slice("content/posts/".length)
          .match(/^(.+)\.(zh|en)\.md$/);
        if (match) {
          const route = `dist/${match[2] === "en" ? "en/" : ""}posts/${match[1]}/index.html`;
          assert.ok(
            !outputFiles.includes(route),
            `Unpublished route leaked: ${route}`,
          );
        }
      }
    } else publishedTitles.add(data.title);
  }
}
for (const title of unpublished) {
  if (publishedTitles.has(title)) continue; // Translations may legitimately share a title.
  assert.ok(
    !output.includes(title) && !output.includes(escapeHtml(title)),
    `Unpublished title leaked: ${title}`,
  );
}
for (const file of outputFiles) {
  assert.ok(!file.startsWith("dist/design/"), `Local design preview leaked: ${file}`);
  assert.ok(
    !/^dist\/(archive|docs|content|static)\//.test(file),
    `Archive path leaked: ${file}`,
  );
  assert.ok(!/\.(md|map)$/.test(file), `Source file leaked: ${file}`);
}
// Check every legacy article route, including HTML-only articles with no Markdown source.
for (const file of await files("archive/hugo/docs/posts")) {
  if (!file.endsWith("/index.html")) continue;
  const route = file.replace("archive/hugo/docs/", "dist/");
  if (route === "dist/posts/index.html") continue;
  assert.ok(
    !outputFiles.includes(route),
    `Legacy article route restored: ${route}`,
  );
}
console.log(
  `Publication checks passed: ${unpublished.length} unpublished articles excluded; ${outputFiles.length} output files checked.`,
);
