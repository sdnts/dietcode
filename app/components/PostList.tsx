import { Link } from "@remix-run/react";
import clsx from "clsx";
import { PropsWithChildren } from "react";

export type Post = {
  slug: string;
  title: string;
  description?: string;
  date: string;
};

type Props = { posts: Post[] };
export function PostList({ posts }: Props) {
  return (
    <section className="flex flex-col space-y-4">
      <span className={clsx("text-2xl font-mono text-crimson-9")}>til</span>
      <ul className="ml-6 flex flex-col space-y-2">
        {posts.map((p) => (
          <Item key={p.slug} href={`/til/${p.slug}`}>
            {p.title}
          </Item>
        ))}
      </ul>
    </section>
  );
}

type ItemProps = PropsWithChildren<{ href: string }>;
function Item({ href, children }: ItemProps) {
  return (
    <Link to={href} className="underline underline-offset-4">
      <li>{children}</li>
    </Link>
  );
}
