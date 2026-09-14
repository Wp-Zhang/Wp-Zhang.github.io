import { writeFile, rm, readFile, readdir } from "node:fs/promises";
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
      `${directory}/${status}.md`,
      `---\ntitle: PublicationFixture-${status}\ndate: ${status === "future" ? "2099-01-01" : "2020-01-01"}\n${status === "missing" ? "" : `status: ${status === "future" ? "public" : status}\n`}---\n\nPublicationBody-${status}\n`,
    );
  }
  build();
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
