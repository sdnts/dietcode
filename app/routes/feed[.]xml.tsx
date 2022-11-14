import { sort } from "~/util/sort";
import { data as posts } from "./p/_data";
import { data as tils } from "./t/_data";

/**
 * This is not actually a page, the Feed function is called from the server
 * entrypoint manually.
 */

export default function Feed() {
  const items = sort([...tils(), ...posts()]);

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

        ${items
          .map(
            (p) => `
            <item>
              <title>${p.title}</title>
              <description>${p.description ?? p.title}</description>
              <pubDate>${new Date(p.date).toUTCString()}</pubDate>
              <guid>https://dietcode.io/${p.href}</guid>
            </item>
            `
          )
          .join("\n")}
      </channel>
    </rss>`;
}
