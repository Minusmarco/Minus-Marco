"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

export type TickerItem = { label: string; href?: string };

const STATIC_ITEMS: TickerItem[] = [
  { label: "Game Journalism" },
  { label: "Community" },
  { label: "Fresno, CA" },
  { label: "The Expansion Pack To Your Game" },
  { label: "Articles" },
  { label: "Opinion" },
  { label: "Game Culture" },
  { label: "Indie Games" },
  { label: "AAA Titles" },
  { label: "Features" },
  { label: "Videos" },
  { label: "Minority Voices in Gaming" },
];

export default function Ticker({ items }: { items?: TickerItem[] }) {
  const source = items && items.length > 0 ? items : STATIC_ITEMS;
  const repeated = [...source, ...source];
  const wrapRef = useRef<HTMLDivElement>(null);
  // Off-screen tickers keep animating for nothing — pause the CSS animation
  // outside the viewport so it's not one more thing moving at all times.
  const [offscreen, setOffscreen] = useState(false);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => setOffscreen(!entry.isIntersecting), { threshold: 0 });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={wrapRef} className="w-full overflow-hidden border-y border-border bg-gradient-to-r from-[#E5F1FB] via-[#EEF4FC] to-[#E5F1FB] py-3 select-none">
      <div className={`ticker-track${offscreen ? " ticker-paused" : ""}`}>
        {repeated.map((item, i) => {
          const label = (
            <span className="font-display text-xs font-bold uppercase tracking-widest text-text-secondary">
              {item.label}
            </span>
          );
          return (
            <span key={i} className="inline-flex items-center gap-4 px-6 whitespace-nowrap">
              {item.href ? (
                <Link href={item.href} className="hover:text-accent-text transition-colors duration-200">
                  {label}
                </Link>
              ) : (
                label
              )}
              <span className="text-accent-text text-xs">✦</span>
            </span>
          );
        })}
      </div>
    </div>
  );
}
