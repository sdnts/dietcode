import { json } from "@remix-run/cloudflare";
import type { Post } from "~/components/PostList";

import * as tls from "./tls.mdx";

function postFromModule(mod: any): Post {
  return {
    slug: mod.filename.replace(/\.mdx?$/, ""),
    ...mod.attributes.meta,
  };
}

export async function loader() {
  return json([postFromModule(tls)]);
}
