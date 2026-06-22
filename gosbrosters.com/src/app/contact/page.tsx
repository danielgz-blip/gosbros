"use client";

import MaskReveal from "@/components/MaskReveal";
import Footer from "@/components/Footer";
import { useLanguage } from "@/components/LanguageContext";

export default function ContactPage() {
  const { t } = useLanguage();

  return (
    <div className="flex flex-col min-h-screen pt-32 md:pt-48 bg-[#f4f4f4]">
      {/* Title Section */}
      <section className="px-4 md:px-8 mb-16 md:mb-32 flex-grow">
        <div className="max-w-[1800px] mx-auto h-full flex flex-col justify-center">
          <MaskReveal>
            <h1 className="text-hero leading-[0.85] font-display font-black tracking-tighter uppercase text-left w-full mb-12 md:mb-24 whitespace-pre-line">
              {t('contact.title')}
            </h1>
          </MaskReveal>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-8">
             <div className="text-xs font-sans uppercase font-bold tracking-widest leading-tight">
               {t('contact.getInTouch')}
             </div>
             
             <div className="flex flex-col gap-8 font-display uppercase text-h3 tracking-tight">
               <a 
                 href="mailto:business@gosbrosters.com" 
                 className="flex items-center justify-between border-b border-black pb-4 hover:text-gray-500 transition-colors group"
                 data-cursor-hover
               >
                 <span>business@gosbrosters.com</span>
                 <span className="font-serif italic text-xl group-hover:translate-x-2 transition-transform">&rarr;</span>
               </a>
               <a 
                 href="mailto:jobs@gosbrosters.com" 
                 className="flex items-center justify-between border-b border-black pb-4 hover:text-gray-500 transition-colors group"
                 data-cursor-hover
               >
                 <span>jobs@gosbrosters.com</span>
                 <span className="font-serif italic text-xl group-hover:translate-x-2 transition-transform">&rarr;</span>
               </a>
               <a 
                 href="mailto:info@gosbrosters.com" 
                 className="flex items-center justify-between border-b border-black pb-4 hover:text-gray-500 transition-colors group"
                 data-cursor-hover
               >
                 <span>info@gosbrosters.com</span>
                 <span className="font-serif italic text-xl group-hover:translate-x-2 transition-transform">&rarr;</span>
               </a>
             </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
