import type { Post } from "~/components/PostList";

export function sort(posts: Post[]) {
  return posts.sort((p1, p2) => {
    if (p1.date > p2.date) return -1;
    if (p1.date < p2.date) return 1;

    if (p1.title > p2.title) return -1;
    if (p1.title < p2.title) return 1;

    return 0;
  });
}
