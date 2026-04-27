"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { urlFor } from "@/sanity/lib/image";

type Article = {
  _id: string;
  title: string;
  slug: { current: string };
  category: string;
  excerpt?: string;
  coverImage?: { asset: object; alt?: string };
  publishedAt?: string;
};

type Props = {
  featured: Article | null;
  recentArticles: Article[];
};

const FALLBACK_FEATURED = {
  category: "Coming Soon",
  title: "Articles Are on the Way",
  excerpt: "Marco is hard at work. Check back soon for reviews, news, opinions, and more from Minus Marco.",
  href: "/articles",
};

const FALLBACK_RECENT = [
  { category: "Coming Soon", title: "First article dropping soon", href: "/articles" },
  { category: "Coming Soon", title: "Stay tuned for more",         href: "/articles" },
  { category: "Coming Soon", title: "The work is in progress",     href: "/articles" },
];

const fadeUp = { hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0 } };
const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.12, delayChildren: 0.2 } } };

export default function HeroSection({ featured, recentArticles }: Props) {
  const hasReal = !!featured;

  const hero = featured
    ? { category: featured.category, title: featured.title, excerpt: featured.excerpt ?? "", href: `/articles/${featured.slug.current}` }
    : FALLBACK_FEATURED;

  const secondary = recentArticles.length > 0
    ? recentArticles.map((a) => ({ category: a.category, title: a.title, href: `/articles/${a.slug.current}` }))
    : FALLBACK_RECENT;

  return (
    <section className="relative flex flex-col min-h-screen pt-20">

      {/* Main featured story */}
      <div className="relative flex-1 flex items-end min-h-[75vh] overflow-hidden bg-surface">

        {/* Cover image (if article has one) */}
        {featured?.coverImage && (
          <div className="absolute inset-0">
            <Image
              src={urlFor(featured.coverImage).width(1600).url()}
              alt={(featured.coverImage as { alt?: string }).alt ?? featured.title}
              fill
              className="object-cover opacity-30"
              priority
            />
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-br from-[#0D1117] via-[#0E1520] to-bg" />

        {/* Accent glows */}
        <div className="absolute -top-32 -right-32 h-[600px] w-[600px] rounded-full bg-accent opacity-[0.06] blur-[130px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 h-[300px] w-[400px] rounded-full bg-accent opacity-[0.03] blur-[100px] pointer-events-none" />

        {/* Grid texture */}
        <div className="absolute inset-0 opacity-[0.025]" style={{
          backgroundImage: "linear-gradient(var(--color-text-primary) 1px, transparent 1px), linear-gradient(90deg, var(--color-text-primary) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }} />

        {/* Logo watermark */}
        <div className="absolute top-8 right-8 opacity-[0.04] pointer-events-none select-none hidden lg:block">
          <Image src="/logo-full.png" alt="" width={320} height={120} className="w-80 h-auto object-contain" />
        </div>

        <motion.div
          variants={stagger}
          initial="hidden"
          animate="show"
          className="relative z-10 w-full max-w-7xl mx-auto px-6 pb-14"
        >
          <motion.span variants={fadeUp} className="inline-block mb-5 rounded-sm bg-[#f6b327] px-3 py-1 font-display text-xs font-bold uppercase tracking-widest text-bg">
            {hero.category}
          </motion.span>

          <motion.h1 variants={fadeUp} className="font-display text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-bold leading-[1.02] tracking-tight text-text-primary max-w-4xl">
            {hero.title}
          </motion.h1>

          {hero.excerpt && (
            <motion.p variants={fadeUp} className="mt-5 text-base sm:text-lg text-text-secondary max-w-xl leading-relaxed">
              {hero.excerpt}
            </motion.p>
          )}

          <motion.div variants={fadeUp} className="mt-8 flex items-center gap-4 flex-wrap">
            <Link href={hero.href} className="inline-flex items-center gap-2 rounded-md bg-accent px-6 py-3 font-sans font-semibold text-bg hover:bg-accent-hover transition-colors duration-200 group">
              {hasReal ? "Read Article" : "Read More"}
              <svg className="transition-transform duration-200 group-hover:translate-x-1" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
            <span className="text-text-muted text-sm font-sans">by Minus Marco</span>
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.6 }}
          className="absolute bottom-6 right-6 flex flex-col items-center gap-2"
        >
          <span className="font-display text-xs uppercase tracking-widest text-text-muted">Scroll</span>
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-text-muted">
              <path d="M12 5v14M5 12l7 7 7-7" />
            </svg>
          </motion.div>
        </motion.div>
      </div>

      {/* Secondary featured cards */}
      <div className="bg-surface border-t border-border">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            variants={stagger}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-border"
          >
            {secondary.map((item, i) => (
              <motion.div key={i} variants={fadeUp}>
                <Link href={item.href} className="group flex flex-col gap-2 px-6 py-6 hover:bg-surface-raised transition-colors duration-200">
                  <span className="font-display text-xs font-bold uppercase tracking-widest text-accent">
                    {item.category}
                  </span>
                  <h3 className="font-sans text-sm font-semibold text-text-primary leading-snug group-hover:text-accent transition-colors duration-200 line-clamp-2">
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
