import Link from "next/link";
import Image from "next/image";
import { NAV_LINKS } from "@/components/Navbar";
import { MARCO_SOCIALS, CONTACT_EMAIL, SITE_TAGLINE } from "@/lib/brand";
import { iconFor } from "@/lib/socialIcons";
import Mascot from "@/components/Mascot";

// The site's only dark band — deliberately, so it reads as the floor of the
// page rather than one more content section (every other band is light).
export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t-[3px] border-[#f6b327] bg-ink">
      <div className="max-w-7xl mx-auto px-6 py-14">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="inline-flex items-center gap-2.5">
              <Image src="/logo-icon.png" alt="" width={40} height={40} className="h-10 w-10 rounded-sm object-contain" />
              <span className="font-display text-lg font-extrabold uppercase tracking-tight text-[#EDEFF6]">
                Minus Marco
              </span>
            </Link>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-[#8A8FA8]">
              {SITE_TAGLINE} Game journalism, culture, and community from Fresno, CA.
            </p>
          </div>

          {/* Nav */}
          <div>
            <p className="mb-4 font-display text-xs font-bold uppercase tracking-widest text-[#EDEFF6]">Explore</p>
            <ul className="flex flex-col gap-2.5">
              {NAV_LINKS.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-sm text-[#8A8FA8] transition-colors duration-200 hover:text-accent">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact + socials */}
          <div>
            <p className="mb-4 font-display text-xs font-bold uppercase tracking-widest text-[#EDEFF6]">Connect</p>
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="break-all text-sm text-[#8A8FA8] transition-colors duration-200 hover:text-accent"
            >
              {CONTACT_EMAIL}
            </a>
            <div className="mt-4 flex flex-wrap gap-2">
              {MARCO_SOCIALS.map((s) => {
                const Icon = iconFor(s.platform);
                return (
                  <a
                    key={s.platform}
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${s.platform} (opens in new tab)`}
                    title={s.platform}
                    className="flex h-8 w-8 items-center justify-center rounded-full border border-white/15 text-[#8A8FA8] transition-colors duration-200 hover:border-accent hover:text-accent"
                  >
                    <Icon className="h-4 w-4" aria-hidden="true" />
                  </a>
                );
              })}
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-white/10 pt-6 sm:flex-row">
          <div className="flex items-center gap-3">
            <p className="text-xs text-[#8A8FA8]">© {year} Minus Marco. Made in Fresno, CA.</p>
            <span className="hidden items-center gap-1.5 font-display text-[10px] font-bold uppercase tracking-widest text-[#f6b327] sm:flex">
              <span className="h-1.5 w-1.5 rounded-full bg-[#f6b327]" />
              Est. 2026
            </span>
          </div>
          <Mascot className="h-8 w-8 opacity-80" />
        </div>
      </div>
    </footer>
  );
}
