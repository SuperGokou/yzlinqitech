import { LocaleProvider } from "@/contexts/LocaleContext";
import Navbar from "@/components/sections/Navbar";
import HeroSection from "@/components/sections/HeroSection";
import HowItWorks from "@/components/sections/HowItWorks";
import ServicesSection from "@/components/sections/ServicesSection";
import PortfolioSection from "@/components/sections/PortfolioSection";
import AIChatDemo from "@/components/sections/AIChatDemo";
import FounderSection from "@/components/sections/FounderSection";
import TechStackMarquee from "@/components/sections/TechStackMarquee";
import Footer from "@/components/sections/Footer";
import ChatWidget from "@/components/chat/ChatWidget";

export default function Home() {
  return (
    <LocaleProvider>
      <Navbar />
      <main id="main-content" role="main">
        <HeroSection />
        <HowItWorks />
        <ServicesSection />
        <PortfolioSection />
        <AIChatDemo />
        <FounderSection />
        <TechStackMarquee />
      </main>
      <Footer />
      <ChatWidget />
    </LocaleProvider>
  );
}
