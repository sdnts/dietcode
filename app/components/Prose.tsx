import { useMatches } from "@remix-run/react";
import clsx from "clsx";
import { PropsWithChildren } from "react";

type Props = PropsWithChildren<{}>;
export function Prose({ children }: Props) {
  const matches = useMatches();
  const isRoot =
    matches[matches.length - 1].pathname === "/til/" ||
    matches[matches.length - 1].pathname === "/posts/";

  return (
    <section
      className={clsx({
        "prose prose-default": !isRoot,
        "prose-h1:font-mono prose-h1:font-medium": !isRoot,
        "prose-h2:font-mono prose-h2:font-medium": !isRoot,
        "prose-h3:font-mono prose-h3:font-medium": !isRoot,
        "prose-h4:font-mono prose-h4:font-medium": !isRoot,
        "prose-h5:font-mono prose-h5:font-medium": !isRoot,
        "prose-h6:font-mono prose-h6:font-medium": !isRoot,
        "prose-pre:p-0": !isRoot,
      })}
    >
      {children}
    </section>
  );
}
