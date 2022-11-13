import { mdxToPosts } from "~/util/mdxToPosts";
import { sort } from "~/util/sort";
import * as cryptoSignatures from "./crypto-signatures.mdx";
import * as raft from "./raft.mdx";
import * as sockets from "./sockets.mdx";
import * as tls from "./tls.mdx";

export const tils = sort(
  mdxToPosts([raft, cryptoSignatures, sockets, tls], "til")
);
