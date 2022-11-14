import { json } from "@remix-run/cloudflare";
import { useLoaderData } from "@remix-run/react";
import { Post, PostList } from "~/components/PostList";
import { data } from "./p/_data";

export async function loader() {
  return json(data());
}

export default function Index() {
  const posts = useLoaderData<Post[]>();

  return (
    <main>
      <PostList title="posts" posts={posts} />
    </main>
  );
}
