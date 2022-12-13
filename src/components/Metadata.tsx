import { For } from "solid-js";
import { Meta, Title } from "solid-start";
import { Post } from "./PostList";

type MetadataProps = {
  title: Post["title"];
  description: Post["description"];
  date: Post["date"];
  tags: Post["tags"];
};

export function Metadata({
  title,
  description,
  date,
  tags = [],
}: MetadataProps) {
  return (
    <>
      <Title>{title}</Title>
      <Meta property="og:type" content="website" />
      <Meta property="og:title" content={title} />
      <Meta
        property="og:description"
        content={description ?? "Sid's adventures with computers"}
      />
      <Meta property="og:image" content="https://dietcode.io/meta.png" />
      <Meta property="twitter:card" content="summary_large_image" />
      <Meta property="twitter:title" content={title} />
      <Meta
        property="twitter:description"
        content={description ?? "Sid's adventures with computers"}
      />
      <Meta property="twitter:image" content="https://dietcode.io/meta.png" />

      <div class="flex items-center justify-between text-mauve-11 h-12">
        <div>{date}</div>

        <ul class="flex list-none space-x-2">
          <For each={tags}>{(t) => <li>{t}</li>}</For>
        </ul>
      </div>
    </>
  );
}
