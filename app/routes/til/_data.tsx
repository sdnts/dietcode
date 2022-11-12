import { json } from "@remix-run/cloudflare";
import { mdxToPosts } from "~/util/mdxToPosts";

import * as raft from "./raft.mdx";
import * as signature from "./signature.mdx";
import * as sockets from "./sockets.mdx";
import * as tls from "./tls.mdx";

export const posts = mdxToPosts([raft, signature, sockets, tls]);

export async function loader() {
  return json(posts);
}
