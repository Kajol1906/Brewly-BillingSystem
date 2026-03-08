import { HeroSection } from "./components/HeroSection";
import { FeaturesSection } from "./components/FeaturesSection";
import { UseCasesSection } from "./components/UseCasesSection";
import { ContactSection } from "./components/ContactSection";
import { Footer } from "./components/Footer";

export default function App() {
  return (
    <div className="min-h-screen overflow-x-hidden relative">
      <HeroSection />
      <FeaturesSection />
      <UseCasesSection />
      <ContactSection />
      <Footer />
    </div>
  );
}