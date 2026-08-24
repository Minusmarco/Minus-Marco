"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";
import LevelLoader from "@/components/LevelLoader";
import Footer from "@/components/Footer";
import SearchModal from "@/components/SearchModal";

// Sanity Studio (/studio) renders its own full-screen app and must not be
// wrapped in the site's navbar/footer/loader chrome.
export default function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isStudio = pathname?.startsWith("/studio");

  if (isStudio) return <>{children}</>;

  return (
    <>
      <a href="#main-content" className="skip-link">
        Skip to content
      </a>
      <Navbar />
      <LevelLoader />
      <SearchModal />
      <div id="main-content" className="flex flex-1 flex-col">
        {children}
      </div>
      <Footer />
    </>
  );
}
