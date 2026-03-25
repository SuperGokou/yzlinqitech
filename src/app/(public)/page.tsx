import HeroSection from "@/components/sections/HeroSection";
import HowItWorks from "@/components/sections/HowItWorks";
import ServicesSection from "@/components/sections/ServicesSection";
import PortfolioSection from "@/components/sections/PortfolioSection";
import AIChatDemo from "@/components/sections/AIChatDemo";
import FounderSection from "@/components/sections/FounderSection";
import TechStackMarquee from "@/components/sections/TechStackMarquee";

export default function Home() {
  return (
    <div id="main-content" role="main">
      <HeroSection />
      <HowItWorks />
      <ServicesSection />
      <PortfolioSection />
      <AIChatDemo />
      <FounderSection />
      <TechStackMarquee />
    </div>
  );
}
