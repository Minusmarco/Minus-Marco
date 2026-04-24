"use client";

import { motion, useInView } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";

const PLATFORMS = [
  { label: "Substack",  desc: "Essays, reviews & opinion",     href: "https://substack.com/@minusmarco",   icon: "✦" },
  { label: "YouTube",   desc: "Video deep-dives & previews",   href: "https://youtube.com/@minusmarco",    icon: "▶" },
  { label: "Instagram", desc: "Event coverage & behind scenes",href: "https://instagram.com/minusmarco",   icon: "◈" },
  { label: "X",         desc: "Hot takes & breaking news",     href: "https://x.com/minusmarco",           icon: "✕" },
  { label: "TikTok",    desc: "Short-form gaming content",     href: "https://tiktok.com/@minusmarco",     icon: "◎" },
  { label: "LinkedIn",  desc: "Professional work & portfolio", href: "https://linkedin.com/in/minusmarco", icon: "▣" },
];

const FAVORITES = [
  { title: "Marvel's Spider-Man Remastered", image: "https://cdn.akamai.steamstatic.com/steam/apps/1817070/library_600x900.jpg", position: "center" },
  { title: "Destiny 2",                      image: "https://cdn.akamai.steamstatic.com/steam/apps/1085660/library_600x900.jpg", position: "center" },
  { title: "Metal Gear Solid V",             image: "https://cdn.akamai.steamstatic.com/steam/apps/287700/library_600x900.jpg",  position: "center" },
  { title: "Prey",                           image: "https://cdn.akamai.steamstatic.com/steam/apps/480490/library_600x900.jpg",  position: "center" },
  { title: "ABZU",                           image: "https://cdn.akamai.steamstatic.com/steam/apps/384190/library_600x900.jpg",  position: "center" },
  { title: "Ultimate Marvel vs. Capcom 3",   image: "https://cdn.akamai.steamstatic.com/steam/apps/225140/header.jpg",           position: "top"    },
];

function FadeUp({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 32 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, ease: "easeOut", delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export default function AboutContent() {
  return (
    <div className="min-h-screen pt-20">

      {/* ── HERO ─────────────────────────────────────────────── */}
      <section className="relative overflow-hidden border-b border-border">
        {/* Background glow */}
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 h-[600px] w-[800px] rounded-full bg-accent opacity-[0.05] blur-[140px] pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-6 pt-20 pb-24 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 mb-6"
            >
              <div className="h-px w-8 bg-accent" />
              <span className="font-display text-xs font-bold uppercase tracking-widest text-accent">About</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="font-display text-6xl sm:text-7xl lg:text-8xl font-bold text-text-primary leading-[0.95] tracking-tight"
            >
              <span className="text-accent">MARCO</span><br />
              HERNANDEZ
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mt-6 text-text-secondary text-lg leading-relaxed max-w-lg"
            >
              Video game journalist, community advocate, and the founder of Minus Marco,
              a platform built to amplify underrepresented voices in gaming.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.35 }}
              className="mt-8 flex flex-wrap gap-3"
            >
              <Link
                href="/articles"
                className="inline-flex items-center gap-2 rounded-md bg-accent px-5 py-2.5 font-sans font-semibold text-sm text-bg hover:bg-accent-hover transition-colors duration-200"
              >
                Read the Work
              </Link>
              <a
                href="mailto:marco.hernandez5692@gmail.com"
                className="inline-flex items-center gap-2 rounded-md border border-border px-5 py-2.5 font-sans font-medium text-sm text-text-secondary hover:border-accent hover:text-accent transition-colors duration-200"
              >
                Get in Touch
              </a>
            </motion.div>
          </div>

          {/* Photo placeholder */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="relative hidden lg:flex items-center justify-center"
          >
            <div className="relative w-full max-w-sm aspect-[3/4] rounded-xl overflow-hidden bg-surface border border-border">
              <div className="absolute inset-0 bg-gradient-to-br from-surface-raised via-[#0E1520] to-bg flex items-center justify-center">
                <span className="font-display text-8xl font-bold text-text-muted opacity-10">MM</span>
              </div>
              {/* Swap in Marco's headshot: <Image src="/marco.jpg" fill className="object-cover" alt="Marco Hernandez" /> */}
              <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-bg to-transparent">
                <p className="font-display text-sm font-bold uppercase tracking-widest text-accent">
                  Fresno, CA
                </p>
              </div>
            </div>
            {/* Floating accent tag */}
            <div className="absolute -bottom-4 -right-4 rounded-lg bg-accent px-4 py-2 shadow-xl">
              <p className="font-display text-xs font-bold uppercase tracking-widest text-bg">Est. 2026</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── TAGLINE ──────────────────────────────────────────── */}
      <section className="border-b border-border bg-surface">
        <FadeUp className="max-w-7xl mx-auto px-6 py-16">
          <blockquote className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-text-primary leading-tight max-w-4xl">
            <span className="text-accent">"</span>
            The expansion pack to your game.
            <span className="text-accent">"</span>
          </blockquote>
          <p className="mt-6 text-text-secondary max-w-2xl leading-relaxed">
            Just like downloadable content enhances a game you already love, Minus Marco is
            supplementary, built to deepen the stories already being told, not to compete
            with them. The journalism stays in front. The story comes first.
          </p>
        </FadeUp>
      </section>

      {/* ── STORY ────────────────────────────────────────────── */}
      <section className="border-b border-border">
        <div className="max-w-7xl mx-auto px-6 py-20 grid grid-cols-1 lg:grid-cols-12 gap-12">
          <FadeUp className="lg:col-span-3">
            <div className="flex items-center gap-2 mb-4">
              <div className="h-px w-6 bg-accent" />
              <span className="font-display text-xs font-bold uppercase tracking-widest text-accent">The Story</span>
            </div>
          </FadeUp>

          <div className="lg:col-span-9 grid grid-cols-1 md:grid-cols-2 gap-10">
            <FadeUp delay={0.1}>
              <h2 className="font-display text-2xl font-bold text-text-primary mb-4">
                Where it started
              </h2>
              <p className="text-text-secondary leading-relaxed">
                Marco grew up in Central California's agricultural heartland, in a Mexican-immigrant
                household where video games were more than entertainment. They were a portal. It
                started with Marvel vs. Capcom on PlayStation and never really stopped.
              </p>
            </FadeUp>

            <FadeUp delay={0.15}>
              <h2 className="font-display text-2xl font-bold text-text-primary mb-4">
                The education
              </h2>
              <p className="text-text-secondary leading-relaxed">
                Marco studied journalism at Fresno City College before earning a BA in Media,
                Communications & Journalism from Fresno State, specializing in advertising and
                PR. He's applied that craft everywhere from The Collegian and The Rampage to the
                City of Fresno's marketing office.
              </p>
            </FadeUp>

            <FadeUp delay={0.2}>
              <h2 className="font-display text-2xl font-bold text-text-primary mb-4">
                The mission
              </h2>
              <p className="text-text-secondary leading-relaxed">
                Minus Marco exists to inform, represent, and build a future for youth, minority,
                and smaller communities in and around the gaming industry. Gaming culture shaped
                Marco. Now he's trying to make sure it reflects the people who love it most.
              </p>
            </FadeUp>

            <FadeUp delay={0.25}>
              <h2 className="font-display text-2xl font-bold text-text-primary mb-4">
                The work
              </h2>
              <p className="text-text-secondary leading-relaxed">
                Reviews, essays, opinion pieces, and video content spanning Substack, YouTube,
                and social media. Every piece is written with the same goal: bridge the gap
                between the gaming industry and the communities that have been overlooked by it.
              </p>
            </FadeUp>
          </div>
        </div>
      </section>

      {/* ── MISSION STATEMENT ────────────────────────────────── */}
      <section className="border-b border-border bg-surface relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: "linear-gradient(var(--color-text-primary) 1px, transparent 1px), linear-gradient(90deg, var(--color-text-primary) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
        <FadeUp className="relative max-w-7xl mx-auto px-6 py-20 text-center">
          <p className="font-display text-xs font-bold uppercase tracking-widest text-accent mb-6">Mission</p>
          <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-text-primary max-w-4xl mx-auto leading-tight">
            Amplify the voices gaming forgot to invite.
          </h2>
          <p className="mt-8 text-text-secondary text-lg max-w-2xl mx-auto leading-relaxed">
            Agriculture. Immigration. Minority communities. These are the backgrounds that built
            the people who play games. They deserve to see themselves in the press that covers it.
          </p>
        </FadeUp>
      </section>

      {/* ── PLATFORMS ────────────────────────────────────────── */}
      <section className="border-b border-border">
        <div className="max-w-7xl mx-auto px-6 py-20">
          <FadeUp>
            <div className="flex items-center gap-2 mb-10">
              <div className="h-px w-6 bg-accent" />
              <span className="font-display text-xs font-bold uppercase tracking-widest text-accent">Find the Work</span>
            </div>
          </FadeUp>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {PLATFORMS.map((p, i) => (
              <FadeUp key={p.label} delay={i * 0.07}>
                <a
                  href={p.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-start gap-4 rounded-lg border border-border bg-surface p-5 hover:border-accent/50 hover:bg-surface-raised transition-all duration-200"
                >
                  <span className="mt-0.5 font-display text-xl text-accent group-hover:scale-110 transition-transform duration-200 select-none">
                    {p.icon}
                  </span>
                  <div>
                    <p className="font-display font-bold text-text-primary group-hover:text-accent transition-colors duration-200">
                      {p.label}
                    </p>
                    <p className="text-sm text-text-secondary mt-0.5">{p.desc}</p>
                  </div>
                  <svg className="ml-auto mt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-accent flex-shrink-0" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M7 17L17 7M17 7H7M17 7v10" />
                  </svg>
                </a>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAVORITES ────────────────────────────────────────── */}
      <section className="border-b border-border bg-surface">
        <div className="max-w-7xl mx-auto px-6 py-20">
          <FadeUp>
            <div className="flex items-center gap-2 mb-10">
              <div className="h-px w-6 bg-accent" />
              <span className="font-display text-xs font-bold uppercase tracking-widest text-accent">In the Rotation</span>
            </div>
          </FadeUp>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {FAVORITES.map((game, i) => (
              <FadeUp key={game.title} delay={i * 0.07}>
                <div className="group relative rounded-lg overflow-hidden border border-border bg-bg aspect-[2/3] cursor-default hover:border-accent/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/50">
                  <Image
                    src={game.image}
                    alt={game.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    style={{ objectPosition: game.position }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-bg via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                    <p className="font-display text-xs font-bold text-text-primary leading-tight">
                      {game.title}
                    </p>
                  </div>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ── CONTACT CTA ──────────────────────────────────────── */}
      <section>
        <FadeUp className="max-w-7xl mx-auto px-6 py-24 text-center">
          <h2 className="font-display text-5xl sm:text-6xl font-bold text-text-primary">
            Let's talk games.
          </h2>
          <p className="mt-4 text-text-secondary text-lg max-w-md mx-auto">
            Pitches, collabs, press access, or just want to say hello. Marco's inbox is open.
          </p>
          <a
            href="mailto:marco.hernandez5692@gmail.com"
            className="mt-8 inline-flex items-center gap-2 rounded-md bg-accent px-8 py-3 font-sans font-semibold text-bg hover:bg-accent-hover transition-colors duration-200"
          >
            marco.hernandez5692@gmail.com
          </a>
        </FadeUp>
      </section>

    </div>
  );
}
