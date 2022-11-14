import { Outlet } from "@remix-run/react";
import { PostFooter } from "~/components/PostFooter";
import { Prose } from "~/components/Prose";

export default function TIL() {
  return (
    <>
      <main>
        <Prose>
          <Outlet />
        </Prose>
      </main>

      <PostFooter />
    </>
  );
}
