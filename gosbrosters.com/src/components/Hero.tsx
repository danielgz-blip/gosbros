"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import MaskReveal from "@/components/MaskReveal";

export default function Hero() {
  const containerRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  // Parallax for video: moves down half the speed of the scroll
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  
  // Darken overlay: opacity increases as we scroll down
  const opacity = useTransform(scrollYProgress, [0, 1], [0, 0.8]);

  const [step, setStep] = useState(0);

  useEffect(() => {
    const t1 = setTimeout(() => setStep(1), 500);     // Show "WE ARE"
    const t2 = setTimeout(() => setStep(2), 2200);    // Hide "WE ARE"
    const t3 = setTimeout(() => setStep(3), 3000);    // Show "GOSBROS" on the left third
    
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, []);

  return (
    <section ref={containerRef} className="relative w-full h-[100vh] bg-[#C4C4C4] overflow-hidden flex flex-col justify-center items-center">
      
      {/* Video Container */}
      <motion.div 
        className="absolute inset-0 z-0 flex justify-center items-center"
        style={{ y }}
      >
        <div className="relative w-[85%] sm:w-[70%] aspect-video md:w-full md:h-full md:aspect-auto overflow-hidden pointer-events-none mx-auto mt-20 md:mt-0 shadow-2xl md:shadow-none">
          <iframe
            src="https://player.vimeo.com/video/1050113072?background=1&autoplay=1&loop=1&byline=0&title=0&muted=1"
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full md:w-[100vw] md:h-[56.25vw] md:min-h-[100vh] md:min-w-[177.77vh]"
            frameBorder="0"
            allow="autoplay; fullscreen; picture-in-picture"
          ></iframe>
        </div>
      </motion.div>

      {/* Darkening Overlay */}
      <motion.div 
        className="absolute inset-0 z-10 bg-black pointer-events-none"
        style={{ opacity }}
      />

      {/* Content */}
      <div className="absolute inset-0 z-20 pointer-events-none px-4 md:px-12">
        <div className="w-full max-w-[1800px] mx-auto relative h-full">
          
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="we-are"
                initial={{ y: 40, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -40, opacity: 0 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full flex justify-center overflow-hidden"
              >
                <h1 className="text-[12vw] md:text-[14vw] leading-[0.8] font-display tracking-tighter text-white uppercase text-center">
                  WE ARE
                </h1>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="gosbros"
                initial={{ y: 40, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="absolute top-[25vh] left-0 w-full flex justify-center overflow-hidden"
              >
                <h1 className="text-[12vw] md:text-[14vw] leading-[0.8] font-logo tracking-tighter text-white uppercase text-center">
                  GOSBROS
                </h1>
              </motion.div>
            )}
          </AnimatePresence>
          
        </div>
      </div>

      <div className="absolute bottom-8 left-6 z-20 pointer-events-auto mix-blend-difference text-white">
        <MaskReveal delay={0.4}>
          <div className="flex items-center gap-4 text-[11px] uppercase font-sans tracking-widest">
            <span>Scroll</span>
            <div className="w-8 h-[1px] bg-white"></div>
          </div>
        </MaskReveal>
      </div>
    </section>
  );
}
