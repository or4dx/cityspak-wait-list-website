import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ExpertsSurvey } from "@/components/experts/ExpertsSurvey";

export const metadata: Metadata = {
  title: "Venue Expert Program",
  description:
    "Share your insider knowledge of Dubai's best venues and help shape how CitySpak curates the city.",
};

export default function ExpertsPage() {
  return (
    <main className="min-h-screen bg-cs-bg">
      <Header />
      <ExpertsSurvey />
      <Footer />
    </main>
  );
}
