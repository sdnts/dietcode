import { json } from "@remix-run/cloudflare";
import { useLoaderData } from "@remix-run/react";
import { Post, PostList } from "~/components/PostList";
import { tils } from "./_data";

export async function loader() {
  return json(tils);
}

export default function Index() {
  const tils = useLoaderData<Post[]>();

  return <PostList title="til" posts={tils} />;
}
