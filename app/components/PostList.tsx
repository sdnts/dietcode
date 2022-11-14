import { Link } from "@remix-run/react";
import clsx from "clsx";

export type Post = {
  kind: "til" | "post";
  title: string;
  description?: string;
  slug: string;
  href: string;
  date: string;
  tags: string[];
};

type Props = { title: string; posts: Post[] };
export function PostList({ title, posts }: Props) {
  return (
    <section className="flex flex-col space-y-4">
      <span className={clsx("text-2xl font-mono text-crimson-9")}>{title}</span>
      <ul className="ml-5 flex flex-col space-y-2">
        {posts.map((p) => (
          <Item key={p.slug} href={p.href} title={p.title} />
        ))}
      </ul>
    </section>
  );
}

type ItemProps = { title: string; href: string };
function Item({ title, href }: ItemProps) {
  return (
    <li>
      -&nbsp;
      <Link to={href} className="underline underline-offset-4" title={title}>
        {title}
      </Link>
    </li>
  );
}
