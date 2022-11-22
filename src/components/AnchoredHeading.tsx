import clsx from "clsx";
import { ParentProps } from "solid-js";

type Props = ParentProps<{ id: string }>;

export function AnchoredHeading({ id, children }: Props) {
  return (
    <a
      id={id}
      class={clsx(
        "relative group",
        "no-underline hover:cursor-pointer hover:underline hover:underline-offset-2"
      )}
    >
      <div
        class={clsx("absolute -left-5", "opacity-0 group-hover:opacity-100")}
      >
        #
      </div>
      {children}
    </a>
  );
}
