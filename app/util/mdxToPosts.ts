import type { Post } from "~/components/PostList";

export function mdxToPosts(mdx: any[], kind: Post["kind"]): Post[] {
  return mdx.map((m): Post => {
    const slug = m.filename.replace(/\.mdx?$/, "");
    const href = `/${kind.slice(0, 1)}/${slug}`;

    return {
      kind,
      href,
      slug,
      ...m.attributes.meta,
    };
  });
}
