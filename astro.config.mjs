import { defineConfig } from "astro/config";

export default defineConfig({
  site: "https://wp-zhang.github.io",
  output: "static",
  cacheDir: "./.astro/cache",
  trailingSlash: "always",
});
