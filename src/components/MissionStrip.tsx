import Image from "next/image";
import Link from "next/link";
import Reveal from "@/components/Reveal";

// A quiet editorial beat between the game-UI sections — the human story is
// the strongest hook for a visitor who doesn't care about games.
export default function MissionStrip() {
  return (
    <section className="border-b border-border bg-surface">
      <Reveal className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-[auto_1fr] gap-8 lg:gap-12 items-center">
          <div className="relative h-20 w-20 sm:h-24 sm:w-24 flex-shrink-0 overflow-hidden rounded-full border border-border">
            <Image src="/marco.avif" alt="Marco Hernandez" fill className="object-cover object-top" />
          </div>
          <div>
            <p className="font-display text-xs font-bold uppercase tracking-widest text-accent mb-3">Why Minus Marco</p>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-text-primary leading-tight max-w-3xl">
              Amplifying the voices gaming forgot to invite.
            </h2>
            <p className="mt-4 text-text-secondary text-base sm:text-lg leading-relaxed max-w-2xl">
              Marco grew up in a Mexican-immigrant household in Central California&apos;s agricultural
              heartland, where video games were a portal. Minus Marco exists to make sure gaming
              culture reflects the youth, minority, and overlooked communities who love it most.
            </p>
            <Link
              href="/about"
              className="mt-5 inline-flex items-center gap-2 text-sm font-sans font-semibold text-accent-text hover:text-accent-hover transition-colors duration-200 group"
            >
              Meet Marco
              <svg className="transition-transform duration-200 group-hover:translate-x-1" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
