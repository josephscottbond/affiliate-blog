import Link from "next/link";
import { siteConfig } from "@/lib/constants";

export default function Header() {
  return (
    <header className="border-b border-[var(--color-border)]">
      <nav className="content-width-wide py-4 flex items-center justify-between">
        <Link
          href="/"
          className="text-xl font-semibold tracking-tight hover:opacity-80 transition-opacity"
          style={{ fontFamily: "var(--font-serif)" }}
        >
          {siteConfig.name}
        </Link>

        <div className="flex items-center gap-6">
          <Link
            href="/blog"
            className="text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors"
          >
            Blog
          </Link>
          {/* Future: Add more nav links here */}
          {/* <Link href="/about">About</Link> */}
          {/* <Link href="/contact">Contact</Link> */}
        </div>
      </nav>
    </header>
  );
}
