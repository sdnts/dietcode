import clsx from "clsx";
import { ParentProps } from "solid-js";

type Props = ParentProps<{}>;
export function Prose({ children }: Props) {
  return (
    <section
      class={clsx(
        "prose prose-default",
        "prose-h1:font-mono prose-h1:font-medium",
        "prose-h2:font-mono prose-h2:font-medium",
        "prose-h3:font-mono prose-h3:font-medium",
        "prose-h4:font-mono prose-h4:font-medium",
        "prose-h5:font-mono prose-h5:font-medium",
        "prose-h6:font-mono prose-h6:font-medium",
        "prose-pre:p-0 prose-pre:whitespace-pre-wrap",
        "prose-code:bg-mauve-4",
        "prose-a:break-all",
        "prose-img:w-fit prose-img:mx-auto"
      )}
    >
      {children}
    </section>
  );
}
