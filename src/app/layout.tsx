import type { Metadata } from "next";
import { Inter, Barlow_Condensed } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import SiteChrome from "@/components/SiteChrome";
import { SITE_URL } from "@/lib/brand";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const barlow = Barlow_Condensed({
  variable: "--font-barlow",
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
  display: "swap",
});

const description = "Video game journalism and community by Minus Marco: the expansion pack to your game.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: "Minus Marco", template: "%s | Minus Marco" },
  description,
  openGraph: {
    siteName: "Minus Marco",
    type: "website",
    locale: "en_US",
    title: "Minus Marco",
    description,
  },
  twitter: {
    card: "summary_large_image",
    title: "Minus Marco",
    description,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${barlow.variable} h-full`}>
      <body className="min-h-full flex flex-col bg-bg text-text-primary">
        <SiteChrome>{children}</SiteChrome>
        <Analytics />
      </body>
    </html>
  );
}
