import { Outlet } from "solid-start";
import { PostFooter } from "~/components/PostFooter";
import { Prose } from "~/components/Prose";

export default function TIL() {
  return (
    <>
      <Prose>
        <Outlet />
      </Prose>

      <PostFooter />
    </>
  );
}
