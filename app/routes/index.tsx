import { Link } from "@remix-run/react";
import clsx from "clsx";
import { PropsWithChildren } from "react";

export default function Index() {
  return (
    <div className="space-y-8 mt-8 lg:mt-24">
      <Section title="til">
        <List>
          <Item href="/til/raft">Raft consensus algorithm</Item>
          <Item href="/til/signature">Cryptographic Signatures</Item>
          <Item href="/til/sockets">Sockets</Item>
          <Item href="/til/tls">TLS</Item>
        </List>
      </Section>

      <Section title="posts">
        <List>
          <Item href="/posts/tls">TLS</Item>
        </List>
      </Section>
    </div>
  );
}

type SectionProps = PropsWithChildren<{ title: string }>;
function Section({ title, children }: SectionProps) {
  return (
    <section className="flex flex-col space-y-4">
      <span className={clsx("text-2xl font-mono text-crimson-9")}>{title}</span>
      {children}
    </section>
  );
}

type ListProps = PropsWithChildren<{}>;
function List({ children }: ListProps) {
  return <ul className="ml-6 flex flex-col space-y-2">{children}</ul>;
}

type ItemProps = PropsWithChildren<{ href: string }>;
function Item({ href, children }: ItemProps) {
  return (
    <Link to={href} className="underline underline-offset-4">
      <li>{children}</li>
    </Link>
  );
}
