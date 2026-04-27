"use client";

import { motion } from "framer-motion";

type Props = {
  data: {
    _id: string;
    text: string;
    attribution?: string;
    source?: string;
  } | null;
};

export default function QuoteOfWeek({ data }: Props) {
  if (!data) return null;

  return (
    <motion.section
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7 }}
      className="relative border-y border-border bg-surface overflow-hidden"
    >
      {/* Background glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#f6b327]/5 via-transparent to-transparent pointer-events-none" />
      <div className="absolute -top-24 -left-24 h-64 w-64 rounded-full bg-[#f6b327] opacity-[0.04] blur-[80px] pointer-events-none" />

      <div className="relative max-w-5xl mx-auto px-6 py-20 text-center">
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="h-px w-8 bg-[#f6b327]" />
          <span className="font-display text-xs font-bold uppercase tracking-widest text-[#f6b327]">Quote of the Week</span>
          <div className="h-px w-8 bg-[#f6b327]" />
        </div>

        <blockquote>
          <span className="font-display text-6xl sm:text-7xl font-bold text-[#f6b327] leading-none select-none">&ldquo;</span>
          <p className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold text-text-primary leading-tight -mt-4">
            {data.text}
          </p>
          <span className="font-display text-6xl sm:text-7xl font-bold text-[#f6b327] leading-none select-none">&rdquo;</span>
        </blockquote>

        {(data.attribution || data.source) && (
          <footer className="mt-6 flex items-center justify-center gap-2 text-sm text-text-muted font-sans">
            {data.attribution && <span className="font-semibold text-text-secondary">{data.attribution}</span>}
            {data.attribution && data.source && <span>·</span>}
            {data.source && <span>{data.source}</span>}
          </footer>
        )}
      </div>
    </motion.section>
  );
}
