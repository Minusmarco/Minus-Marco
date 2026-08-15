"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { urlFor } from "@/sanity/lib/image";
import type { IconType } from "react-icons";
import {
  FaInstagram, FaYoutube, FaXTwitter, FaTiktok, FaDiscord, FaTwitch,
  FaLinkedin, FaFacebook, FaThreads, FaGithub, FaGlobe,
} from "react-icons/fa6";
import { SiSubstack } from "react-icons/si";

type Social = { _key: string; platform: string; url: string };

// Map a free-text platform name to a brand icon. Unknown platforms fall back
// to a generic globe so a link always renders.
function iconFor(platform: string): IconType {
  const p = platform.toLowerCase().replace(/[^a-z]/g, "");
  if (p.includes("threads")) return FaThreads; // before "instagram" — avoids "threadsbyinstagram" mismatch
  if (p.includes("instagram") || p === "ig") return FaInstagram;
  if (p.includes("youtube") || p === "yt") return FaYoutube;
  if (p === "x" || p.includes("twitter")) return FaXTwitter;
  if (p.includes("tiktok")) return FaTiktok;
  if (p.includes("discord")) return FaDiscord;
  if (p.includes("twitch")) return FaTwitch;
  if (p.includes("linkedin")) return FaLinkedin;
  if (p.includes("facebook") || p === "fb") return FaFacebook;
  if (p.includes("github")) return FaGithub;
  if (p.includes("substack")) return SiSubstack;
  return FaGlobe;
}

type Shoutout = {
  _id: string;
  name: string;
  handle?: string;
  note: string;
  avatar?: { asset: object; alt?: string };
  badge?: { asset: object; alt?: string };
  socials?: Social[];
  platform?: string; // legacy single platform — fallback only
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
            const avatarUrl = s.avatar ? urlFor(s.avatar).width(160).height(160).url() : null;
            const badgeUrl = s.badge ? urlFor(s.badge).width(48).height(48).url() : null;
            // Only render web links — guard against any non-http scheme
            // (e.g. javascript:) sneaking in from the CMS.
            const socials = (s.socials ?? []).filter(
              (soc) => /^https?:\/\//i.test(soc.url) && soc.platform.trim().length > 0,
            );
            return (
              <motion.div
                key={s._id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.07 }}
                className="flex gap-4 rounded-xl border border-border bg-surface p-5 hover:border-accent/40 transition-colors duration-200"
              >
                {/* Avatar — stretches to match the height of the text beside it */}
                <div className="flex-shrink-0 self-stretch">
                  <div className="relative h-full aspect-square min-h-[3.25rem] rounded-lg overflow-hidden bg-accent/15">
                    {avatarUrl ? (
                      <Image src={avatarUrl} alt={s.avatar?.alt ?? s.name} fill className="object-cover" />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="font-display font-bold text-accent text-lg">
                          {s.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex flex-col gap-1.5 min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-display font-bold text-text-primary text-sm">{s.name}</span>
                    {badgeUrl && (
                      <Image
                        src={badgeUrl}
                        alt={s.badge?.alt ?? ""}
                        width={18}
                        height={18}
                        className="h-[18px] w-[18px] object-contain flex-shrink-0"
                      />
                    )}
                    {s.handle && (
                      <span className="text-xs text-text-muted font-sans">{s.handle}</span>
                    )}
                  </div>

                  <p className="text-sm text-text-secondary leading-relaxed">{s.note}</p>

                  {socials.length > 0 ? (
                    <div className="flex flex-wrap gap-2 mt-1">
                      {socials.map((soc) => {
                        const Icon = iconFor(soc.platform);
                        return (
                          <a
                            key={soc._key}
                            href={soc.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={`${soc.platform.trim()} (opens in new tab)`}
                            title={soc.platform.trim()}
                            className="flex h-8 w-8 items-center justify-center rounded-full border border-border text-text-muted hover:border-accent hover:text-accent hover:bg-accent/5 transition-colors duration-200"
                          >
                            <Icon className="h-4 w-4" aria-hidden="true" />
                          </a>
                        );
                      })}
                    </div>
                  ) : s.platform ? (
                    <span className="self-start rounded-sm bg-surface-raised border border-border px-1.5 py-0.5 text-xs text-text-muted font-sans mt-0.5">
                      {s.platform}
                    </span>
                  ) : null}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
