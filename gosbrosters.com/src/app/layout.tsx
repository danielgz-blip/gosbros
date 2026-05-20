import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Navbar from "@/components/Navbar";
import CustomCursor from "@/components/CustomCursor";
import { LanguageProvider } from "@/components/LanguageContext";

const neueMontreal = localFont({
  src: "../fonts/NeueMontreal-Medium.woff2",
  variable: "--font-sans",
  display: "swap",
});

const greed = localFont({
  src: "../fonts/Greed-Bold.woff2",
  weight: "700",
  style: "normal",
  variable: "--font-display",
  display: "swap",
});

const augeFarnham = localFont({
  src: "../fonts/AUGEFarnhamDisplay-Italic.woff2",
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
        className={`${neueMontreal.variable} ${greed.variable} ${augeFarnham.variable} min-h-full font-sans selection:bg-black selection:text-white`}
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
