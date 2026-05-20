"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { translations, Language } from './translations';

type LanguageContextType = {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => any;
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  // Default to Spanish
  const [language, setLanguageState] = useState<Language>('es');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem('gosbros-lang') as Language;
    if (saved === 'en' || saved === 'es') {
      setLanguageState(saved);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('gosbros-lang', lang);
  };

  // Helper to get nested translation keys (e.g., 'nav.works')
  const t = (key: string) => {
    if (!mounted) {
      // During SSR, return default (Spanish) text to avoid hydration mismatch
      const keys = key.split('.');
      let val: any = translations['es'];
      for (const k of keys) {
        val = val[k];
        if (val === undefined) break;
      }
      return val || key;
    }
    
    const keys = key.split('.');
    let val: any = translations[language];
    for (const k of keys) {
      val = val[k];
      if (val === undefined) break;
    }
    return val || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
