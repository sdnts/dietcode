import { mdxToPosts } from "~/util/mdxToPosts";
import { sort } from "~/util/sort";
import * as oneProblemAtATime from "./one-problem-at-a-time.mdx";

export function data() {
  return sort(mdxToPosts([oneProblemAtATime], "post"));
}
