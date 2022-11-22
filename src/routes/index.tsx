import { createRouteData, RouteDataFunc, useRouteData } from "solid-start";
import { Post, PostList } from "~/components/PostList";
import { mdxToPosts } from "~/util/mdxToPosts";
import { sort } from "~/util/sort";

type RouteData = {
  tils: Post[];
  posts: Post[];
};

export const routeData: RouteDataFunc<RouteData> = () =>
  createRouteData<RouteData>(async () => {
    const [tils, posts] = await Promise.all([
      mdxToPosts(import.meta.glob("./t/*.mdx"), "til"),
      mdxToPosts(import.meta.glob("./p/*.mdx"), "post"),
    ]);

    return {
      tils: sort(tils),
      posts: sort(posts),
    };
  })();

export default function Index() {
  const data = useRouteData<RouteData | undefined>();

  return (
    <div class="space-y-8">
      <PostList title="til" posts={data?.tils} />
      <PostList title="posts" posts={data?.posts} />
    </div>
  );
}
