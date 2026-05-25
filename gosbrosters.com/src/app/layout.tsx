import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import CustomCursor from "@/components/CustomCursor";
import { LanguageProvider } from "@/components/LanguageContext";

const interSans = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-sans",
  display: "swap",
});

const interDisplay = Inter({
  subsets: ["latin"],
  weight: "900",
  variable: "--font-display",
  display: "swap",
});

const interSerif = Inter({
  subsets: ["latin"],
  style: "italic",
  weight: "400",
  variable: "--font-serif",
  display: "swap",
});

export const metadata: Metadata = {
  title: "GOSBROS. | High-Efficiency Architecture & Visual Identity",
  description: "High-Efficiency Architecture & Visual Identity based in Mexico City.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body
        className={`${interSans.variable} ${interDisplay.variable} ${interSerif.variable} min-h-full font-sans selection:bg-black selection:text-white`}
      >
        <LanguageProvider>
          <CustomCursor />
          <Navbar />
          <main className="flex-grow">
            {children}
          </main>
        </LanguageProvider>
      </body>
    </html>
  );
}
