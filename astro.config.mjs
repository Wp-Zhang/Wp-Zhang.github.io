import { defineConfig } from "astro/config";
import { markdown } from "./src/lib/markdown.mjs";

export default defineConfig({
  markdown,
  site: "https://wp-zhang.github.io",
  output: "static",
  devToolbar: { enabled: false },
  cacheDir: "./.astro/cache",
  trailingSlash: "always",
});
