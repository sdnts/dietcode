import { Outlet } from "solid-start";
import { PostFooter } from "~/components/PostFooter";
import { Prose } from "~/components/Prose";

export default function Post() {
  return (
    <>
      <Prose>
        <Outlet />
      </Prose>

      <PostFooter />
    </>
  );
}
