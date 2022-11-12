import { useLoaderData } from "@remix-run/react";
import { Post, PostList } from "~/components/PostList";

export { loader } from "./_til";

export default function Index() {
  const posts = useLoaderData<Post[]>();

  return <PostList posts={posts} />;
}
