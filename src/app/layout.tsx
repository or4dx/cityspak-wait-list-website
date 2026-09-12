import type { Metadata } from "next";
import { DM_Mono, Inter, Playfair_Display } from "next/font/google";
import "./globals.css";

// Same three-font system as the main CitySpak app (Inter/Playfair
// Display/DM Mono), for brand consistency across the two repos.
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["600", "700"],
  variable: "--font-serif",
});

const dmMono = DM_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono",
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
    <html lang="en" className={`${inter.variable} ${playfair.variable} ${dmMono.variable}`}>
      <body className="font-sans">{children}</body>
    </html>
  );
}
