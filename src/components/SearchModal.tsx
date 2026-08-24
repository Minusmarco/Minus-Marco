"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";

export const OPEN_SEARCH_EVENT = "minus-marco:open-search";

type Result = { type: "article" | "video"; title: string; href: string };

export default function SearchModal() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Result[]>([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const close = useCallback(() => {
    setOpen(false);
    setQuery("");
    setResults([]);
  }, []);

  // Cmd/Ctrl+K toggles from anywhere; the navbar button dispatches the same
  // custom event so both entry points share one modal instance.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((v) => !v);
      } else if (e.key === "Escape") {
        setOpen(false);
      }
    };
    const onOpenEvent = () => setOpen(true);
    window.addEventListener("keydown", onKey);
    window.addEventListener(OPEN_SEARCH_EVENT, onOpenEvent);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener(OPEN_SEARCH_EVENT, onOpenEvent);
    };
  }, []);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
      const raf = requestAnimationFrame(() => inputRef.current?.focus());
      return () => {
        cancelAnimationFrame(raf);
        document.body.style.overflow = "";
      };
    }
  }, [open]);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    const trimmed = query.trim();
    // A short/empty query renders its own "type at least 2 characters"
    // message regardless of stale `results`/`loading`, so nothing needs
    // resetting here.
    if (trimmed.length < 2) return;
    debounceRef.current = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(trimmed)}`);
        const json = await res.json();
        setResults(json.results ?? []);
      } catch {
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 200);
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [query]);

  function go(href: string) {
    close();
    router.push(href);
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="fixed inset-0 z-[90] flex items-start justify-center bg-ink/60 backdrop-blur-sm px-4 pt-24 sm:pt-32"
          onClick={close}
        >
          <motion.div
            initial={{ opacity: 0, y: -12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.98 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg overflow-hidden rounded-xl border border-border bg-surface shadow-2xl shadow-shadow/25"
          >
            <div className="flex items-center gap-3 border-b border-border px-4 py-3.5">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0 text-text-muted">
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
              </svg>
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search articles & videos…"
                className="flex-1 bg-transparent font-sans text-sm text-text-primary outline-none placeholder:text-text-muted"
              />
              <kbd className="hidden rounded border border-border px-1.5 py-0.5 font-display text-[10px] font-bold text-text-muted sm:inline-block">
                ESC
              </kbd>
            </div>

            <div className="max-h-80 overflow-y-auto">
              {query.trim().length < 2 ? (
                <p className="px-4 py-8 text-center text-sm text-text-muted">Type at least 2 characters to search.</p>
              ) : loading ? (
                <p className="px-4 py-8 text-center text-sm text-text-muted">Searching…</p>
              ) : results.length === 0 ? (
                <p className="px-4 py-8 text-center text-sm text-text-muted">No results. Try another quest.</p>
              ) : (
                <ul className="py-2">
                  {results.map((r) => (
                    <li key={r.href + r.title}>
                      <button
                        onClick={() => go(r.href)}
                        className="flex w-full items-center gap-3 px-4 py-2.5 text-left transition-colors duration-150 hover:bg-surface-raised"
                      >
                        <span
                          className={`flex-shrink-0 rounded-sm px-1.5 py-0.5 font-display text-[10px] font-bold uppercase tracking-widest ${
                            r.type === "video" ? "bg-[#f6b327]/15 text-gold-text" : "bg-accent-dim text-accent-text"
                          }`}
                        >
                          {r.type === "video" ? "Video" : "Article"}
                        </span>
                        <span className="line-clamp-1 text-sm text-text-primary">{r.title}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
