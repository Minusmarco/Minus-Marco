import Image from "next/image";
import { FaStar, FaRegStar } from "react-icons/fa6";
import { urlFor } from "@/sanity/lib/image";
import { iconFor, isRenderableSocial } from "@/lib/socialIcons";

export type GameInfo = {
  gameTitle?: string;
  boxArt?: { asset: object; alt?: string };
  score?: number;
  esrb?: string;
  platforms?: string[];
  publisher?: string;
  developer?: string;
  genre?: string;
  releaseDate?: string;
  timeToBeat?: string;
  editorsNote?: string;
  devLinks?: { _key: string; platform: string; url: string }[];
};

// Sanity `date` fields are plain YYYY-MM-DD. Format in UTC so the day never
// shifts backwards for readers in negative-offset timezones.
function formatReleaseDate(date: string): string {
  const d = new Date(date);
  if (Number.isNaN(d.getTime())) return date;
  return d.toLocaleDateString("en-US", {
    month: "long", day: "numeric", year: "numeric", timeZone: "UTC",
  });
}

function StarRating({ score }: { score: number }) {
  const clamped = Math.max(0, Math.min(5, score));
  const display = Number.isInteger(clamped) ? clamped : clamped.toFixed(1);
  return (
    <div className="flex items-center gap-2.5">
      <div className="flex items-center gap-1" role="img" aria-label={`${display} out of 5 stars`}>
        {[0, 1, 2, 3, 4].map((i) => {
          const fill = Math.max(0, Math.min(1, clamped - i));
          return (
            <span key={i} className="relative inline-block h-5 w-5">
              <FaRegStar className="absolute inset-0 h-5 w-5 text-[#f6b327]" aria-hidden="true" />
              {fill > 0 && (
                <span className="absolute inset-0 overflow-hidden" style={{ width: `${fill * 100}%` }}>
                  <FaStar className="h-5 w-5 text-[#f6b327]" aria-hidden="true" />
                </span>
              )}
            </span>
          );
        })}
      </div>
      <span className="font-display text-sm font-bold text-text-secondary tabular-nums">{display}/5</span>
    </div>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-baseline justify-between gap-6 border-b border-border py-2.5 last:border-b-0">
      <dt className="shrink-0 font-display text-xs font-bold uppercase tracking-widest text-text-primary">
        {label}
      </dt>
      <dd className="min-w-0 text-right text-sm text-text-secondary">{children}</dd>
    </div>
  );
}

export default function GameInfoBox({ info }: { info?: GameInfo | null }) {
  // The box is opt-in: no game name means Marco didn't fill it out.
  if (!info?.gameTitle) return null;

  const artUrl = info.boxArt ? urlFor(info.boxArt).width(600).height(800).url() : null;
  const devLinks = (info.devLinks ?? []).filter(isRenderableSocial);
  const platforms = (info.platforms ?? []).filter((p) => p && p.trim().length > 0);

  return (
    <aside className="mt-14 overflow-hidden rounded-xl border border-border bg-surface">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 border-b border-border px-6 py-5 sm:px-8">
        <div className="min-w-0">
          <div className="mb-2 flex items-center gap-2">
            <div className="h-px w-6 bg-accent" />
            <span className="font-display text-xs font-bold uppercase tracking-widest text-accent">
              The Game
            </span>
          </div>
          <h2 className="font-display text-2xl font-bold leading-tight text-text-primary sm:text-3xl">
            {info.gameTitle}
          </h2>
        </div>
        {info.esrb && (
          <div
            className="flex shrink-0 flex-col items-center rounded-md border-2 border-text-primary px-2.5 py-1.5 leading-none"
            title={`ESRB rating: ${info.esrb}`}
          >
            <span className="font-display text-lg font-extrabold text-text-primary">{info.esrb}</span>
            <span className="mt-0.5 font-display text-[8px] font-bold uppercase tracking-widest text-text-muted">
              ESRB
            </span>
          </div>
        )}
      </div>

      {/* Body */}
      <div className="grid gap-6 px-6 py-6 sm:grid-cols-[minmax(0,180px)_1fr] sm:gap-8 sm:px-8">
        {/* Art + score */}
        <div className="flex flex-col gap-4">
          <div className="relative mx-auto aspect-[3/4] w-40 overflow-hidden rounded-lg bg-surface-raised sm:mx-0 sm:w-full">
            {artUrl ? (
              <Image
                src={artUrl}
                alt={info.boxArt?.alt ?? `${info.gameTitle} box art`}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 10rem, 180px"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="font-display text-3xl font-bold text-text-muted opacity-20">MM</span>
              </div>
            )}
          </div>
          {typeof info.score === "number" && (
            <div className="flex justify-center sm:justify-start">
              <StarRating score={info.score} />
            </div>
          )}
        </div>

        {/* Spec sheet */}
        <dl className="flex flex-col">
          {platforms.length > 0 && (
            <Row label="Platform">
              <span className="flex flex-wrap justify-end gap-1.5">
                {platforms.map((p) => (
                  <span
                    key={p}
                    className="rounded-md border border-border bg-surface-raised px-2 py-0.5 text-xs font-medium text-text-secondary"
                  >
                    {p}
                  </span>
                ))}
              </span>
            </Row>
          )}
          {info.publisher && <Row label="Publisher">{info.publisher}</Row>}
          {info.developer && <Row label="Developer">{info.developer}</Row>}
          {info.genre && <Row label="Genre">{info.genre}</Row>}
          {info.releaseDate && <Row label="Release Date">{formatReleaseDate(info.releaseDate)}</Row>}
          {info.timeToBeat && <Row label="Time to Beat">{info.timeToBeat}</Row>}
          {devLinks.length > 0 && (
            <Row label="Dev Links">
              <span className="flex flex-wrap justify-end gap-2">
                {devLinks.map((link) => {
                  const Icon = iconFor(link.platform);
                  return (
                    <a
                      key={link._key}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${link.platform.trim()} (opens in new tab)`}
                      title={link.platform.trim()}
                      className="flex h-8 w-8 items-center justify-center rounded-full border border-border text-text-muted transition-colors duration-200 hover:border-accent hover:bg-accent/5 hover:text-accent"
                    >
                      <Icon className="h-4 w-4" aria-hidden="true" />
                    </a>
                  );
                })}
              </span>
            </Row>
          )}
        </dl>
      </div>

      {/* Editor's note */}
      {info.editorsNote && (
        <div className="border-t border-border bg-surface-raised px-6 py-4 sm:px-8">
          <span className="font-display text-xs font-bold uppercase tracking-widest text-text-muted">
            Editor&apos;s Note
          </span>
          <p className="mt-1.5 text-sm italic leading-relaxed text-text-secondary">{info.editorsNote}</p>
        </div>
      )}
    </aside>
  );
}
