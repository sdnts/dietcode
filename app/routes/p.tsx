import { Outlet } from "@remix-run/react";
import { PostFooter } from "~/components/PostFooter";
import { Prose } from "~/components/Prose";

export default function Post() {
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