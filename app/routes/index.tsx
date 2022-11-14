import { PostList } from "~/components/PostList";
import { posts } from "./post/_data";
import { tils } from "./til/_data";

export default function Index() {
  return (
    <div className="space-y-8">
      <PostList title="til" posts={tils} />
      <PostList title="posts" posts={posts} />
    </div>
  );
}
