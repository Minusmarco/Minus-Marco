"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { urlFor } from "@/sanity/lib/image";

type Shoutout = {
  _id: string;
  name: string;
  handle?: string;
  platform?: string;
  note: string;
  avatar?: { asset: object; alt?: string };
};

export default function ShoutoutWall({ shoutouts }: { shoutouts: Shoutout[] }) {
  if (shoutouts.length === 0) return null;

  return (
    <section className="border-t border-border">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-2 mb-10"
        >
          <div className="h-px w-6 bg-accent" />
          <span className="font-display text-xs font-bold uppercase tracking-widest text-accent">Community Shoutouts</span>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {shoutouts.map((s, i) => {
            const avatarUrl = s.avatar ? urlFor(s.avatar).width(80).height(80).url() : null;
            return (
              <motion.div
                key={s._id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.07 }}
                className="flex gap-4 rounded-xl border border-border bg-surface p-5 hover:border-accent/40 transition-colors duration-200"
              >
                <div className="flex-shrink-0">
                  {avatarUrl ? (
                    <Image
                      src={avatarUrl}
                      alt={s.name}
                      width={40}
                      height={40}
                      className="rounded-full w-10 h-10 object-cover"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center">
                      <span className="font-display font-bold text-accent text-sm">
                        {s.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                </div>
                <div className="flex flex-col gap-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-display font-bold text-text-primary text-sm">{s.name}</span>
                    {s.handle && (
                      <span className="text-xs text-text-muted font-sans">{s.handle}</span>
                    )}
                    {s.platform && (
                      <span className="rounded-sm bg-surface-raised border border-border px-1.5 py-0.5 text-xs text-text-muted font-sans">
                        {s.platform}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-text-secondary leading-relaxed">{s.note}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
