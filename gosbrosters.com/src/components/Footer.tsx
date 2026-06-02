"use client";

import MaskReveal from "./MaskReveal";
import { useLanguage } from "./LanguageContext";

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="w-full bg-black text-white px-4 pt-20 pb-4 overflow-hidden">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-20 text-[12.54px] uppercase text-gray-400">
        <div className="flex flex-col gap-2">
          <span className="text-white">{t('footer.social')}</span>
          <a href="#" className="hover:text-white transition-colors">Instagram</a>
          <a href="#" className="hover:text-white transition-colors">LinkedIn</a>
          <a href="#" className="hover:text-white transition-colors">Twitter</a>
        </div>
        <div className="flex flex-col gap-2">
          <span className="text-white">{t('footer.links')}</span>
          <a href="#" className="hover:text-white transition-colors">{t('footer.privacyPolicy')}</a>
          <a href="#" className="hover:text-white transition-colors">{t('footer.termsOfService')}</a>
        </div>
        <div className="flex flex-col gap-2 md:col-start-4 text-right">
          <span className="text-white">{t('footer.location')}</span>
          <span>{t('footer.city')}</span>
          <span>&copy; 2026 GOSBROS</span>
        </div>
      </div>
      
      <div className="w-full">
        <MaskReveal className="w-full">
          <h2 className="text-[15vw] md:text-[20vw] leading-[0.8] font-logo text-white tracking-tighter text-center">
            GOSBROS
          </h2>
        </MaskReveal>
      </div>
    </footer>
  );
}
