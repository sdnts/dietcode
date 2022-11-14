import { json } from "@remix-run/cloudflare";
import { useLoaderData } from "@remix-run/react";
import { Post, PostList } from "~/components/PostList";
import { data } from "./t/_data";

export async function loader() {
  return json(data());
}

export default function Index() {
  const tils = useLoaderData<Post[]>();

  return (
    <main>
      <PostList title="til" posts={tils} />
    </main>
  );
}
