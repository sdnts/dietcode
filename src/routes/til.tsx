import { createRouteData, RouteDataFunc, useRouteData } from "solid-start";
import { Post, PostList } from "~/components/PostList";
import { mdxToPosts } from "~/util/mdxToPosts";
import { sort } from "~/util/sort";

export const routeData: RouteDataFunc<Post[]> = () =>
  createRouteData(async () =>
    sort(await mdxToPosts(import.meta.glob("./t/*.mdx"), "til"))
  )();

export default function Index() {
  const tils = useRouteData<Post[] | undefined>();

  return <PostList title="til" posts={tils} />;
}
