import clsx from "clsx";
import { PropsWithChildren } from "react";

type Props = PropsWithChildren<{ id: string }>;

export function AnchoredHeading({ id, children }: Props) {
  return (
    <a
      id={id}
      className={clsx(
        "relative group",
        "no-underline hover:cursor-pointer hover:underline hover:underline-offset-2"
      )}
    >
      <div
        className={clsx(
          "absolute -left-5",
          "opacity-0 group-hover:opacity-100"
        )}
      >
        #
      </div>
      {children}
    </a>
  );
}
