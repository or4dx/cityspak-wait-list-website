import { Hero } from "@/components/Hero";
import { ProblemStatement } from "@/components/ProblemStatement";
import { DemandDashboard } from "@/components/DemandDashboard";
import { WaitlistSection } from "@/components/WaitlistSection";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <main>
      <Hero />
      <ProblemStatement />
      <DemandDashboard />
      <WaitlistSection />
      <Footer />
    </main>
  );
}
