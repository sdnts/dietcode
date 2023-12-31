import rss from "@astrojs/rss";
import { getCollection } from "astro:content";
import { sort } from "../util/sort";

export async function GET(context: any) {
  const items = sort([
    ...(await getCollection("post")),
    ...(await getCollection("til")),
  ]);

  return rss({
    title: "Dietcode | Sid's blog",
    description: "Bite-sized slices of Sid's adventures with computers",
    site: context.site,
    items: items.map((item) => ({
      title: item.data.title,
      description: item.data.description,
      pubDate: item.data.date,
      link: item.collection === "til" ? `/t/${item.slug}` : `/p/${item.slug}`,
    })),
  });
}
