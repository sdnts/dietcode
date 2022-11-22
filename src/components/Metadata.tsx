import { For } from "solid-js";
import { Title } from "solid-start";
import { Post } from "./PostList";

export function Metadata({ title, date, tags = [] }: Post) {
  return (
    <>
      <Title>{title}</Title>
      <div class="flex items-center justify-between text-mauve-11 h-12">
        <div>{date}</div>

        <ul class="flex list-none space-x-2">
          <For each={tags}>{(t) => <li>{t}</li>}</For>
        </ul>
      </div>
    </>
  );
}
