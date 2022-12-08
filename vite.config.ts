import mdx from "@mdx-js/rollup";
import langHttp from "highlight.js/lib/languages/http";
import rehypeHighlight from "rehype-highlight";
import cfPagesAdapter from "solid-start-cloudflare-pages";
import solid from "solid-start/vite";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [
    {
      ...mdx({
        jsx: true,
        jsxImportSource: "solid-js",
        providerImportSource: "solid-mdx",
        rehypePlugins: [[rehypeHighlight, { languages: { http: langHttp } }]],
      }),
      enforce: "pre",
    },
    solid({
      extensions: [".mdx"],
      adapter: cfPagesAdapter({}),
    }),
  ],
});
