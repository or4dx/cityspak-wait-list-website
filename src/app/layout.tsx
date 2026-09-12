import type { Metadata } from "next";
import { DM_Mono, Outfit } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-outfit",
});

const dmMono = DM_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-dm-mono",
});

export const metadata: Metadata = {
  title: "CitySpak — Join the Waitlist",
  description:
    "The city is full. Your weekend is empty. CitySpak is fixing that — join the waitlist for early access.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${outfit.variable} ${dmMono.variable}`}>
      <body className="font-sans">{children}</body>
    </html>
  );
}
