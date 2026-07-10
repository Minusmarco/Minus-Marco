"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import Image from "next/image";

const TIPS = [
  "Underrepresented voices make better games.",
  "The expansion pack to your game.",
  "Syncing save data…",
  "Loading Fresno servers…",
  "Marco covers the stories others miss.",
  "Tip: press ↑ ↓ to work the main menu.",
];

export default function LevelLoader() {
  const pathname = usePathname();
  const reduced = useReducedMotion();
  const [loading, setLoading] = useState(false);
  const [tip, setTip] = useState(TIPS[0]);
  const first = useRef(true);
  const safety = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearTimers = () => {
    if (safety.current) clearTimeout(safety.current);
    if (hideTimer.current) clearTimeout(hideTimer.current);
  };

  // Drop the loading screen the instant an internal link is clicked, so it
  // covers the old page before the new one commits.
  useEffect(() => {
    if (reduced) return;
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as HTMLElement)?.closest?.("a");
      if (!a) return;
      const href = a.getAttribute("href");
      if (!href || !href.startsWith("/")) return;
      if (a.target === "_blank" || a.hasAttribute("download")) return;
      const url = new URL(a.href, window.location.href);
      if (url.pathname === window.location.pathname) return;
      setTip(TIPS[Math.floor(Math.random() * TIPS.length)]);
      setLoading(true);
      clearTimers();
      // Failsafe: never let the loader stick if navigation is cancelled.
      safety.current = setTimeout(() => setLoading(false), 2500);
    };
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, [reduced]);

  // Once the new route commits, hold the screen briefly, then lift it away.
  useEffect(() => {
    if (first.current) { first.current = false; return; }
    if (!loading) return;
    clearTimers();
    hideTimer.current = setTimeout(() => setLoading(false), 480);
    return clearTimers;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  useEffect(() => clearTimers, []);

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          key="level-loader"
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "-100%" }}
          transition={{ duration: 0.4, ease: [0.76, 0, 0.24, 1] }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-bg overflow-hidden"
        >
          {/* faint brand texture */}
          <div className="absolute inset-0 opacity-[0.05] pointer-events-none" style={{
            backgroundImage: "linear-gradient(var(--color-accent) 1px, transparent 1px), linear-gradient(90deg, var(--color-accent) 1px, transparent 1px)",
            backgroundSize: "56px 56px",
          }} />
          <div className="absolute -top-24 right-0 h-[420px] w-[420px] rounded-full bg-accent opacity-[0.10] blur-[130px] pointer-events-none" />

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.15, duration: 0.3 }}
            className="relative flex flex-col items-center"
          >
            <Image src="/logo-icon.png" alt="" width={64} height={64} className="h-16 w-16 rounded-lg object-contain" priority />
            <div className="mt-5 flex items-center gap-2 font-display text-sm font-bold uppercase tracking-[0.28em] text-text-secondary">
              Loading
              <motion.span animate={{ opacity: [0.2, 1, 0.2] }} transition={{ duration: 1.1, repeat: Infinity }}>●</motion.span>
            </div>

            {/* progress bar */}
            <div className="mt-4 h-1.5 w-56 max-w-[70vw] overflow-hidden rounded-full bg-surface-raised">
              <motion.div
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: 0.9, ease: "easeInOut" }}
                className="h-full rounded-full bg-accent"
              />
            </div>

            <p className="mt-5 max-w-xs text-center font-display text-xs font-bold uppercase tracking-[0.14em] text-text-muted">
              {tip}
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
