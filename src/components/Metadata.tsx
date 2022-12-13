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
  description: _description,
  date,
  tags = [],
}: MetadataProps) {
  const description = _description ?? "Sid's adventures with computers";

  return (
    <>
      <Title>{title}</Title>
      <Meta name="title" content={title} />
      <Meta name="description" content={description} />
      <Meta name="og:type" content="website" />
      <Meta name="og:title" content={title} />
      <Meta name="og:description" content={description} />
      <Meta name="og:image" content="https://dietcode.io/meta.png" />
      <Meta name="twitter:card" content="summary" />
      <Meta name="twitter:title" content={title} />
      <Meta name="twitter:description" content={description} />
      <Meta name="twitter:image" content="https://dietcode.io/meta.png" />
      <Meta name="twitter:creator" content="@sdnts_" />
      <Meta name="twitter:site" content="@sdnts_" />

      <div class="flex items-center justify-between text-mauve-11 h-12">
        <div>{date}</div>

        <ul class="flex list-none space-x-2">
          <For each={tags}>{(t) => <li>{t}</li>}</For>
        </ul>
      </div>
    </>
  );
}
