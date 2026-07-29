import type { Metadata } from "next";
import { Roboto_Flex, Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import CustomCursor from "@/components/CustomCursor";
import { LanguageProvider } from "@/components/LanguageContext";
import { DepartmentProvider } from "@/components/DepartmentContext";

const robotoFlexSans = Roboto_Flex({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const robotoFlexDisplay = Roboto_Flex({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const robotoFlexSerif = Roboto_Flex({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
});

const interLogo = Inter({
  subsets: ["latin"],
  weight: "900",
  variable: "--font-logo",
  display: "swap",
});

export const metadata: Metadata = {
  title: "GOSBROS | High-Efficiency Architecture & Visual Identity",
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
        className={`${robotoFlexSans.variable} ${robotoFlexDisplay.variable} ${robotoFlexSerif.variable} ${interLogo.variable} min-h-full font-sans selection:bg-black selection:text-white`}
      >
        <DepartmentProvider>
          <LanguageProvider>
            <CustomCursor />
            <Navbar />
            <main className="flex-grow">
              {children}
            </main>
          </LanguageProvider>
        </DepartmentProvider>
      </body>
    </html>
  );
}
