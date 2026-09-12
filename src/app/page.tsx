import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { ProblemStatement } from "@/components/ProblemStatement";
import { DemandDashboard } from "@/components/DemandDashboard";
import { WaitlistSection } from "@/components/WaitlistSection";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-cs-bg">
      <Header />
      <Hero />
      <ProblemStatement />
      <DemandDashboard />
      <WaitlistSection />
      <Footer />
    </main>
  );
}
