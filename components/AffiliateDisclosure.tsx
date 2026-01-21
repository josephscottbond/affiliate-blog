import { affiliateDisclosure } from "@/lib/constants";

interface AffiliateDisclosureProps {
  variant?: "short" | "full";
}

export default function AffiliateDisclosure({
  variant = "short",
}: AffiliateDisclosureProps) {
  const text =
    variant === "full" ? affiliateDisclosure.full : affiliateDisclosure.short;

  return (
    <aside className="affiliate-disclosure" role="note" aria-label="Affiliate Disclosure">
      <p>{text}</p>
    </aside>
  );
}
