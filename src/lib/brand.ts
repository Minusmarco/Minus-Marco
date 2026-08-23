// Single source of truth for brand-level constants used across pages
// (community, about, footer) so an update to a handle only happens once.

export const SITE_URL = "https://www.minusmarco.org";
export const CONTACT_EMAIL = "minusmarcoh@gmail.com";
export const SITE_TAGLINE = "The expansion pack to your game.";

export type MarcoSocial = {
  platform: string;
  desc: string;
  url: string;
  // Small brand-accurate accent used for the colored dot on the Community
  // page's platform cards. Chosen to stay legible against a light card.
  color: string;
};

export const MARCO_SOCIALS: MarcoSocial[] = [
  { platform: "Substack", desc: "Essays & long reads", url: "https://substack.com/@itsminusmarco", color: "#FF6719" },
  { platform: "YouTube", desc: "Video deep-dives & previews", url: "https://www.youtube.com/@itsminusmarco", color: "#FF0000" },
  { platform: "Instagram", desc: "Behind the scenes & event coverage", url: "https://www.instagram.com/itsminusmarco", color: "#E1306C" },
  { platform: "X", desc: "Hot takes & breaking news", url: "https://x.com/itsminusmarco", color: "#0D0E18" },
  { platform: "TikTok", desc: "Short-form gaming content", url: "https://www.tiktok.com/@itsminusmarco", color: "#69C9D0" },
  { platform: "LinkedIn", desc: "Professional work & portfolio", url: "https://www.linkedin.com/in/marco-hernandez-253908281/", color: "#0A66C2" },
];
