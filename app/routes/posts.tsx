import { Outlet, useMatches } from "@remix-run/react";
import clsx from "clsx";

export default function Posts() {
  const matches = useMatches();

  return (
    <main
      className={clsx({
        prose: matches[matches.length - 1].pathname !== "/posts/",
      })}
    >
      <Outlet />
    </main>
  );
}
