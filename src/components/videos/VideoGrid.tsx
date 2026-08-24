"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

type Video = {
  _id: string;
  title: string;
  youtubeUrl: string;
  description?: string;
  publishedAt?: string;
  featured?: boolean;
  embedOnSite?: boolean;
};

// Pull the 11-char video id out of any common YouTube URL shape.
function youtubeId(url: string): string | null {
  const m = url.match(
    /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/|v\/))([\w-]{11})/,
  );
  return m ? m[1] : null;
}

function formatDate(iso?: string): string | null {
  if (!iso) return null;
  const d = new Date(iso);
  return Number.isNaN(d.getTime())
    ? null
    : d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export default function VideoGrid({ videos }: { videos: Video[] }) {
  const [active, setActive] = useState<{ id: string; title: string } | null>(null);

  // Let Escape close the player and lock body scroll while it's open.
  useEffect(() => {
    if (!active) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setActive(null);
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [active]);

  // Only show cards we can actually play.
  const playable = videos
    .map((v) => ({ ...v, id: youtubeId(v.youtubeUrl) }))
    .filter((v): v is Video & { id: string } => !!v.id);

  if (playable.length === 0) return null;

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {playable.map((v) => {
          const date = formatDate(v.publishedAt);
          const embed = v.embedOnSite === true;
          const cardClass =
            "group flex flex-col text-left rounded-xl border border-border bg-surface overflow-hidden hover:border-accent/50 hover:shadow-xl hover:shadow-shadow/15 transition-colors duration-300";
          const inner = (
            <>
              <div className="relative aspect-video overflow-hidden bg-bg">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`https://i.ytimg.com/vi/${v.id}/hqdefault.jpg`}
                  alt=""
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-300" />
                {v.featured && (
                  <span className="absolute top-3 left-3 rounded-full bg-accent px-2.5 py-1 font-display text-[10px] font-bold uppercase tracking-widest text-bg">
                    Featured
                  </span>
                )}
                {!embed && (
                  <span className="absolute top-3 right-3 flex items-center gap-1 rounded-full bg-bg/85 backdrop-blur-sm px-2 py-1 font-display text-[10px] font-bold uppercase tracking-widest text-text-secondary">
                    YouTube
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M7 17 17 7M7 7h10v10" />
                    </svg>
                  </span>
                )}
                <span className="absolute inset-0 flex items-center justify-center">
                  <span className="flex h-14 w-14 items-center justify-center rounded-full bg-accent/90 text-bg shadow-lg transition-transform duration-300 group-hover:scale-110">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </span>
                </span>
              </div>
              <div className="flex flex-col gap-2 p-5">
                <h3 className="font-display text-lg font-bold text-text-primary leading-snug group-hover:text-accent transition-colors duration-200 line-clamp-2">
                  {v.title}
                </h3>
                {v.description && (
                  <p className="text-sm text-text-secondary leading-relaxed line-clamp-2">{v.description}</p>
                )}
                {date && <span className="mt-1 text-xs text-text-muted font-sans">{date}</span>}
              </div>
            </>
          );

          return embed ? (
            <motion.button
              key={v._id}
              onClick={() => setActive({ id: v.id, title: v.title })}
              whileHover={{ y: -4 }}
              transition={{ duration: 0.2 }}
              className={cardClass}
            >
              {inner}
            </motion.button>
          ) : (
            <motion.a
              key={v._id}
              href={v.youtubeUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${v.title}: watch on YouTube (opens in new tab)`}
              whileHover={{ y: -4 }}
              transition={{ duration: 0.2 }}
              className={cardClass}
            >
              {inner}
            </motion.a>
          );
        })}
      </div>

      <AnimatePresence>
        {active && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActive(null)}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 sm:p-8"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-4xl"
            >
              <button
                onClick={() => setActive(null)}
                aria-label="Close video"
                className="absolute -top-11 right-0 flex items-center gap-1.5 text-sm font-sans font-medium text-white/80 hover:text-white transition-colors"
              >
                Close
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 6 6 18M6 6l12 12" />
                </svg>
              </button>
              <div className="relative aspect-video w-full overflow-hidden rounded-xl border border-border bg-black shadow-2xl">
                <iframe
                  src={`https://www.youtube-nocookie.com/embed/${active.id}?autoplay=1&rel=0`}
                  title={active.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="absolute inset-0 h-full w-full"
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
