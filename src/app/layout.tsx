import type { Metadata } from "next";
import { Nunito, Exo_2 } from "next/font/google";
import Navbar from "@/components/Navbar";
import "./globals.css";

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
  weight: ["400", "600", "700", "800", "900"],
  display: "swap",
});

const exo2 = Exo_2({
  variable: "--font-exo2",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
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
    <html lang="en" className={`${nunito.variable} ${exo2.variable} h-full`}>
      <body className="min-h-full flex flex-col bg-bg text-text-primary">
        <Navbar />
        {children}
      </body>
    </html>
  );
}
