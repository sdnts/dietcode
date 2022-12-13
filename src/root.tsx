// @refresh reload
import clsx from "clsx";
import { Suspense } from "solid-js";
import {
  Body,
  ErrorBoundary,
  FileRoutes,
  Head,
  Html,
  Link,
  Meta,
  Routes,
  Scripts,
  Title,
} from "solid-start";
import { Header } from "./components/Header";
import "./root.css";

export default function Root() {
  return (
    <Html lang="en">
      <Head>
        <Title>Dietcode | Sid's blog</Title>
        <Meta charset="utf-8" />
        <Meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta property="og:type" content="website" />
        <Meta property="og:url" content="https://dietcode.io/" />
        <Meta property="og:title" content="Dietcode | Sid's blog" />
        <Meta
          property="og:description"
          content="Sid's adventures with computers"
        />
        <Meta property="og:image" content="https://dietcode.io/meta.png" />
        <Meta property="twitter:card" content="summary_large_image" />
        <Meta property="twitter:url" content="https://dietcode.io/" />
        <Meta property="twitter:title" content="Dietcode | Sid's blog" />
        <Meta
          property="twitter:description"
          content="Sid's adventures with computers"
        />
        <Meta property="twitter:image" content="https://dietcode.io/meta.png" />

        <Link rel="preconnect" href="https://fonts.bunny.net" />
        <Link
          rel="stylesheet"
          href="https://fonts.bunny.net/css?family=inter:400,800|jetbrains-mono:400&display=swap"
        />

        <Link rel="preconnect" href="https://cdnjs.cloudflare.com" />
        <Link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.4.0/styles/github-dark-dimmed.min.css"
        />
      </Head>
      <Body
        class={clsx("flex justify-center", "bg-mauve-1 text-mauve-12", "mb-24")}
      >
        <ErrorBoundary fallback={FatalError}>
          <div class="w-full max-w-[65ch] mx-8 lg:mx-0">
            <Header />
            <Suspense>
              <main>
                <Routes>
                  <FileRoutes />
                </Routes>
              </main>
            </Suspense>
          </div>
        </ErrorBoundary>
        <Scripts />
      </Body>
    </Html>
  );
}

function FatalError(e: Error) {
  return (
    <div class="flex flex-col justify-center items-center mt-48">
      <h1 class="text-9xl text-crimson-9 font-mono">500</h1>
      <h3 class="mt-8 text-xl">{e.message ?? "Unknown Error"}</h3>
      <pre class="mt-8 text-md max-w-xl overflow-scroll">{e.stack}</pre>
    </div>
  );
}
