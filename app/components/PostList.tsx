import { Link } from "@remix-run/react";
import clsx from "clsx";
import { PropsWithChildren } from "react";

export type Post = {
  slug: string;
  title: string;
  description?: string;
  date: string;
  tags: string[];
};

type Props = { posts: Post[]; prefix: string };
export function PostList({ posts, prefix: hrefPrefix }: Props) {
  return (
    <section className="flex flex-col space-y-4">
      <span className={clsx("text-2xl font-mono text-crimson-9")}>
        {hrefPrefix}
      </span>
      <ul className="ml-5 flex flex-col space-y-2">
        {posts.map((p) => (
          <Item key={p.slug} href={`/${hrefPrefix}/${p.slug}`} title={p.title}>
            {p.title}
          </Item>
        ))}
      </ul>
    </section>
  );
}

type ItemProps = PropsWithChildren<{ title: string; href: string }>;
function Item({ title, href, children }: ItemProps) {
  return (
    <li>
      -&nbsp;
      <Link to={href} className="underline underline-offset-4" title={title}>
        {children}
      </Link>
    </li>
  );
}
