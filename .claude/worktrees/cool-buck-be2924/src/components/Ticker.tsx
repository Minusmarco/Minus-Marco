const ITEMS = [
  { label: "Game Journalism" },
  { label: "Community" },
  { label: "Fresno, CA" },
  { label: "The Expansion Pack To Your Game" },
  { label: "Articles" },
  { label: "Opinion" },
  { label: "Game Culture" },
  { label: "Indie Games" },
  { label: "AAA Titles" },
  { label: "Features" },
  { label: "Videos" },
  { label: "Minority Voices in Gaming" },
];

export default function Ticker() {
  const repeated = [...ITEMS, ...ITEMS];

  return (
    <div className="w-full overflow-hidden border-y border-border bg-surface py-3 select-none">
      <div className="ticker-track">
        {repeated.map((item, i) => (
          <span key={i} className="inline-flex items-center gap-4 px-6 whitespace-nowrap">
            <span className="font-display text-xs font-bold uppercase tracking-widest text-text-secondary">
              {item.label}
            </span>
            <span className="text-gold text-xs">✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}
