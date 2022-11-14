import { Outlet } from "@remix-run/react";
import { Prose } from "~/components/Prose";

export default function Post() {
  return (
    <Prose>
      <Outlet />
    </Prose>
  );
}
