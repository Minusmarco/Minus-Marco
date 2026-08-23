type Props = {
  className?: string;
  variant?: "idle" | "gameover";
};

// A small original mascot — not modeled on any existing character. A round
// "controller-eared" blob in brand blue/gold. Two expressions: idle (default)
// and gameover (X eyes, for the 404 page). Pure inline SVG, no image asset.
export default function Mascot({ className = "", variant = "idle" }: Props) {
  const isGameOver = variant === "gameover";
  return (
    <svg viewBox="0 0 80 80" className={className} aria-hidden="true" focusable="false">
      {/* body */}
      <circle cx="40" cy="44" r="30" fill="#2cabe2" />
      {/* antenna nubs */}
      <rect x="24.5" y="12" width="3" height="14" rx="1.5" fill="#f6b327" />
      <circle cx="26" cy="12" r="5" fill="#f6b327" />
      <rect x="52.5" y="12" width="3" height="14" rx="1.5" fill="#f6b327" />
      <circle cx="54" cy="12" r="5" fill="#f6b327" />
      {/* face plate */}
      <circle cx="40" cy="46" r="21" fill="#F8F9FC" />
      {isGameOver ? (
        <>
          <path d="M28 38l8 8M36 38l-8 8" stroke="#0D0E18" strokeWidth="3" strokeLinecap="round" />
          <path d="M44 38l8 8M52 38l-8 8" stroke="#0D0E18" strokeWidth="3" strokeLinecap="round" />
          <path d="M32 58h16" stroke="#0D0E18" strokeWidth="3" strokeLinecap="round" />
        </>
      ) : (
        <>
          <circle cx="32" cy="42" r="4" fill="#0D0E18" />
          <circle cx="48" cy="42" r="4" fill="#0D0E18" />
          <circle cx="33.3" cy="40.5" r="1.2" fill="#F8F9FC" />
          <circle cx="49.3" cy="40.5" r="1.2" fill="#F8F9FC" />
          <path d="M31 54q9 8 18 0" stroke="#0D0E18" strokeWidth="3" strokeLinecap="round" fill="none" />
        </>
      )}
    </svg>
  );
}
