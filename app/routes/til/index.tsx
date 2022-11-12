import { useLoaderData } from "@remix-run/react";
import { Post, PostList } from "~/components/PostList";

export { loader } from "./_data";

export default function Index() {
  const posts = useLoaderData<Post[]>();

  return <PostList posts={posts} prefix="til" />;
}
