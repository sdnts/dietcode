import { mdxToPosts } from "~/util/mdxToPosts";
import { sort } from "~/util/sort";
import * as cryptoSignatures from "./crypto-signatures.mdx";
import * as sockets from "./sockets.mdx";

export function data() {
  return sort(mdxToPosts([cryptoSignatures, sockets], "til"));
}
