import { Link } from "@remix-run/react";

export function PostFooter() {
  return (
    <footer className="mt-12 text-mauve-11 italic">
      If you think this post contains inaccuracies, please email me at{" "}
      <Link
        to="mailto:sid@dietcode.io"
        title="sid@dietcode.io"
        className="underline underline-offset-2"
      >
        sid@dietcode.io
      </Link>
    </footer>
  );
}
