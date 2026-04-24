import Link from "next/link";

export default function CommunityBanner() {
  return (
    <section className="border-t border-border relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-accent/10 via-bg to-bg" />
      <div className="absolute -top-24 -left-24 h-[400px] w-[400px] rounded-full bg-accent opacity-[0.07] blur-[100px] pointer-events-none" />
      <div className="absolute inset-0 opacity-[0.02]" style={{
        backgroundImage: "linear-gradient(var(--color-text-primary) 1px, transparent 1px), linear-gradient(90deg, var(--color-text-primary) 1px, transparent 1px)",
        backgroundSize: "40px 40px",
      }} />

      <div className="relative max-w-7xl mx-auto px-6 py-20 flex flex-col lg:flex-row items-center justify-between gap-10">
        <div className="text-center lg:text-left">
          <div className="flex items-center justify-center lg:justify-start gap-2 mb-4">
            <div className="h-px w-6 bg-accent" />
            <span className="font-display text-xs font-bold uppercase tracking-widest text-accent">Community</span>
          </div>
          <h2 className="font-display text-5xl sm:text-6xl font-bold text-text-primary leading-tight">
            Be part of<br />the story.
          </h2>
          <p className="mt-4 text-text-secondary text-lg max-w-md leading-relaxed">
            Gaming culture shaped us. Join the community where underrepresented voices are heard, celebrated, and amplified.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row lg:flex-col gap-4 w-full lg:w-auto lg:min-w-[240px]">
          <Link
            href="/community"
            className="flex-1 lg:flex-none flex items-center justify-center gap-2 rounded-md bg-accent px-8 py-4 font-sans font-semibold text-bg hover:bg-accent-hover transition-colors duration-200 text-center group"
          >
            Join the Community
            <svg className="transition-transform duration-200 group-hover:translate-x-1" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
          <Link
            href="/about"
            className="flex-1 lg:flex-none flex items-center justify-center rounded-md border border-border px-8 py-4 font-sans font-medium text-text-secondary hover:border-accent hover:text-accent transition-colors duration-200 text-center"
          >
            About Marco
          </Link>
        </div>
      </div>
    </section>
  );
}
