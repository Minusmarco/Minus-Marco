import type { Metadata } from "next";
import { Inter, Barlow_Condensed } from "next/font/google";
import Navbar from "@/components/Navbar";
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

export const metadata: Metadata = {
  title: { default: "Minus Marco", template: "%s | Minus Marco" },
  description: "Video game journalism and community by Minus Marco",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${barlow.variable} h-full`}>
      <body className="min-h-full flex flex-col bg-bg text-text-primary">
        <Navbar />
        {children}
      </body>
    </html>
  );
}
