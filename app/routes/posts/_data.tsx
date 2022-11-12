import { json } from "@remix-run/cloudflare";
import { mdxToPosts } from "~/util/mdxToPosts";

import * as tls from "./tls.mdx";

export const posts = mdxToPosts([tls]);

export async function loader() {
  return json(posts);
}
