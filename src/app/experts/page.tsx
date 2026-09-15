import type { Metadata } from "next";
import { ExpertsSurvey } from "@/components/experts/ExpertsSurvey";

export const metadata: Metadata = {
  title: "Venue Expert Program",
  description:
    "Share your insider knowledge of Dubai's best venues and help shape how CitySpak curates the city.",
};

export default function ExpertsPage() {
  return (
    <main className="min-h-screen bg-cs-bg">
      <ExpertsSurvey />
    </main>
  );
}
