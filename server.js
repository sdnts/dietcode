import { createPagesFunctionHandler } from "@remix-run/cloudflare-pages";
import * as build from "@remix-run/dev/server-build";

const handleRequest = createPagesFunctionHandler({
  build,
  mode: process.env.NODE_ENV,
  getLoadContext: (context) => context.env,
});

export async function onRequest(context) {
  const request = context.request;
  const cache = caches.default;
  const cacheUrl = new URL(request.url);
  const cacheKey = new Request(cacheUrl.toString(), request);

  if (request.method === "GET") {
    const cachedResponse = await cache.match(cacheKey);
    if (cachedResponse) return cachedResponse;
  }

  const response = await handleRequest(context);

  if (request.method === "GET" && response.status === 200) {
    context.waitUntil(
      (() => {
        const cachedResponse = response.clone();
        cachedResponse.headers.set(
          "Cache-Control",
          "s-maxage=86400" // 1 day
        );
        cachedResponse.headers.set("CF-Cache-Status", "HIT");

        return cache.put(cacheKey, cachedResponse);
      })()
    );
  }

  response.headers.set("CF-Cache-Status", "MISS");
  return response;
}
