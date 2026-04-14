import { FeaturesSection } from "@/components/home/features-section";
import { Footer } from "@/components/home/footer";
import { Header } from "@/components/home/header";
import { HeroImage } from "@/components/home/hero-image";
import { HeroSection } from "@/components/home/hero-section";
import { OpenSourceSection } from "@/components/home/open-source-section";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-1 p-5 pt-0 px-8 pb-28">
        <Header />
        <HeroSection />
        <HeroImage />
        <FeaturesSection />
        <OpenSourceSection />
      </div>
      <Footer />
    </div>
  );
}
