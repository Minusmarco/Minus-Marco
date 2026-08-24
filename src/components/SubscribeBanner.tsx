import { MARCO_SOCIALS } from "@/lib/brand";

// Points at Marco's existing Substack rather than building a custom
// email-capture backend — Substack already owns delivery + list management.
export default function SubscribeBanner() {
  const substackUrl = MARCO_SOCIALS.find((s) => s.platform === "Substack")?.url ?? "https://substack.com/@itsminusmarco";

  return (
    <div className="border-b border-border bg-surface">
      <div className="max-w-7xl mx-auto px-6 py-14 flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-display text-xs font-bold uppercase tracking-widest text-accent-text mb-2">Never Miss a Drop</p>
          <h3 className="font-display text-2xl sm:text-3xl font-bold text-text-primary leading-tight">
            Get every story straight to your inbox.
          </h3>
          <p className="mt-2 text-sm text-text-secondary max-w-md leading-relaxed">
            New reviews, essays, and community updates — sent whenever Marco publishes, never more.
          </p>
        </div>
        <a
          href={substackUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex flex-shrink-0 items-center gap-2 rounded-md bg-accent px-6 py-3 font-sans font-semibold text-sm text-bg hover:bg-accent-hover transition-colors duration-200"
        >
          Subscribe on Substack
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </a>
      </div>
    </div>
  );
}
