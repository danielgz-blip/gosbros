"use client";

import { useState, useEffect } from "react";
import MaskReveal from "@/components/MaskReveal";
import Footer from "@/components/Footer";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/components/LanguageContext";

export default function AboutPage() {
  const { t } = useLanguage();
  const phrases = t('about.phrases') as string[];
  const [phraseIndex, setPhraseIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setPhraseIndex((prev) => (prev + 1) % phrases.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [phrases.length]);

  return (
    <div className="flex flex-col min-h-screen bg-[#f4f4f4]">
      {/* Title Section (Full Page Header) */}
      <section className="relative w-full h-screen flex flex-col justify-center px-4 md:px-8 overflow-hidden">
        {/* Animated Gradient Background */}
        <motion.div 
          className="absolute inset-0 z-0"
          style={{ background: "linear-gradient(45deg, #ff0080, #ff8c00, #40e0d0)" }}
          animate={{
            filter: ["hue-rotate(0deg)", "hue-rotate(360deg)"],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "linear"
          }}
        />

        <div className="max-w-[1800px] w-full mx-auto relative z-10 flex flex-col justify-center h-full">
          <div className="flex-grow flex flex-col justify-center">
            <div className="h-[24vw] md:h-[22vw] relative">
              <AnimatePresence mode="wait">
                <motion.h1 
                  key={phraseIndex}
                  initial={{ y: 40, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -40, opacity: 0 }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                  className="absolute inset-0 text-[var(--font-size-hero)] leading-[0.85] font-sans font-black tracking-tighter uppercase text-left w-full text-white mix-blend-difference"
                  style={{ whiteSpace: "pre-line" }}
                >
                  {phrases[phraseIndex]}
                </motion.h1>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </section>

      <section className="w-full bg-white py-16 md:py-32 px-4 md:px-8 border-t border-black">
        <div className="max-w-[1800px] mx-auto flex flex-col md:flex-row justify-between gap-8 md:gap-12">
          {/* Label Column */}
          <div className="w-full md:w-[35%]">
            <div className="text-[10px] md:text-xs font-sans uppercase font-bold tracking-widest leading-tight whitespace-pre-line">
               {t('about.capabilitiesTag')}
            </div>
          </div>
          
          {/* Content Column */}
          <div className="w-full md:w-[65%]">
            <h2 className="font-sans text-[var(--font-size-h3)] leading-[1.1] font-medium tracking-tight mb-8 text-black whitespace-pre-line">
              {t('about.mainText').split('\n')[0]}
            </h2>
            <p className="font-sans text-[var(--font-size-body)] text-[#999] leading-[1.2] tracking-tight mb-12 whitespace-pre-line">
              {t('about.mainText').split('\n')[2]}
            </p>
            <p className="font-sans text-xl md:text-3xl text-black leading-[1.2] tracking-tight">
              {t('about.tags')}
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
