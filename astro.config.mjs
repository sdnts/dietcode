import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import tailwind from "@astrojs/tailwind";
import { defineConfig } from "astro/config";

export default defineConfig({
  site: "https://dietocode.io",
  integrations: [mdx(), sitemap(), tailwind()],
  markdown: {
    shikiConfig: {
      theme: "poimandres",
      langs: ["docker", "fish", "ruby", "rust", "sh", "typescript"],
      wrap: false,
    },
  },
});
