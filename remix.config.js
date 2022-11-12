/** @type {import('@remix-run/dev').AppConfig} */
module.exports = {
  serverBuildTarget: "cloudflare-pages",
  server: "./server.js",
  devServerBroadcastDelay: 1000,
  ignoredRouteFiles: ["**/.*"],
  mdx: async (filename) => {
    return {
      rehypePlugins: [
        await import("rehype-highlight").then((mod) => mod.default),
      ],
    };
  },
};
