"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { urlFor } from "@/sanity/lib/image";

const SEEN_KEY = "mm-intro-seen";
const READY_DEADLINE_MS = 1500;
const HARD_CAP_MS = 10000;

export type IntroVideoData = {
  _id: string;
  videoUrl: string | null;
  poster?: { asset: object; alt?: string } | null;
} | null;

type NetworkInformation = { saveData?: boolean; effectiveType?: string };

// The overlay fades in over 300ms once the video is ready, and fades out
// over 600ms on finish — the exit IS the "fade into the mainpage," since the
// homepage is already rendered underneath the whole time.
const variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.3 } },
  exit: { opacity: 0, transition: { duration: 0.6 } },
};

function shouldAttempt(intro: IntroVideoData): boolean {
  if (!intro?.videoUrl) return false;
  try {
    if (sessionStorage.getItem(SEEN_KEY) === "1") return false;
  } catch {
    // sessionStorage unavailable (e.g. some private-mode configurations) —
    // fail safe and never show, rather than risk showing every load.
    return false;
  }
  const nav = navigator as Navigator & { connection?: NetworkInformation };
  const conn = nav.connection;
  if (conn?.saveData) return false;
  if (conn?.effectiveType === "2g" || conn?.effectiveType === "slow-2g") return false;
  return true;
}

export default function IntroSplash({ intro }: { intro: IntroVideoData }) {
  const reducedMotion = useReducedMotion();
  const videoRef = useRef<HTMLVideoElement>(null);
  const skipBtnRef = useRef<HTMLButtonElement>(null);
  const deadlineTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const capTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // pending: deciding whether to attempt at all (renders nothing, SSR-safe).
  // waiting: video mounted but invisible, racing the readiness deadline.
  // visible: ready, playing, overlay shown.
  // done: finished/skipped/aborted — never shows again this render.
  const [phase, setPhase] = useState<"pending" | "waiting" | "visible" | "done">("pending");

  // One-shot gate, deferred a tick so the setState calls live in a timer
  // callback rather than synchronously in the effect body. Guarded to
  // `phase === "pending"` so a late-resolving reduced-motion value can't
  // re-fire this once we're already waiting/playing.
  useEffect(() => {
    if (phase !== "pending") return;
    const t = setTimeout(() => {
      if (reducedMotion || !shouldAttempt(intro)) {
        setPhase("done");
      } else {
        setPhase("waiting");
      }
    }, 0);
    return () => clearTimeout(t);
  }, [phase, intro, reducedMotion]);

  const abort = useCallback(() => {
    // Deliberately does NOT set the "seen" flag — they haven't seen it, so a
    // faster future session should still get a chance.
    if (deadlineTimer.current) clearTimeout(deadlineTimer.current);
    setPhase("done");
  }, []);

  const finish = useCallback(() => {
    if (deadlineTimer.current) clearTimeout(deadlineTimer.current);
    if (capTimer.current) clearTimeout(capTimer.current);
    videoRef.current?.pause();
    setPhase("done");
  }, []);

  // Deadline timer: video must be ready before this fires, or we abort.
  useEffect(() => {
    if (phase !== "waiting") return;
    deadlineTimer.current = setTimeout(abort, READY_DEADLINE_MS);
    return () => { if (deadlineTimer.current) clearTimeout(deadlineTimer.current); };
  }, [phase, abort]);

  // While visible: lock scroll, move focus to Skip, wire Escape/Enter, start
  // the hard-cap timer, and restore focus/scroll on the way out.
  useEffect(() => {
    if (phase !== "visible") return;
    const previouslyFocused = document.activeElement as HTMLElement | null;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    skipBtnRef.current?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" || e.key === "Enter") {
        e.preventDefault();
        finish();
      }
    };
    window.addEventListener("keydown", onKey);
    capTimer.current = setTimeout(finish, HARD_CAP_MS);

    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
      if (capTimer.current) clearTimeout(capTimer.current);
      previouslyFocused?.focus?.();
    };
  }, [phase, finish]);

  // Event handlers below run inside real DOM event callbacks (not bare
  // effect bodies), so their setState calls are the sanctioned pattern.
  async function onCanPlay() {
    if (phase !== "waiting") return; // deadline already aborted, or handled
    if (deadlineTimer.current) clearTimeout(deadlineTimer.current);
    try {
      sessionStorage.setItem(SEEN_KEY, "1");
    } catch {
      // Ignore — worst case a private-mode session replays; not worth failing over.
    }
    const video = videoRef.current;
    if (!video) { abort(); return; }
    try {
      await video.play();
      setPhase("visible");
    } catch {
      abort();
    }
  }

  if (phase === "pending") return null;

  const posterUrl = intro?.poster ? urlFor(intro.poster).width(1920).url() : undefined;

  return (
    <AnimatePresence>
      {(phase === "waiting" || phase === "visible") && (
        <motion.div
          key="intro-splash"
          role="dialog"
          aria-label="Intro video"
          aria-modal="true"
          aria-hidden={phase !== "visible" || undefined}
          variants={variants}
          initial="hidden"
          animate={phase === "visible" ? "visible" : "hidden"}
          exit="exit"
          className="fixed inset-0 z-[120] overflow-hidden bg-ink"
          style={{ pointerEvents: phase === "visible" ? "auto" : "none" }}
        >
          <video
            ref={videoRef}
            src={intro?.videoUrl ?? undefined}
            poster={posterUrl}
            muted
            playsInline
            preload="auto"
            onCanPlay={onCanPlay}
            onError={abort}
            onEnded={finish}
            className="h-full w-full object-cover"
          />

          {/* Brand bug — small, not a title card */}
          <div className="absolute bottom-6 left-6 flex items-center gap-2 sm:bottom-8 sm:left-8">
            <span className="flex h-7 w-7 items-center justify-center rounded bg-accent font-display text-sm font-extrabold text-bg">
              M
            </span>
            <div>
              <p className="font-display text-xs font-extrabold uppercase leading-none tracking-wide text-[#EDEFF6]">
                Minus Marco
              </p>
              <div className="mt-1.5 h-0.5 w-8 rounded-full bg-[#f6b327]" />
            </div>
          </div>

          <button
            ref={skipBtnRef}
            onClick={finish}
            className="absolute bottom-6 right-6 flex items-center gap-1.5 rounded-full border border-white/25 px-4 py-2 font-display text-xs font-bold uppercase tracking-widest text-[#EDEFF6] transition-colors duration-200 hover:border-accent hover:text-accent sm:bottom-8 sm:right-8"
          >
            Skip intro ▸
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
