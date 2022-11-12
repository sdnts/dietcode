import type { Post } from "~/components/PostList";
import { posts } from "./posts/_data";
import { posts as til } from "./til/_data";

export default function RSS() {
  function items(posts: Post[], prefix: string) {
    return posts.map(
      (p) =>
        `
        <item>
          <title>${p.title}</title>
          <description>${p.description ?? p.title}</description>
          <pubDate>${new Date(p.date).toUTCString()}</pubDate>
          <guid>https://dietcode.io/${prefix}/${p.slug}</guid>
        </item>
        `
    );
  }

  return `<?xml version="1.0"?>
    <rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
      <channel>
        <atom:link href="https://dietcode.io/feed.xml" rel="self" type="application/rss+xml" />
        <title>Dietcode | Sid's blog</title>
        <link>https://dietcode.io</link>
        <description>Sid's adventures with computers</description>
        <language>en-us</language>
        <generator>N/A</generator>
        <ttl>40</ttl>

        ${items(posts, "posts").join("\n")}
        ${items(til, "til").join("\n")}

      </channel>
    </rss>`;
}
