import type { MetaFunction } from "@remix-run/cloudflare";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useCatch,
  useMatches,
} from "@remix-run/react";
import clsx from "clsx";
import { Header } from "./components/Header";
import styles from "./styles.css";

export const meta: MetaFunction = () => ({
  charset: "utf-8",
  title: "Dietcode",
  viewport: "width=device-width,initial-scale=1",
});

export function links() {
  return [
    {
      rel: "stylesheet",
      href: "https://fonts.bunny.net/css?family=inter:400,900|jetbrains-mono:400&display=swap",
    },
    { rel: "stylesheet", href: styles },
    {
      rel: "stylesheet",
      href: "https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.4.0/styles/github-dark-dimmed.min.css",
    },
  ];
}

export default function App() {
  const matches = useMatches();
  const includeScripts = matches.some(
    (match) => match.handle?.interactive ?? false
  );

  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
      </head>
      <body className={clsx("flex justify-center", "bg-mauve-1 text-mauve-12")}>
        <div className="w-full mx-8 lg:max-w-[960px] lg:mx-0">
          <Header />
          <Outlet />
        </div>
        <ScrollRestoration />
        {includeScripts ? <Scripts /> : null}
        <LiveReload />
      </body>
    </html>
  );
}

export function CatchBoundary() {
  const caught = useCatch();

  return (
    <html>
      <head>
        <title>Yikes</title>
        <Meta />
        <Links />
      </head>
      <body className={clsx("flex justify-center", "bg-mauve-1 text-mauve-12")}>
        <div className="w-full mx-8 lg:max-w-[960px] lg:mx-0">
          <Header />

          <div className="flex flex-col justify-center items-center mt-48">
            <h1 className="text-9xl text-crimson-9 font-mono">
              {caught.status}
            </h1>
            <h3 className="mt-8 text-xl">{caught.statusText}</h3>
          </div>
        </div>
        <ScrollRestoration />
        <LiveReload />
      </body>
    </html>
  );
}
