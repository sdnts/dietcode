import { json } from "@remix-run/cloudflare";
import { useLoaderData } from "@remix-run/react";
import { Post, PostList } from "~/components/PostList";
import { posts } from "./_data";

export async function loader() {
  return json(posts);
}

export default function Index() {
  const posts = useLoaderData<Post[]>();

  return <PostList title="posts" posts={posts} />;
}
