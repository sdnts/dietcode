import type { Post } from "~/components/PostList";

export function mdxToPosts(mdx: any[], kind: Post["kind"]): Post[] {
  return mdx.map(
    (m): Post => ({
      kind,
      slug: m.filename.replace(/\.mdx?$/, ""),
      ...m.attributes.meta,
    })
  );
}
