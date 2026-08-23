"use client";

import { useState } from "react";
import { FaLink, FaCheck } from "react-icons/fa6";
import { iconFor } from "@/lib/socialIcons";

const SHARE_TARGETS = ["X", "Bluesky", "Facebook"] as const;

function hrefFor(platform: string, url: string, title: string): string {
  const shareUrl = encodeURIComponent(url);
  const shareTitle = encodeURIComponent(title);
  if (platform === "X") return `https://twitter.com/intent/tweet?url=${shareUrl}&text=${shareTitle}`;
  if (platform === "Bluesky") return `https://bsky.app/intent/compose?text=${encodeURIComponent(`${title} ${url}`)}`;
  return `https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`;
}

export default function ShareRow({ url, title }: { url: string; title: string }) {
  const [copied, setCopied] = useState(false);

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard API unavailable (older browser / no permission) — no-op.
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="mr-1 font-display text-xs font-bold uppercase tracking-widest text-text-muted">Share</span>
      <button
        onClick={copyLink}
        aria-label={copied ? "Link copied" : "Copy link"}
        className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-text-muted transition-colors duration-200 hover:border-accent hover:text-accent-text"
      >
        {copied ? <FaCheck className="h-4 w-4" aria-hidden="true" /> : <FaLink className="h-3.5 w-3.5" aria-hidden="true" />}
      </button>
      {SHARE_TARGETS.map((platform) => {
        const Icon = iconFor(platform);
        return (
          <a
            key={platform}
            href={hrefFor(platform, url, title)}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Share on ${platform} (opens in new tab)`}
            title={platform}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-text-muted transition-colors duration-200 hover:border-accent hover:text-accent-text"
          >
            <Icon className="h-4 w-4" aria-hidden="true" />
          </a>
        );
      })}
    </div>
  );
}
