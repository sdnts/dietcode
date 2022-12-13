import clsx from "clsx";
import { For } from "solid-js";

export type Post = {
  kind: "til" | "post";
  title: string;
  description: string;
  slug: string;
  href: string;
  date: string;
  tags: string[];
};

type Props = { title: string; posts: Post[] };
export function PostList({ title, posts = [] }: Props) {
  return (
    <section class="flex flex-col space-y-4">
      <span class={clsx("text-2xl font-mono text-crimson-9")}>{title}</span>
      <ul class="ml-5 flex flex-col space-y-2">
        <For each={posts}>
          {({ href, title }) => (
            <li>
              -&nbsp;
              <a href={href} class="underline underline-offset-4" title={title}>
                {title?.startsWith("TIL: ")
                  ? title.slice("TIL: ".length)
                  : title}
              </a>
            </li>
          )}
        </For>
      </ul>
    </section>
  );
}
