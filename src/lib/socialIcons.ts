import type { IconType } from "react-icons";
import {
  FaInstagram, FaYoutube, FaXTwitter, FaTiktok, FaDiscord, FaTwitch,
  FaLinkedin, FaFacebook, FaThreads, FaGithub, FaGlobe, FaSteam, FaReddit,
} from "react-icons/fa6";
import { SiSubstack, SiBluesky } from "react-icons/si";

// Map a free-text platform name to a brand icon. Unknown platforms fall back
// to a generic globe so a link always renders.
export function iconFor(platform: string): IconType {
  const p = platform.toLowerCase().replace(/[^a-z]/g, "");
  if (p.includes("threads")) return FaThreads; // before "instagram" — avoids "threadsbyinstagram" mismatch
  if (p.includes("instagram") || p === "ig") return FaInstagram;
  if (p.includes("youtube") || p === "yt") return FaYoutube;
  if (p.includes("bluesky") || p.includes("bsky")) return SiBluesky;
  if (p === "x" || p.includes("twitter")) return FaXTwitter;
  if (p.includes("tiktok")) return FaTiktok;
  if (p.includes("discord")) return FaDiscord;
  if (p.includes("twitch")) return FaTwitch;
  if (p.includes("linkedin")) return FaLinkedin;
  if (p.includes("facebook") || p === "fb") return FaFacebook;
  if (p.includes("github")) return FaGithub;
  if (p.includes("substack")) return SiSubstack;
  if (p.includes("steam")) return FaSteam;
  if (p.includes("reddit")) return FaReddit;
  return FaGlobe;
}

// Socials come from free-text CMS input — only render real web links with a
// usable label.
export function isRenderableSocial(s: { platform?: string; url?: string }): boolean {
  return !!s.url && /^https?:\/\//i.test(s.url) && !!s.platform && s.platform.trim().length > 0;
}
