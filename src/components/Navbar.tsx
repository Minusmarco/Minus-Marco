"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const NAV_LINKS = [
  { label: "Reviews",   href: "/reviews" },
  { label: "Articles",  href: "/articles" },
  { label: "Videos",    href: "/videos" },
  { label: "Community", href: "/community" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={[
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled
          ? "bg-bg/80 backdrop-blur-md border-b border-border shadow-lg shadow-black/30"
          : "bg-transparent",
      ].join(" ")}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          {/* Drop your logo at /public/logo.png and swap this placeholder */}
          <div className="h-8 w-8 rounded-sm bg-accent flex items-center justify-center text-bg font-display font-bold text-lg select-none">
            M
          </div>
          <span className="font-display text-xl font-bold tracking-wide text-text-primary group-hover:text-accent transition-colors duration-200">
            MINUS MARCO
          </span>
        </Link>

        {/* Nav links */}
        <ul className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="px-4 py-2 rounded-md text-sm font-sans font-medium text-text-secondary hover:text-text-primary hover:bg-surface-raised transition-all duration-200"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Right side CTA */}
        <div className="flex items-center gap-4">
          <button
            aria-label="Search"
            className="text-text-secondary hover:text-accent transition-colors duration-200"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
          </button>
          <Link
            href="/community"
            className="hidden sm:inline-flex items-center gap-2 rounded-md bg-accent px-4 py-2 text-sm font-sans font-semibold text-bg hover:bg-accent-hover transition-colors duration-200"
          >
            Join Community
          </Link>
        </div>
      </nav>
    </motion.header>
  );
}
