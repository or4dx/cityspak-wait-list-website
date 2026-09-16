import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { ProblemStatement } from "@/components/ProblemStatement";
import { Ethos } from "@/components/Ethos";
import { DemandDashboard } from "@/components/DemandDashboard";
import { WaitlistSection } from "@/components/WaitlistSection";
import { Footer } from "@/components/Footer";

// Re-fetch DemandDashboard's live survey data at most every 5 minutes. This
// only takes effect exported from a route segment file (this one), not
// from the component itself, Next's static analysis specifically looks
// for it here.
export const revalidate = 300;

export default function Home() {
  return (
    <main className="min-h-screen bg-cs-bg">
      <Header />
      <Hero />
      <ProblemStatement />
      <Ethos />
      <DemandDashboard />
      <WaitlistSection />
      <Footer />
    </main>
  );
}
