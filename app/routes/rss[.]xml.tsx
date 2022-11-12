import { posts } from "./posts/_data";
import { posts as til } from "./til/_data";

export default function RSS() {
  let items = [...posts, ...til].map((post) => {
    return `
      <item>
      <title>${post.title}</title>
      <description>${post.description ?? post.title}</description>
      <pubDate>${post.date}</pubDate>
      <guid>https://dietcode.io/posts/${post.slug}</guid>
      </item>
    `;
  });

  return `<?xml version="1.0"?>
  <rss version="2.0" xmlns:blogChannel="https://dietcode.io">
    <channel>
      <title>Dietcode | Sid's blog</title>
      <link>https://dietcode.io</link>
      <description>Sid's adventures with computers</description>
      <language>en-us</language>
      <generator>N/A</generator>
      <ttl>40</ttl>

      ${items.join("\n")}
    </channel>
  </rss>
  `;
}
