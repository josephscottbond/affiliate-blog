"use client";

import { siteConfig } from "@/lib/constants";

interface ShareButtonsProps {
  title: string;
  url: string;
  description?: string;
  image?: string;
}

export default function ShareButtons({
  title,
  url,
  description,
  image,
}: ShareButtonsProps) {
  // Check for native share support - this runs on client only due to "use client"
  const canShare =
    typeof window !== "undefined" &&
    typeof navigator !== "undefined" &&
    !!navigator.share;

  const fullUrl = `${siteConfig.url}${url}`;
  const encodedUrl = encodeURIComponent(fullUrl);
  const encodedTitle = encodeURIComponent(title);
  const encodedDescription = encodeURIComponent(description || "");

  const shareLinks = {
    pinterest: image
      ? `https://pinterest.com/pin/create/button/?url=${encodedUrl}&media=${encodeURIComponent(
          `${siteConfig.url}${image}`
        )}&description=${encodedDescription}`
      : null,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text: description,
          url: fullUrl,
        });
      } catch {
        // User cancelled or share failed - this is expected behavior
      }
    }
  };

  return (
    <div className="flex items-center gap-3 mt-8 pt-8 border-t border-[var(--color-border)]">
      <span className="text-sm text-[var(--color-text-muted)]">Share:</span>

      {shareLinks.pinterest && (
        <a
          href={shareLinks.pinterest}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-outline px-3 py-1.5 text-sm"
          aria-label="Share on Pinterest"
        >
          Pinterest
        </a>
      )}

      <a
        href={shareLinks.facebook}
        target="_blank"
        rel="noopener noreferrer"
        className="btn-outline px-3 py-1.5 text-sm"
        aria-label="Share on Facebook"
      >
        Facebook
      </a>

      <a
        href={shareLinks.twitter}
        target="_blank"
        rel="noopener noreferrer"
        className="btn-outline px-3 py-1.5 text-sm"
        aria-label="Share on X"
      >
        X
      </a>

      {canShare && (
        <button
          onClick={handleShare}
          className="btn-outline px-3 py-1.5 text-sm"
          aria-label="Share via device share menu"
        >
          More
        </button>
      )}
    </div>
  );
}
