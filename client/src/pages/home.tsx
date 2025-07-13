import { useState } from "react";
import Header from "@/components/header";
import HeroSection from "@/components/hero-section";
import MotivationSection from "@/components/motivation-section";
import Navigation from "@/components/navigation";
import NoticesSection from "@/components/notices-section";
import SignatureSection from "@/components/signature-section";
import PoliciesSection from "@/components/policies-section";
import ResourcesSection from "@/components/resources-section";
import DashboardSection from "@/components/dashboard-section";
import Footer from "@/components/footer";
import FloatingSignatureButton from "@/components/floating-signature-button";

export default function Home() {
  const [currentSection, setCurrentSection] = useState("notices");

  const handleSectionChange = (section: string) => {
    setCurrentSection(section);
    // Scroll to main content area
    setTimeout(() => {
      const mainElement = document.querySelector('main');
      if (mainElement) {
        mainElement.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  const renderSection = () => {
    switch (currentSection) {
      case "notices":
        return <NoticesSection />;
      case "signature":
        return <SignatureSection />;
      case "policies":
        return <PoliciesSection />;
      case "resources":
        return <ResourcesSection />;
      case "dashboard":
        return <DashboardSection />;
      default:
        return <NoticesSection />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <HeroSection onSectionChange={handleSectionChange} />
      <MotivationSection />
      <Navigation currentSection={currentSection} onSectionChange={handleSectionChange} />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderSection()}
      </main>
      
      <Footer />
      <FloatingSignatureButton />
    </div>
  );
}
