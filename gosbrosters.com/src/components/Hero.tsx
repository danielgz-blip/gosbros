"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import MaskReveal from "@/components/MaskReveal";
import { useLanguage } from "@/components/LanguageContext";
import { useDepartment } from "@/components/DepartmentContext";

export default function Hero({ projects }: { projects: any[] }) {
  const { language } = useLanguage();
  const { department, setDepartment } = useDepartment();
  const containerRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  // Parallax for image: moves down half the speed of the scroll
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  
  // Darken overlay: opacity increases as we scroll down
  const opacity = useTransform(scrollYProgress, [0, 1], [0, 0.8]);

  const [step, setStep] = useState(0);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  // Only show projects from the active department (missing department = architecture)
  const slideshowProjects = projects
    .filter(p => (p.department || 'architecture') === department)
    .slice(0, 5);

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

  // Reset slideshow position when switching department
  const [slideshowDept, setSlideshowDept] = useState(department);
  if (slideshowDept !== department) {
    setSlideshowDept(department);
    setCurrentImageIndex(0);
  }

  useEffect(() => {
    if (slideshowProjects.length <= 1) return;
    
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % slideshowProjects.length);
    }, 4000); // Change image every 4 seconds

    return () => clearInterval(interval);
  }, [department, slideshowProjects.length]);

  return (
    <section ref={containerRef} className="relative w-full h-[100vh] bg-[#C4C4C4] overflow-hidden flex flex-col justify-center items-center">
      
      {/* Slideshow Container */}
      <motion.div 
        className="absolute inset-0 z-0 flex justify-center items-center"
        style={{ y }}
      >
        <AnimatePresence mode="popLayout">
          <motion.img
            key={currentImageIndex}
            src={slideshowProjects.length ? slideshowProjects[currentImageIndex % slideshowProjects.length]?.image : undefined}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full object-cover"
            alt={slideshowProjects.length ? slideshowProjects[currentImageIndex % slideshowProjects.length]?.title_en || "Project Hero" : "Project Hero"}
          />
        </AnimatePresence>
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
                <h1 className="text-[12vw] md:text-[14vw] leading-[0.8] font-display font-black tracking-tighter text-white uppercase text-center">
                  {language === 'es' ? 'ESTÁS EN' : 'WE ARE'}
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
                <div className="flex flex-col items-center">
                  <h1 className="text-[12vw] md:text-[14vw] leading-[0.8] font-logo tracking-tighter text-white uppercase text-center mb-8">
                    GOSBROS
                  </h1>
                  
                  {/* Department Toggle */}
                  <div className="inline-flex bg-white/20 backdrop-blur-md rounded-full p-1 pointer-events-auto">
                    <button
                      onClick={() => setDepartment('architecture')}
                      className={`px-6 py-2 rounded-full text-xs font-sans font-bold uppercase tracking-widest transition-all duration-300 ${department === 'architecture' ? 'bg-white text-black shadow-md' : 'text-white/70 hover:text-white'}`}
                    >
                      Arquitectura
                    </button>
                    <button
                      onClick={() => setDepartment('design')}
                      className={`px-6 py-2 rounded-full text-xs font-sans font-bold uppercase tracking-widest transition-all duration-300 ${department === 'design' ? 'bg-white text-black shadow-md' : 'text-white/70 hover:text-white'}`}
                    >
                      Diseño y Estrategia
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          
        </div>
      </div>

      <div className="absolute bottom-8 left-6 z-20 pointer-events-auto mix-blend-difference text-white">
        <MaskReveal delay={0.4}>
          <div className="flex items-center gap-4 text-xs uppercase font-sans font-bold tracking-widest">
            <span>Scroll</span>
            <div className="w-8 h-[1px] bg-white"></div>
          </div>
        </MaskReveal>
      </div>
    </section>
  );
}
