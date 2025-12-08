// app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";
import Navigation from "../components/navigation";
import { Analytics } from "@vercel/analytics/next";

import {
  DM_Sans as V0_Font_DM_Sans,
  Space_Mono as V0_Font_Space_Mono,
  Source_Serif_4 as V0_Font_Source_Serif_4,
} from "next/font/google";

const dmSans = V0_Font_DM_Sans({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-sans",
});

const spaceMono = V0_Font_Space_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-mono",
});

const sourceSerif = V0_Font_Source_Serif_4({
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-serif",
});

export const metadata: Metadata = {
  title: "AthleteHub",
  description: "Fitness tracking made simple",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${dmSans.variable} ${spaceMono.variable} ${sourceSerif.variable} font-sans antialiased bg-background`}
      >
        <Navigation />

        {/* top padding so content clears fixed navbar on all devices */}
        <main className="min-h-[calc(100vh-96px)] pt-24 md:pt-28 pb-12">
          {children}
        </main>

        <Analytics />
      </body>
    </html>
  );
}
