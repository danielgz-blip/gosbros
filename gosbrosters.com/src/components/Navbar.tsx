"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "./LanguageContext";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { language, setLanguage, t } = useLanguage();

  const toggleLanguage = () => {
    setLanguage(language === 'es' ? 'en' : 'es');
  };

  return (
    <>
      <nav className="fixed top-0 left-0 w-full z-40 px-6 py-6 flex justify-between items-center text-white mix-blend-difference font-sans uppercase text-xs tracking-widest pointer-events-none">
        <div className="flex items-center gap-8 md:gap-12 pointer-events-auto">
          <Link href="/" className="flex items-center" data-cursor-hover>
            <Image 
              src="/gosbros-logo.svg" 
              alt="GOSBROS Logo" 
              width={123} 
              height={35} 
              className="h-[32px] w-auto"
            />
          </Link>
          <div className="hidden md:flex gap-6 text-xs">
            <Link href="/works" className="hover:opacity-60 transition-opacity" data-cursor-hover>{t('nav.works')}</Link>
            <Link href="/about" className="hover:opacity-60 transition-opacity" data-cursor-hover>{t('nav.about')}</Link>
            <Link href="/archive" className="hover:opacity-60 transition-opacity" data-cursor-hover>{t('nav.archive')}</Link>
          </div>
        </div>
        
        <div className="pointer-events-auto flex items-center gap-6 text-xs">
          {/* Language Toggle */}
          <button 
            onClick={toggleLanguage}
            className="hidden md:flex items-center gap-2 font-sans text-xs uppercase font-bold tracking-widest hover:opacity-80 transition-opacity"
            data-cursor-hover
          >
            <span className={language === 'es' ? 'opacity-100' : 'opacity-30 line-through'}>ES</span>
            <span>/</span>
            <span className={language === 'en' ? 'opacity-100' : 'opacity-30 line-through'}>EN</span>
          </button>

          {/* Desktop Get In Touch */}
          <Link 
            href="/contact" 
            className="hidden md:inline-flex items-center relative group"
            data-cursor-hover
          >
            <span>{t('nav.getInTouch')}</span>
            <span className="absolute left-0 bottom-[2px] w-full h-[1px] bg-white transform origin-left transition-transform duration-300 group-hover:scale-x-0"></span>
          </Link>

          {/* Mobile Menu Toggle */}
          <button 
            className="md:hidden hover:opacity-60 transition-opacity uppercase font-display tracking-widest"
            onClick={() => setIsOpen(true)}
            data-cursor-hover
          >
            {t('nav.menu')}
          </button>
        </div>
      </nav>

      {/* Fullscreen Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: "-100%" }}
            animate={{ opacity: 1, y: "0%" }}
            exit={{ opacity: 0, y: "-100%" }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-50 bg-black text-white px-6 py-6 flex flex-col"
          >
            {/* Menu Header — 3-column grid to center ES/EN */}
            <div className="grid grid-cols-3 items-center font-sans uppercase text-xs tracking-widest">
              <Link href="/" onClick={() => setIsOpen(false)} className="flex items-center" data-cursor-hover>
                <Image 
                  src="/gosbros-logo.svg" 
                  alt="GOSBROS Logo" 
                  width={123} 
                  height={35} 
                  className="h-[28px] w-auto"
                />
              </Link>
              {/* Language toggle — perfectly centred */}
              <div className="flex justify-center">
                <button 
                  onClick={toggleLanguage}
                  className="flex items-center gap-2 font-sans text-xs uppercase font-bold tracking-widest hover:opacity-80 transition-opacity"
                  data-cursor-hover
                >
                  <span className={language === 'es' ? 'opacity-100' : 'opacity-30 line-through'}>ES</span>
                  <span>/</span>
                  <span className={language === 'en' ? 'opacity-100' : 'opacity-30 line-through'}>EN</span>
                </button>
              </div>
              {/* Close button — right-aligned */}
              <div className="flex justify-end">
                <button 
                  onClick={() => setIsOpen(false)}
                  className="hover:opacity-60 transition-opacity uppercase"
                  data-cursor-hover
                >
                  {t('nav.close')}
                </button>
              </div>
            </div>

            {/* Menu Links */}
            <div className="flex-1 flex flex-col justify-center items-center gap-1 text-[12vw] sm:text-7xl uppercase">
              <Link 
                href="/works" 
                onClick={() => setIsOpen(false)}
                className="font-display font-black hover:opacity-60 transition-opacity leading-none py-2"
                data-cursor-hover
              >
                {t('nav.works')}
              </Link>
              <Link 
                href="/about" 
                onClick={() => setIsOpen(false)}
                className="font-display font-black hover:opacity-60 transition-opacity leading-none py-2"
                data-cursor-hover
              >
                {t('nav.about')}
              </Link>
              <Link 
                href="/archive" 
                onClick={() => setIsOpen(false)}
                className="font-display font-black hover:opacity-60 transition-opacity leading-none py-2"
                data-cursor-hover
              >
                {t('nav.archive')}
              </Link>
              <Link 
                href="/contact" 
                onClick={() => setIsOpen(false)}
                className="font-serif italic lowercase text-[10vw] sm:text-6xl hover:opacity-60 transition-opacity leading-none py-2"
                data-cursor-hover
              >
                {t('nav.contact')}
              </Link>
            </div>

            {/* Menu Footer */}
            <div className="flex justify-between items-center text-xs uppercase font-sans font-bold tracking-widest">
              <Link href="#" className="hover:opacity-60 transition-opacity" data-cursor-hover>Linkedin</Link>
              <Link href="#" className="hover:opacity-60 transition-opacity" data-cursor-hover>Instagram</Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
