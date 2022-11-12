import { Link } from "@remix-run/react";
import { Rss } from "phosphor-react";
import { PropsWithChildren } from "react";

export function Header() {
  return (
    <header className="mt-8 mb-16 lg:mt-12 lg:mb-18">
      <nav className="flex justify-between items-center">
        <ul className="flex space-x-8 font-mono text-sm">
          <Item href="/">/</Item>
          <Item href="/til">/til</Item>
          <Item href="/posts">/posts</Item>
        </ul>

        <Link to="/feed.xml" title="RSS feed">
          <Rss weight="bold" size={18} />
        </Link>
      </nav>
    </header>
  );
}

type ItemProps = PropsWithChildren<{ href: string }>;
function Item({ href, children }: ItemProps) {
  return (
    <li>
      <Link
        to={href}
        className="underline underline-offset-8 text-mauve-11 hover:text-mauve-12"
      >
        {children}
      </Link>
    </li>
  );
}
