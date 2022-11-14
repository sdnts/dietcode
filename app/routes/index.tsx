import { json, LoaderFunction } from "@remix-run/cloudflare";
import { useLoaderData } from "@remix-run/react";
import { Post, PostList } from "~/components/PostList";
import { data as posts } from "./p/_data";
import { data as tils } from "./t/_data";

type LoaderResponse = {
  posts: Post[];
  tils: Post[];
};

export const loader: LoaderFunction = () => {
  return json({
    posts: posts(),
    tils: tils(),
  });
};

export default function Index() {
  const { posts, tils } = useLoaderData<LoaderResponse>();

  return (
    <div className="space-y-8">
      <PostList title="til" posts={tils} />
      <PostList title="posts" posts={posts} />
    </div>
  );
}
