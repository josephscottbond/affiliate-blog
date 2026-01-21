import Link from "next/link";
import { siteConfig, affiliateDisclosure } from "@/lib/constants";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-[var(--color-border)] mt-16">
      <div className="content-width-wide py-12">
        {/* Affiliate Disclosure */}
        <div className="text-sm text-[var(--color-text-light)] mb-8 max-w-2xl">
          <p className="font-medium mb-2">Affiliate Disclosure</p>
          <p>{affiliateDisclosure.short}</p>
        </div>

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="text-sm text-[var(--color-text-muted)]">
            © {currentYear} {siteConfig.name}. All rights reserved.
          </div>

          <div className="flex items-center gap-6 text-sm">
            {/* Social links - add when ready */}
            {siteConfig.social.pinterest && (
              <a
                href={`https://pinterest.com/${siteConfig.social.pinterest}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors"
              >
                Pinterest
              </a>
            )}
            {siteConfig.social.instagram && (
              <a
                href={`https://instagram.com/${siteConfig.social.instagram}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors"
              >
                Instagram
              </a>
            )}
            <Link
              href="/feed.xml"
              className="text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors"
            >
              RSS
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
