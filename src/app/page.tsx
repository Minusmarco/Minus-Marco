import HeroSection from "@/components/HeroSection";
import Ticker from "@/components/Ticker";
import ArticlesPreview from "@/components/ArticlesPreview";
import CommunityBanner from "@/components/CommunityBanner";

export default function Home() {
  return (
    <main className="flex flex-col flex-1">
      <HeroSection />
      <Ticker />
      <ArticlesPreview />
      <CommunityBanner />
    </main>
  );
}
