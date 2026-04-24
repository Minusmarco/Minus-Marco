"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const NAV_LINKS = [
  { label: "Home",      href: "/" },
  { label: "Articles",  href: "/articles" },
  { label: "Videos",    href: "/videos" },
  { label: "Community", href: "/community" },
  { label: "About",     href: "/about" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  return (
    <>
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className={[
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
          scrolled || menuOpen
            ? "bg-bg/90 backdrop-blur-md border-b border-border shadow-lg shadow-black/30"
            : "bg-transparent",
        ].join(" ")}
      >
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          {/* Logo */}
          <Link href="/" onClick={() => setMenuOpen(false)} className="flex items-center gap-3 group z-10">
            <div className="h-8 w-8 rounded-sm bg-accent flex items-center justify-center text-bg font-display font-bold text-lg select-none">
              M
            </div>
            <span className="font-display text-xl font-bold tracking-wide text-text-primary group-hover:text-accent transition-colors duration-200">
              MINUS MARCO
            </span>
          </Link>

          {/* Desktop nav links */}
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

          {/* Right side */}
          <div className="flex items-center gap-3">
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

            {/* Hamburger — mobile only */}
            <button
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              onClick={() => setMenuOpen((v) => !v)}
              className="md:hidden flex flex-col justify-center items-center w-8 h-8 gap-1.5 z-10"
            >
              <motion.span
                animate={menuOpen ? { rotate: 45, y: 7 } : { rotate: 0, y: 0 }}
                transition={{ duration: 0.25 }}
                className="block h-0.5 w-6 bg-text-primary rounded-full origin-center"
              />
              <motion.span
                animate={menuOpen ? { opacity: 0, scaleX: 0 } : { opacity: 1, scaleX: 1 }}
                transition={{ duration: 0.2 }}
                className="block h-0.5 w-6 bg-text-primary rounded-full"
              />
              <motion.span
                animate={menuOpen ? { rotate: -45, y: -7 } : { rotate: 0, y: 0 }}
                transition={{ duration: 0.25 }}
                className="block h-0.5 w-6 bg-text-primary rounded-full origin-center"
              />
            </button>
          </div>
        </nav>
      </motion.header>

      {/* Mobile drawer */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            key="mobile-menu"
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="fixed inset-0 z-40 bg-bg flex flex-col pt-24 px-8 pb-12"
          >
            <nav className="flex flex-col gap-2 flex-1">
              {NAV_LINKS.map((link, i) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, x: 24 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 + i * 0.06, duration: 0.3 }}
                >
                  <Link
                    href={link.href}
                    onClick={() => setMenuOpen(false)}
                    className="block font-display text-5xl font-bold text-text-primary hover:text-accent transition-colors duration-200 py-2 border-b border-border"
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
            </nav>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <Link
                href="/community"
                onClick={() => setMenuOpen(false)}
                className="w-full flex items-center justify-center gap-2 rounded-md bg-accent px-6 py-3 font-sans font-semibold text-bg hover:bg-accent-hover transition-colors duration-200"
              >
                Join Community
              </Link>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
