import { createRouteData, RouteDataFunc, useRouteData } from "solid-start";
import { Post, PostList } from "~/components/PostList";
import { mdxToPosts } from "~/util/mdxToPosts";
import { sort } from "~/util/sort";

export const routeData: RouteDataFunc<Post[]> = () =>
  createRouteData(async () =>
    sort(await mdxToPosts(import.meta.glob("./p/*.mdx"), "post"))
  )();

export default function Index() {
  const posts = useRouteData<Post[] | undefined>();

  return <PostList title="posts" posts={posts} />;
}
