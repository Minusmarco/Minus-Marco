"use client";

import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";
import { motion } from "framer-motion";

type Props = {
  data: {
    _id: string;
    game: string;
    platform?: string;
    progress?: string;
    rating?: number;
    coverImage?: { asset: object; alt?: string };
    hotTake?: string;
  } | null;
};

export default function CurrentlyPlaying({ data }: Props) {
  if (!data) {
    return (
      <div className="rounded-xl border border-border bg-surface p-8 flex items-center justify-center min-h-[200px]">
        <p className="text-text-muted font-sans text-sm">Marco will share what he&apos;s playing soon.</p>
      </div>
    );
  }

  const imageUrl = data.coverImage ? urlFor(data.coverImage).width(400).height(560).url() : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="relative rounded-xl border border-border bg-surface overflow-hidden"
    >
      <div className="flex flex-col sm:flex-row gap-0">
        {/* Cover art */}
        <div className="relative w-full sm:w-48 aspect-[3/4] sm:aspect-auto flex-shrink-0 bg-surface-raised">
          {imageUrl ? (
            <Image src={imageUrl} alt={data.game} fill className="object-cover" />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-surface-raised to-bg flex items-center justify-center">
              <span className="font-display text-5xl font-bold text-text-muted opacity-10">MM</span>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent to-surface sm:block hidden" />
        </div>

        {/* Info */}
        <div className="flex flex-col justify-between p-6 sm:p-8 flex-1">
          <div>
            {/* Now playing indicator */}
            <div className="flex items-center gap-2 mb-4">
              <motion.span
                animate={{ opacity: [1, 0.3, 1] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                className="block h-2 w-2 rounded-full bg-[#f6b327]"
              />
              <span className="font-display text-xs font-bold uppercase tracking-widest text-[#f6b327]">Now Playing</span>
            </div>

            <h3 className="font-display text-3xl sm:text-4xl font-bold text-text-primary leading-tight mb-2">
              {data.game}
            </h3>

            <div className="flex flex-wrap items-center gap-3 mb-5">
              {data.platform && (
                <span className="rounded-md border border-border px-3 py-1 font-sans text-xs font-medium text-text-secondary">
                  {data.platform}
                </span>
              )}
              {data.progress && (
                <span className="rounded-md border border-border px-3 py-1 font-sans text-xs font-medium text-text-secondary">
                  {data.progress}
                </span>
              )}
              {data.rating && (
                <span className="rounded-md border border-[#f6b327]/40 bg-[#f6b327]/10 px-3 py-1 font-sans text-xs font-bold text-[#f6b327]">
                  {data.rating}/10
                </span>
              )}
            </div>

            {data.hotTake && (
              <blockquote className="border-l-2 border-accent pl-4 text-text-secondary leading-relaxed italic">
                &ldquo;{data.hotTake}&rdquo;
              </blockquote>
            )}
          </div>

          <p className="mt-6 text-xs text-text-muted font-sans">— Marco Hernandez</p>
        </div>
      </div>
    </motion.div>
  );
}
