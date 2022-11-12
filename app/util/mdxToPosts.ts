import { Post } from "~/components/PostList";

export function mdxToPosts(mdx: any[]): Post[] {
  return mdx
    .map(
      (m): Post => ({
        slug: m.filename.replace(/\.mdx?$/, ""),
        ...m.attributes.meta,
      })
    )
    .sort((p1, p2) => {
      if (p1.date > p2.date) return -1;
      if (p1.date < p2.date) return 1;

      if (p1.title > p2.title) return -1;
      if (p1.title < p2.title) return 1;

      return 0;
    });
}
