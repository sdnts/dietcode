import { ParentProps } from "solid-js";

export function Header() {
  return (
    <header class="mt-8 mb-16 lg:mt-12 lg:mb-18">
      <nav class="flex justify-between items-center">
        <ul class="flex space-x-8 font-mono text-sm">
          <Link href="/">/</Link>
          <Link href="/til">/til</Link>
          <Link href="/posts">/posts</Link>
        </ul>

        <ul class="flex space-x-4 items-center">
          <a rel="me" href="https://hachyderm.io/@sid" title="Mastodon">
            <At />
          </a>

          <a href="/rss" title="RSS feed">
            <RSS />
          </a>
        </ul>
      </nav>
    </header>
  );
}

type LinkProps = ParentProps<{ href: string }>;
function Link({ href, children }: LinkProps) {
  return (
    <li>
      <a
        href={href}
        class="underline underline-offset-8 text-mauve-11 hover:text-mauve-12"
      >
        {children}
      </a>
    </li>
  );
}

function At() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
      fill="#ffffff"
      viewBox="0 0 256 256"
    >
      <rect width="256" height="256" fill="none"></rect>
      <circle
        cx="128"
        cy="128"
        r="40"
        fill="none"
        stroke="#ffffff"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="24"
      ></circle>
      <path
        d="M181.1,208A96,96,0,1,1,224,128c0,22.1-8,40-28,40s-28-17.9-28-40V88"
        fill="none"
        stroke="#ffffff"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="24"
      ></path>
    </svg>
  );
}

function RSS() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
      fill="#ffffff"
      viewBox="0 0 256 256"
    >
      <rect width="256" height="256" fill="none"></rect>
      <path
        d="M48,144a64,64,0,0,1,64,64"
        fill="none"
        stroke="#ffffff"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="24"
      ></path>
      <path
        d="M48,96A112,112,0,0,1,160,208"
        fill="none"
        stroke="#ffffff"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="24"
      ></path>
      <path
        d="M48,48A159.1,159.1,0,0,1,161.1,94.9,159.1,159.1,0,0,1,208,208"
        fill="none"
        stroke="#ffffff"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="24"
      ></path>
      <circle cx="52" cy="204" r="16"></circle>
    </svg>
  );
}
