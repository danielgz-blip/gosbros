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

  const valuesList = t('about.valuesList') as { title: string, desc: string }[];

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
            <div className="relative" style={{ height: 'clamp(6rem, 26vw, 32rem)' }}>
              <AnimatePresence mode="wait">
                <motion.h1 
                  key={phraseIndex}
                  initial={{ y: 40, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -40, opacity: 0 }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                  className="absolute inset-0 text-hero font-display font-black tracking-tighter uppercase text-left w-full text-white"
                  style={{ whiteSpace: "pre-line", lineHeight: '0.85' }}
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
            <div className="text-xs font-sans uppercase font-bold tracking-widest leading-tight whitespace-pre-line">
               {t('about.capabilitiesTag')}
            </div>
          </div>
          
          {/* Content Column */}
          <div className="w-full md:w-[65%]">
            <h2 className="text-h2 font-display font-black tracking-tighter uppercase leading-[0.85] mb-8 whitespace-pre-line">
              {t('about.mainText').split('\n')[0]}
            </h2>
            <p className="text-gray-3 mb-12 whitespace-pre-line">
              {t('about.mainText').split('\n')[2]}
            </p>
            <p className="whitespace-pre-line">
              {t('about.tags')}
            </p>
          </div>
        </div>
      </section>

      <section className="w-full bg-white py-16 md:py-32 px-4 md:px-8 border-t border-black">
        <div className="max-w-[1800px] mx-auto flex flex-col md:flex-row justify-between gap-8 md:gap-12">
          {/* Label Column */}
          <div className="w-full md:w-[35%]">
            <div className="text-xs font-sans uppercase font-bold tracking-widest leading-tight whitespace-pre-line">
               {t('about.valuesLabel')}
            </div>
          </div>
          
          {/* Content Column */}
          <div className="w-full md:w-[65%]">
            <h2 className="text-h2 font-display font-black tracking-tighter uppercase text-black leading-[0.85] mb-16 whitespace-pre-line">
              {t('about.valuesTitle')}
            </h2>
            
            <div className="flex flex-col gap-12 border-t border-black pt-12">
              {valuesList.map((val, idx) => (
                <div key={idx} className="flex flex-col md:flex-row gap-4 md:gap-8">
                  <div className="w-full md:w-1/3">
                    <h3 className="text-xs font-sans font-bold uppercase tracking-widest leading-tight">{val.title}</h3>
                  </div>
                  <div className="w-full md:w-2/3">
                    <p className="text-body text-gray-3 leading-[1.2] tracking-tight font-medium">
                      {val.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
