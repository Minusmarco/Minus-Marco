import { sanityFetch } from "@/sanity/lib/client";
import {
  currentlyPlayingQuery,
  activePollQuery,
  activeDebateQuery,
  activeQuoteQuery,
  allShoutoutsQuery,
} from "@/sanity/lib/queries";
import CurrentlyPlaying from "@/components/community/CurrentlyPlaying";
import CommunityPoll from "@/components/community/CommunityPoll";
import DebateOfWeek from "@/components/community/DebateOfWeek";
import QuoteOfWeek from "@/components/community/QuoteOfWeek";
import ShoutoutWall from "@/components/community/ShoutoutWall";
import Link from "next/link";
import Image from "next/image";
export const metadata = { title: "Community" };
export const revalidate = 60;

const PLATFORMS = [
  { label: "Substack",   desc: "Essays & long reads",         href: "https://substack.com/@minusmarco",    color: "#FF6719" },
  { label: "YouTube",    desc: "Video deep-dives",            href: "https://youtube.com/@minusmarco",     color: "#FF0000" },
  { label: "Instagram",  desc: "Behind the scenes",          href: "https://instagram.com/minusmarco",    color: "#E1306C" },
  { label: "X",          desc: "Hot takes daily",            href: "https://x.com/minusmarco",            color: "#EEEEF5" },
  { label: "TikTok",     desc: "Short-form gaming content",  href: "https://tiktok.com/@minusmarco",      color: "#69C9D0" },
  { label: "LinkedIn",   desc: "Professional work",          href: "https://linkedin.com/in/minusmarco",  color: "#0A66C2" },
];

export default async function CommunityPage() {
  const [currentGame, poll, debate, quote, shoutouts] = await Promise.all([
    sanityFetch(currentlyPlayingQuery),
    sanityFetch(activePollQuery),
    sanityFetch(activeDebateQuery),
    sanityFetch(activeQuoteQuery),
    sanityFetch(allShoutoutsQuery),
  ]);

  return (
    <div className="min-h-screen pt-20">

      {/* ── HERO ─────────────────────────────────────────────── */}
      <section className="relative overflow-hidden border-b border-border bg-surface">
        <div className="absolute inset-0 bg-gradient-to-br from-accent/8 via-transparent to-[#f6b327]/5 pointer-events-none" />
        <div className="absolute -top-32 -right-32 h-[500px] w-[500px] rounded-full bg-accent opacity-[0.05] blur-[120px] pointer-events-none" />
        <div className="absolute inset-0 opacity-[0.02]" style={{
          backgroundImage: "linear-gradient(var(--color-text-primary) 1px, transparent 1px), linear-gradient(90deg, var(--color-text-primary) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }} />

        <div className="relative max-w-7xl mx-auto px-6 py-20 sm:py-28">
          <div className="flex items-center gap-2 mb-6">
            <div className="h-px w-8 bg-[#f6b327]" />
            <span className="font-display text-xs font-bold uppercase tracking-widest text-[#f6b327]">The Hub</span>
          </div>
          <h1 className="font-display text-6xl sm:text-7xl lg:text-8xl font-bold text-text-primary leading-[0.95] tracking-tight max-w-3xl">
            BE PART<br />
            <span className="text-accent">OF THE</span><br />
            STORY.
          </h1>
          <p className="mt-6 text-text-secondary text-lg max-w-xl leading-relaxed">
            Gaming culture shaped us. This is the space where the community shows up — polls, debates, shoutouts, and more.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href="mailto:marco.hernandez5692@gmail.com"
              className="inline-flex items-center gap-2 rounded-md bg-accent px-6 py-3 font-sans font-semibold text-sm text-bg hover:bg-accent-hover transition-colors duration-200"
            >
              Get in Touch
            </a>
            <Link
              href="/articles"
              className="inline-flex items-center gap-2 rounded-md border border-border px-6 py-3 font-sans font-medium text-sm text-text-secondary hover:border-accent hover:text-accent transition-colors duration-200"
            >
              Read the Work
            </Link>
          </div>
        </div>
      </section>

      {/* ── CURRENTLY PLAYING ────────────────────────────────── */}
      <section className="border-b border-border">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="flex items-center gap-2 mb-8">
            <div className="h-px w-6 bg-accent" />
            <span className="font-display text-xs font-bold uppercase tracking-widest text-accent">Currently Playing</span>
          </div>
          <CurrentlyPlaying data={currentGame as Parameters<typeof CurrentlyPlaying>[0]["data"]} />
        </div>
      </section>

      {/* ── POLL + DEBATE ─────────────────────────────────────── */}
      <section className="border-b border-border bg-surface">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <CommunityPoll data={poll as Parameters<typeof CommunityPoll>[0]["data"]} />
            <DebateOfWeek data={debate as Parameters<typeof DebateOfWeek>[0]["data"]} />
          </div>
        </div>
      </section>

      {/* ── QUOTE OF THE WEEK ─────────────────────────────────── */}
      <QuoteOfWeek data={quote as Parameters<typeof QuoteOfWeek>[0]["data"]} />

      {/* ── FIND THE COMMUNITY ───────────────────────────────── */}
      <section className="border-b border-border">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="flex items-center gap-2 mb-10">
            <div className="h-px w-6 bg-accent" />
            <span className="font-display text-xs font-bold uppercase tracking-widest text-accent">Find the Community</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {PLATFORMS.map((p) => (
              <a
                key={p.label}
                href={p.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col gap-2 rounded-xl border border-border bg-surface p-5 hover:border-accent/50 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/40 transition-all duration-300"
              >
                <div
                  className="h-2 w-2 rounded-full mb-1 transition-all duration-300 group-hover:scale-150"
                  style={{ backgroundColor: p.color }}
                />
                <span className="font-display font-bold text-text-primary text-sm group-hover:text-accent transition-colors duration-200">
                  {p.label}
                </span>
                <span className="text-xs text-text-muted leading-snug">{p.desc}</span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ── SHOUTOUT WALL ─────────────────────────────────────── */}
      <ShoutoutWall shoutouts={shoutouts as Parameters<typeof ShoutoutWall>[0]["shoutouts"]} />

      {/* ── CTA ───────────────────────────────────────────────── */}
      <section className="border-t border-border relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-accent/8 via-bg to-bg pointer-events-none" />
        <div className="relative max-w-7xl mx-auto px-6 py-24 text-center">
          <Image src="/logo-icon.png" alt="" width={48} height={48} className="h-12 w-12 mx-auto mb-6 rounded-md opacity-80" />
          <h2 className="font-display text-5xl sm:text-6xl font-bold text-text-primary">
            Let&apos;s talk games.
          </h2>
          <p className="mt-4 text-text-secondary text-lg max-w-md mx-auto">
            Pitches, collabs, press access, or just want to say hello.
          </p>
          <a
            href="mailto:marco.hernandez5692@gmail.com"
            className="mt-8 inline-flex items-center gap-2 rounded-md bg-[#f6b327] px-8 py-3 font-sans font-semibold text-bg hover:bg-[#fac44a] transition-colors duration-200"
          >
            marco.hernandez5692@gmail.com
          </a>
        </div>
      </section>

    </div>
  );
}
