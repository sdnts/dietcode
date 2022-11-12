import { PostList } from "~/components/PostList";
import { posts } from "./posts/_data";
import { posts as til } from "./til/_data";

export default function Index() {
  return (
    <div className="space-y-8 mt-8 lg:mt-24">
      <PostList posts={til} prefix="til" />
      <PostList posts={posts} prefix="posts" />
    </div>
  );
}
