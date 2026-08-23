import Link from "next/link";
import Mascot from "@/components/Mascot";

export const metadata = { title: "Game Over" };

export default function NotFound() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 pt-20 pb-16 text-center">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(var(--color-accent) 1px, transparent 1px), linear-gradient(90deg, var(--color-accent) 1px, transparent 1px)",
          backgroundSize: "56px 56px",
        }}
      />
      <div className="pointer-events-none absolute -top-24 right-0 h-[420px] w-[420px] rounded-full bg-accent opacity-[0.10] blur-[130px]" />
      <div className="pointer-events-none absolute bottom-0 -left-24 h-[360px] w-[360px] rounded-full bg-[#f6b327] opacity-[0.07] blur-[130px]" />

      <Mascot variant="gameover" className="relative mb-6 h-24 w-24" />

      <span className="mb-4 font-display text-xs font-bold uppercase tracking-[0.2em] text-text-muted">
        Error 404
      </span>
      <h1 className="font-display text-6xl font-extrabold uppercase leading-[0.9] tracking-tight text-text-primary sm:text-7xl lg:text-8xl">
        Game Over
      </h1>
      <p className="mt-5 max-w-md text-lg text-text-secondary">
        This level doesn&apos;t exist. The page you&apos;re looking for got patched out.
      </p>

      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-md bg-accent px-6 py-3 font-sans text-sm font-semibold text-bg transition-colors duration-200 hover:bg-accent-hover"
        >
          ↺ Continue
        </Link>
        <Link
          href="/articles"
          className="inline-flex items-center gap-2 rounded-md border border-border px-6 py-3 font-sans text-sm font-medium text-text-secondary transition-colors duration-200 hover:border-accent hover:text-accent"
        >
          Level Select
        </Link>
      </div>
    </div>
  );
}
