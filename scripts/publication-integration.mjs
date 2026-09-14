import { writeFile, appendFile, rm, readFile, readdir } from "node:fs/promises";
import { execFileSync } from "node:child_process";
import assert from "node:assert/strict";

const directory = "content/posts/publication-test-fixtures";
const { mkdir } = await import("node:fs/promises");
await mkdir(directory); // Never overwrite an existing author directory.
const statuses = ["public", "private", "draft", "missing", "future"];
const build = () => execFileSync("npm", ["run", "build"], { stdio: "inherit" });
async function contents(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  return (
    await Promise.all(
      entries.map((entry) =>
        entry.isDirectory()
          ? contents(`${dir}/${entry.name}`)
          : readFile(`${dir}/${entry.name}`, "utf8"),
      ),
    )
  ).join("\n");
}
try {
  for (const status of statuses) {
    await writeFile(
      `${directory}/${status}.zh.md`,
      `---\ntitle: PublicationFixture-${status}\ndate: ${status === "future" ? "2099-01-01" : "2020-01-01"}\n${status === "missing" ? "" : `status: ${status === "future" ? "public" : status}\n`}---\n\nPublicationBody-${status}\n`,
    );
  }
  for (const [name, status] of [
    ["paired.zh", "public"],
    ["paired.en", "public"],
    ["english-only.en", "public"],
    ["hidden-pair.zh", "public"],
    ["hidden-pair.en", "private"],
  ]) {
    await writeFile(
      `${directory}/${name}.md`,
      `---\ntitle: PublicationFixture-${name}\ndate: 2020-01-01\nstatus: ${status}\n---\n\nPublicationBody-${name}\n`,
    );
  }
  const taggedFile = `${directory}/public.zh.md`;
  const taggedSource = await readFile(taggedFile, 'utf8');
  await writeFile(taggedFile, taggedSource.replace('date:', 'tags: ["机器学习", "C++", "a/b", "a-b"]\ndate:'));
  // Minimal generated fixtures exercise the real Markdown pipeline without shipping demo pages.
  const richText = '\nInline $x^2$.\n\n$$\nx^2 + y^2 = z^2\n$$\n\n```python\ndef square(x):\n    return x * x\n```\n\nA citation.[^source] Repeated.[^source]\n\n[^source]: A reference with [a link](https://example.com).\n';
  await appendFile(taggedFile, richText);
  await appendFile(`${directory}/paired.en.md`, richText);
  const privateFile = `${directory}/private.zh.md`;
  await writeFile(privateFile, (await readFile(privateFile, 'utf8')).replace('date:', 'tags: ["PrivateOnlyTag"]\ndate:'));
  build();
  const article = await readFile('dist/posts/publication-test-fixtures/public/index.html', 'utf8');
  assert.ok(article.includes('>参考文献</h2>'));
  assert.ok(!article.includes('参考文献 / References'));
  const englishArticle = await readFile('dist/en/posts/publication-test-fixtures/paired/index.html', 'utf8');
  assert.ok(englishArticle.includes('>References</h2>'));
  assert.ok(!englishArticle.includes('参考文献'));
  assert.ok(englishArticle.includes('Back to citation'));
  assert.ok(article.includes('class="katex"'), 'Math must render at build time');
  assert.ok(article.includes('katex-mathml'), 'MathML must be available to assistive technology');
  assert.ok(article.includes('--shiki-dark'), 'Both code themes must be emitted');
  assert.ok(article.includes('data-footnote-ref'), 'Citations must render as linked superscripts');
  assert.ok(article.includes('data-footnote-backref'), 'References must link back to citations');
  for (const match of article.matchAll(/href="#([^" ]+)"/g)) {
    assert.ok(article.includes(`id="${match[1]}"`), `Missing fragment target: ${match[1]}`);
  }
  const slug = tag => Array.from(tag).map(char => char.codePointAt(0).toString(16)).join('-');
  for (const tag of ['机器学习', 'C++', 'a/b', 'a-b']) {
    for (const prefix of ['', 'en/']) {
      const page = await readFile(`dist/${prefix}tags/${slug(tag)}/index.html`, 'utf8');
      assert.ok(page.includes('PublicationFixture-public'), 'Tag page must include matching public article');
      assert.ok(!page.includes('PublicationFixture-paired'), 'Tag page must exclude other articles');
      assert.ok(!page.includes('PublicationFixture-private'), 'Tag page must exclude private articles');
    }
    assert.ok(article.includes(`/tags/${slug(tag)}/`), 'Article tag must link to filter');
  }
  await assert.rejects(readFile(`dist/tags/${slug('PrivateOnlyTag')}/index.html`), { code: 'ENOENT' });
  console.log('Math, dual code themes, citation backlinks, and public-only tag filtering passed.');
  const output = await contents("dist");
  for (const status of statuses) {
    assert.equal(
      output.includes(`PublicationBody-${status}`),
      status === "public",
    );
    assert.equal(
      output.includes(`PublicationFixture-${status}`),
      status === "public",
    );
  }
  for (const file of [
    "dist/index.html",
    "dist/posts/index.html",
    "dist/index.xml",
    "dist/sitemap.xml",
  ]) {
    assert.ok(
      (await readFile(file, "utf8")).includes(
        "publication-test-fixtures/public/",
      ),
      file,
    );
  }
  await readFile("dist/posts/publication-test-fixtures/public/index.html");
  const zh = await readFile(
    "dist/posts/publication-test-fixtures/paired/index.html",
    "utf8",
  );
  const en = await readFile(
    "dist/en/posts/publication-test-fixtures/paired/index.html",
    "utf8",
  );
  assert.ok(zh.includes('PublicationBody-paired.zh'));
  assert.ok(!zh.includes('PublicationBody-paired.en'));
  assert.ok(en.includes('PublicationBody-paired.en'));
  assert.ok(!en.includes('PublicationBody-paired.zh'));
  await assert.rejects(readFile('dist/posts/publication-test-fixtures/english-only/index.html'), { code: 'ENOENT' });
  await assert.rejects(readFile('dist/en/posts/publication-test-fixtures/hidden-pair/index.html'), { code: 'ENOENT' });
  assert.ok(zh.includes('hreflang="en"'));
  assert.ok(en.includes('hreflang="zh-CN"'));
  assert.ok(en.includes('lang="en"'));
  for (const file of [
    "dist/en/posts/publication-test-fixtures/english-only/index.html",
    "dist/posts/publication-test-fixtures/hidden-pair/index.html",
  ]) {
    const html = await readFile(file, "utf8");
    assert.ok(!html.includes('class="language-switch"'), file);
    assert.ok(!html.includes("hreflang="), file);
  }
  assert.ok(!output.includes("PublicationBody-hidden-pair.en"));
  const zhList = await readFile("dist/posts/index.html", "utf8");
  const enList = await readFile("dist/en/posts/index.html", "utf8");
  assert.ok(zhList.includes("PublicationFixture-paired.zh"));
  assert.ok(!zhList.includes("PublicationFixture-paired.en"));
  assert.ok(enList.includes("PublicationFixture-paired.en"));
  assert.ok(!enList.includes("PublicationFixture-paired.zh"));
  assert.ok(zhList.includes("PublicationFixture-english-only.en"));
  assert.ok(!output.includes("Y.Paang"));
  console.log(
    "Bilingual routes, language pairing, single-language fallback, and private translations passed.",
  );
  console.log(
    "Integration passed: public article renders and is indexed; all four non-public states are absent.",
  );
} finally {
  await rm(directory, { recursive: true });
  build(); // Leave only real author content in the deployable artifact.
  assert.ok(
    !(await contents("dist")).includes("PublicationFixture-"),
    "Deleted posts remained in the build cache",
  );
}
