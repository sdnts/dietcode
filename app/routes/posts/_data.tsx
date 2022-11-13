import { mdxToPosts } from "~/util/mdxToPosts";
import { sort } from "~/util/sort";
import * as tls from "./tls.mdx";

export const posts = sort(mdxToPosts([tls], "post"));
