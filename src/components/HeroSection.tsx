"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, useReducedMotion } from "framer-motion";

export type FeatureItem = {
  kind: "article" | "video";
  label: string;
  title: string;
  blurb: string;
  href: string;
  image: string | null;
  cta: string;
};

type Props = {
  items: FeatureItem[];
};

const MENU = [
  { label: "Articles", sub: "Reviews, essays & opinion", href: "/articles" },
  { label: "Videos", sub: "Deep-dives & previews", href: "/videos" },
  { label: "Community", sub: "Polls, debates & shoutouts", href: "/community" },
  { label: "About", sub: "Player one: Marco", href: "/about" },
];

const fadeUp = { hidden: { opacity: 0, y: 18 }, show: { opacity: 1, y: 0 } };
const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.08, delayChildren: 0.15 } } };

const PLACEHOLDER: FeatureItem = {
  kind: "article",
  label: "Coming Soon",
  title: "New game: first drop loading",
  blurb: "Marco is loading up the first story. Hit Articles to look around in the meantime.",
  href: "/articles",
  image: null,
  cta: "Explore",
};

function FeatureReel({ items, inView }: { items: FeatureItem[]; inView: boolean }) {
  const reel = items.length > 0 ? items : [PLACEHOLDER];
  // Clamp at render time instead of in an effect — avoids a redundant
  // cascading re-render when the reel shrinks.
  const [rawIdx, setIdx] = useState(0);
  const idx = rawIdx < reel.length ? rawIdx : 0;
  const [paused, setPaused] = useState(false);
  // How many auto-advances have fired — once we've cycled through every item
  // once, autoplay stops and the visitor drives the rest with dots/arrows.
  const autoTicksRef = useRef(0);

  // Auto-advance through the feature reel once; pauses while hovered or
  // while the hero has scrolled off-screen. Including `idx` in the deps
  // restarts the countdown after a manual move.
  useEffect(() => {
    if (paused || !inView || reel.length <= 1) return;
    if (autoTicksRef.current >= reel.length - 1) return;
    const t = setInterval(() => {
      autoTicksRef.current += 1;
      setIdx((i) => (i + 1) % reel.length);
    }, 4000);
    return () => clearInterval(t);
  }, [paused, inView, reel.length, idx]);

  const next = () => setIdx((i) => (i + 1) % reel.length);
  const prev = () => setIdx((i) => (i - 1 + reel.length) % reel.length);

  const item = reel[idx];
  const isVideo = item.kind === "video";

  return (
    <div
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      className="rounded-2xl border border-border bg-surface/90 backdrop-blur-sm p-5 sm:p-6 shadow-[0_20px_50px_-20px_rgba(42,74,115,0.35)]"
    >
      <div className="flex items-center justify-between mb-3">
        <span className="font-display text-xs font-bold uppercase tracking-[0.16em] text-[#f6b327]">▶ Continue</span>
        <span className="font-display text-[11px] font-bold uppercase tracking-[0.14em] text-text-muted">
          Featured Reel
        </span>
      </div>

      <motion.div
        key={idx}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
      >
          <Link href={item.href} className="group block">
            <div className="relative aspect-video rounded-lg overflow-hidden bg-surface-raised">
              {item.image ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img src={item.image} alt={item.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <Image src="/logo-mark.png" alt="" width={56} height={56} className="w-14 h-14 object-contain opacity-15" />
                </div>
              )}
              <span className={`absolute top-3 left-3 rounded-sm px-2 py-0.5 font-display text-xs font-bold uppercase tracking-widest ${isVideo ? "bg-[#f6b327] text-[#0D0E18]" : "bg-accent text-bg"}`}>
                {isVideo ? "▶ Video" : item.label}
              </span>
            </div>
            <h2 className="mt-4 font-display text-xl sm:text-2xl font-bold text-text-primary leading-snug group-hover:text-accent-text transition-colors duration-200 line-clamp-2">
              {item.title}
            </h2>
            {item.blurb && (
              <p className="mt-2 text-sm text-text-secondary leading-relaxed line-clamp-2">{item.blurb}</p>
            )}
            <span className="mt-4 inline-flex items-center gap-2 rounded-md bg-accent px-5 py-2.5 font-sans font-semibold text-sm text-bg group-hover:bg-accent-hover transition-colors duration-200">
              {item.cta}
              <svg className="transition-transform duration-200 group-hover:translate-x-1" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </span>
          </Link>
        </motion.div>

      {reel.length > 1 && (
        <div className="mt-5 flex items-center gap-3">
          <div className="flex items-center gap-1.5 flex-1">
            {reel.map((_, i) => (
              <button
                key={i}
                aria-label={`Show feature ${i + 1}`}
                onClick={() => setIdx(i)}
                className={`h-1.5 rounded-full transition-all duration-300 ${i === idx ? "w-6 bg-accent" : "w-1.5 bg-border hover:bg-text-muted"}`}
              />
            ))}
          </div>
          <div className="flex items-center gap-1.5">
            <button
              onClick={prev}
              aria-label="Previous feature"
              className="flex h-8 w-8 items-center justify-center rounded-md border border-border text-text-secondary hover:border-accent hover:text-accent-text transition-colors duration-200"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>
            <button
              onClick={next}
              aria-label="Next feature"
              className="flex h-8 w-8 items-center justify-center rounded-md border border-border text-text-secondary hover:border-accent hover:text-accent-text transition-colors duration-200"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 18l6-6-6-6" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function HeroSection({ items }: Props) {
  const router = useRouter();
  const reducedMotion = useReducedMotion();
  const [sel, setSel] = useState(0);
  const selRef = useRef(0);
  const sectionRef = useRef<HTMLElement>(null);
  // Tracked as a ref (not state) so intersection updates don't cause
  // re-renders on the performance-sensitive keydown path.
  const inViewRef = useRef(true);
  // Separate state copy for the reel's autoplay-pause, which genuinely needs
  // a re-render to stop/restart its effect.
  const [heroInView, setHeroInView] = useState(true);
  useEffect(() => { selRef.current = sel; }, [sel]);

  // Only steal arrow-key scrolling while the hero menu is actually on screen
  // — otherwise a visitor who has scrolled past it can never scroll with the
  // keyboard again.
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        inViewRef.current = entry.isIntersecting;
        setHeroInView(entry.isIntersecting);
      },
      { threshold: 0.4 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Arrow-key + Enter navigation, like a game menu. Ignored while typing,
  // once the hero has scrolled out of view, or when focus is already on an
  // interactive element (so Enter doesn't both activate that element AND
  // navigate to the menu selection).
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!inViewRef.current) return;
      const active = document.activeElement as HTMLElement | null;
      const tag = active?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;
      if (e.key === "ArrowDown") { e.preventDefault(); setSel((s) => (s + 1) % MENU.length); }
      else if (e.key === "ArrowUp") { e.preventDefault(); setSel((s) => (s - 1 + MENU.length) % MENU.length); }
      else if (e.key === "Enter") {
        if (active && active !== document.body) return;
        router.push(MENU[selRef.current].href);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [router]);

  return (
    <section ref={sectionRef} className="relative min-h-[calc(100vh-5rem)] pt-20 flex items-center overflow-hidden">
      {/* Faint grid texture + soft brand glows over the ambient body bg */}
      <div className="absolute inset-0 opacity-[0.04] pointer-events-none" style={{
        backgroundImage: "linear-gradient(var(--color-accent) 1px, transparent 1px), linear-gradient(90deg, var(--color-accent) 1px, transparent 1px)",
        backgroundSize: "56px 56px",
      }} />
      <div className="absolute -top-24 right-0 h-[520px] w-[520px] rounded-full bg-accent opacity-[0.10] blur-[130px] pointer-events-none" />
      <div className="absolute bottom-0 -left-24 h-[420px] w-[420px] rounded-full bg-[#f6b327] opacity-[0.07] blur-[130px] pointer-events-none" />

      <div className="relative w-full max-w-7xl mx-auto px-6 py-8 lg:py-14 grid lg:grid-cols-[1.1fr_0.9fr] gap-8 lg:gap-16 items-center">

        {/* ── Left: brand + menu ─────────────────────────────── */}
        <motion.div variants={stagger} initial="hidden" animate="show">
          {/* HUD label */}
          <motion.div variants={fadeUp} className="flex items-center gap-2.5 mb-5 sm:mb-6">
            <span className="flex h-6 w-6 items-center justify-center rounded bg-accent font-display text-sm font-extrabold text-bg">M</span>
            <span className="font-display text-xs font-bold uppercase tracking-[0.2em] text-text-muted">Main Menu</span>
            <span className="flex items-center gap-1.5 ml-1 font-display text-xs font-bold uppercase tracking-[0.16em] text-[#f6b327]">
              <motion.span
                animate={reducedMotion ? undefined : { opacity: [1, 1, 0.25] }}
                transition={reducedMotion ? undefined : { duration: 1.6, repeat: Infinity, times: [0, 0.6, 1] }}
              >
                ●
              </motion.span>
              Online
            </span>
          </motion.div>

          {/* Wordmark */}
          <motion.h1 variants={fadeUp} className="font-display font-extrabold uppercase tracking-tight text-text-primary leading-[0.88] text-5xl sm:text-7xl lg:text-8xl">
            Minus<br />Marco
          </motion.h1>
          <motion.div variants={fadeUp} className="mt-4 sm:mt-5 h-1 w-16 rounded-full bg-[#f6b327]" />
          <motion.p variants={fadeUp} className="mt-3 sm:mt-4 text-text-secondary text-base sm:text-lg max-w-md leading-relaxed">
            The expansion pack to your game: Game journalism, culture, and community from Fresno.
          </motion.p>

          {/* Menu */}
          <nav className="mt-6 sm:mt-8 flex flex-col gap-1 max-w-md">
            {MENU.map((item, i) => {
              const isSel = sel === i;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onMouseEnter={() => setSel(i)}
                  onFocus={() => setSel(i)}
                  className="relative flex items-center gap-3 rounded-lg px-4 py-2 sm:py-3 outline-none"
                >
                  {isSel && (
                    <motion.div
                      layoutId="menu-highlight"
                      className="absolute inset-0 rounded-lg bg-accent/10 border-l-[3px] border-[#f6b327]"
                      transition={{ type: "spring", stiffness: 420, damping: 34 }}
                    />
                  )}
                  <span className={`relative z-10 font-display text-lg ${isSel ? "text-[#f6b327]" : "text-text-muted"}`}>▸</span>
                  <span className="relative z-10 flex-1">
                    <span className={`block font-display text-2xl sm:text-3xl font-extrabold uppercase tracking-wide leading-none transition-colors duration-200 ${isSel ? "text-text-primary" : "text-text-secondary"}`}>
                      {item.label}
                    </span>
                    <span className="block mt-1 font-sans text-xs text-text-muted">{item.sub}</span>
                  </span>
                  <span className="relative z-10 font-display text-xs font-bold text-text-muted tabular-nums">0{i + 1}</span>
                </Link>
              );
            })}
          </nav>

          {/* Hint bar — keyboard-only affordance, meaningless on touch */}
          <div className="mt-5 sm:mt-6 hidden items-center gap-3 font-display text-[11px] font-bold uppercase tracking-[0.15em] text-text-muted sm:flex">
            <span><span className="text-text-secondary">↑ ↓</span> Navigate</span>
            <span className="text-border">|</span>
            <span><span className="text-text-secondary">⏎</span> Select</span>
            <span className="text-border">|</span>
            <span>or click</span>
          </div>
        </motion.div>

        {/* ── Right: cycling "Continue" feature reel ──────────── */}
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35, duration: 0.5 }}>
          <FeatureReel items={items} inView={heroInView} />
        </motion.div>
      </div>
    </section>
  );
}
