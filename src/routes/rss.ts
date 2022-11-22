import { mdxToPosts } from "~/util/mdxToPosts";
import { sort } from "~/util/sort";

export async function GET() {
  const [tils, posts] = await Promise.all([
    mdxToPosts(import.meta.glob("./t/*.mdx"), "til"),
    mdxToPosts(import.meta.glob("./p/*.mdx"), "post"),
  ]);
  const items = sort([...tils, ...posts]);

  return new Response(
    `<?xml version="1.0"?>
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
              <title>${p.kind === "til" ? "TIL: " : ""}${p.title}</title>
              <description>${p.description ?? p.title}</description>
              <pubDate>${new Date(p.date).toUTCString()}</pubDate>
              <guid>https://dietcode.io${p.href}</guid>
            </item>
            `
          )
          .join("\n")}
      </channel>
    </rss>`,
    {
      headers: {
        "Content-Type": "text/xml",
      },
    }
  );
}
