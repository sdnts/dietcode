import { Outlet, useMatches } from "@remix-run/react";
import { Prose } from "~/components/Prose";

export default function TIL() {
  const matches = useMatches();
  const isIndex = matches[matches.length - 1].pathname === "/posts/";

  // On /posts, do not format content as prose
  if (isIndex) {
    return (
      <main>
        <Outlet />
      </main>
    );
  }

  return (
    <Prose>
      <Outlet />
    </Prose>
  );
}
