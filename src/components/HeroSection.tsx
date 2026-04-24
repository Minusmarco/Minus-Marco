"use client";

import Link from "next/link";
import { motion } from "framer-motion";

const FEATURED = {
  category: "Review",
  title: "The Future of Open-World Gaming Is Here",
  excerpt:
    "A deep dive into how the latest generation of titles is redefining what it means to explore a living, breathing world.",
  href: "/articles/featured",
  image: null, // swap with an image path when ready
};

const SECONDARY = [
  {
    category: "News",
    title: "What the Xbox Developer Direct Means for the Rest of 2025",
    href: "/articles/xbox-dev-direct",
  },
  {
    category: "Opinion",
    title: "Why Single-Player Games Are Making a Comeback",
    href: "/articles/single-player-comeback",
  },
  {
    category: "Video",
    title: "We Played 4 Hours of the Most Anticipated RPG of the Year",
    href: "/videos/rpg-preview",
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show:   { opacity: 1, y: 0 },
};

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.2 } },
};

export default function HeroSection() {
  return (
    <section className="relative flex flex-col min-h-screen pt-20">
      {/* Main featured story */}
      <div className="relative flex-1 flex items-end min-h-[70vh] overflow-hidden bg-surface">
        {/* Background gradient placeholder until real image is supplied */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#0D1117] via-[#0E1520] to-bg" />

        {/* Accent glow */}
        <div className="absolute -top-32 -right-32 h-[500px] w-[500px] rounded-full bg-accent opacity-[0.06] blur-[120px] pointer-events-none" />

        {/* Grid overlay for texture */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(var(--color-text-primary) 1px, transparent 1px), linear-gradient(90deg, var(--color-text-primary) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />

        {/* Content */}
        <motion.div
          variants={stagger}
          initial="hidden"
          animate="show"
          className="relative z-10 w-full max-w-7xl mx-auto px-6 pb-12"
        >
          <motion.span
            variants={fadeUp}
            className="inline-block mb-4 rounded-sm bg-accent px-3 py-1 font-display text-xs font-bold uppercase tracking-widest text-bg"
          >
            {FEATURED.category}
          </motion.span>

          <motion.h1
            variants={fadeUp}
            className="font-display text-5xl sm:text-6xl lg:text-7xl font-bold leading-[1.05] tracking-tight text-text-primary max-w-3xl"
          >
            {FEATURED.title}
          </motion.h1>

          <motion.p
            variants={fadeUp}
            className="mt-5 text-base sm:text-lg text-text-secondary max-w-xl leading-relaxed"
          >
            {FEATURED.excerpt}
          </motion.p>

          <motion.div variants={fadeUp} className="mt-8 flex items-center gap-4">
            <Link
              href={FEATURED.href}
              className="inline-flex items-center gap-2 rounded-md bg-accent px-6 py-3 font-sans font-semibold text-bg hover:bg-accent-hover transition-colors duration-200"
            >
              Read More
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
            <span className="text-text-muted text-sm font-sans">by Minus Marco</span>
          </motion.div>
        </motion.div>
      </div>

      {/* Secondary featured cards */}
      <div className="bg-surface border-t border-border">
        <div className="max-w-7xl mx-auto px-6 py-0">
          <motion.div
            variants={stagger}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-border"
          >
            {SECONDARY.map((item) => (
              <motion.div key={item.href} variants={fadeUp}>
                <Link
                  href={item.href}
                  className="group flex flex-col gap-2 px-6 py-6 hover:bg-surface-raised transition-colors duration-200"
                >
                  <span className="font-display text-xs font-bold uppercase tracking-widest text-accent">
                    {item.category}
                  </span>
                  <h3 className="font-sans text-sm font-semibold text-text-primary leading-snug group-hover:text-accent transition-colors duration-200">
                    {item.title}
                  </h3>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
