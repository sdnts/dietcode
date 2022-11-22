import type { Post } from "~/components/PostList";

export type MDXMeta = {
  filename: string;
  title: string;
  description: string;
  date: string;
  tags: string[];
};

export async function mdxToPosts(
  mdx: Record<string, () => Promise<unknown>>,
  kind: Post["kind"]
): Promise<Post[]> {
  const posts = await Promise.all(
    Object.values(mdx).map((m) => m()) as Promise<MDXMeta>[]
  );
  const filenames = Object.keys(mdx);

  return posts.map((p, i): Post => {
    const slug = filenames[i]
      .split("/")
      .slice(-1)[0]
      .replace(/\.mdx?$/, "");
    const href = `/${kind.slice(0, 1)}/${slug}`;

    return {
      kind,
      href,
      slug,
      ...p,
    };
  });
}
