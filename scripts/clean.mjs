import { rm } from "node:fs/promises";

// In particular, an empty content collection must not reuse cached deleted posts.
await rm(".astro", { recursive: true, force: true });
await rm("dist", { recursive: true, force: true });
