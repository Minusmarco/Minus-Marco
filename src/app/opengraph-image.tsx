import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Minus Marco: the expansion pack to your game.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// A code-generated default share card — matches the site's look without
// depending on a separately-designed image asset, and covers any page that
// doesn't set its own (articles with a cover photo override this).
export default async function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          background: "#F8F9FC",
          backgroundImage:
            "radial-gradient(circle at 12% -10%, #DCEBFA 0%, transparent 46%), radial-gradient(circle at 100% 8%, #E6EEFD 0%, transparent 42%)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20, marginBottom: 44 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 84,
              height: 84,
              borderRadius: 16,
              background: "#2cabe2",
              color: "#F8F9FC",
              fontSize: 46,
              fontWeight: 800,
            }}
          >
            M
          </div>
          <div style={{ width: 6, height: 64, borderRadius: 3, background: "#f6b327" }} />
        </div>
        <div style={{ display: "flex", fontSize: 92, fontWeight: 800, color: "#0D0E18", lineHeight: 1, letterSpacing: -2 }}>
          MINUS MARCO
        </div>
        <div style={{ display: "flex", marginTop: 26, fontSize: 32, color: "#4E5068" }}>
          The expansion pack to your game.
        </div>
      </div>
    ),
    { ...size },
  );
}
