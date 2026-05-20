"use client";

import Image from "next/image";
import { useLanguage } from "@/components/LanguageContext";
import MaskReveal from "@/components/MaskReveal";
import Footer from "@/components/Footer";
import projects from "@/data/projects.json";

export default function WorksPage() {
  const { language, t } = useLanguage();

  return (
    <div className="flex flex-col min-h-screen pt-32 md:pt-48 bg-[#f4f4f4]">
      {/* Title Section */}
      <section className="px-4 md:px-8 mb-16 md:mb-32">
        <div className="max-w-[1800px] mx-auto h-full flex flex-col justify-center">
          <MaskReveal>
            <h1 className="text-[var(--font-size-hero)] leading-[0.85] font-sans font-black tracking-tighter uppercase text-left w-full">
              {t('works.title')}
            </h1>
          </MaskReveal>
        </div>
      </section>

      {/* Projects Grid Feed */}
      <section className="px-4 md:px-8 pb-32">
        <div className="max-w-[1800px] mx-auto flex flex-wrap gap-y-24 md:gap-y-32 justify-between">
          {projects.map((project, index) => {
            const isLarge = project.size === "large";
            const colClass = isLarge ? "w-full md:w-[65%]" : "w-full md:w-[30%]";
            
            return (
              <div 
                key={project.id} 
                className={`${colClass} flex flex-col gap-4 group cursor-pointer`}
                data-cursor-text={t('works.view')}
              >
                <div className={`relative w-full overflow-hidden bg-gray-200 ${isLarge ? 'aspect-[4/3] md:aspect-[16/10]' : 'aspect-[4/3]'}`}>
                  <Image
                    src={project.image}
                    alt={language === 'es' ? project.title_es : project.title_en}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 65vw"
                  />
                </div>
                <div className="flex flex-col mt-2">
                  <div className="flex justify-between items-baseline mb-1">
                    <h3 className="font-sans font-bold text-sm md:text-base uppercase tracking-tight">
                      {language === 'es' ? project.title_es : project.title_en}
                    </h3>
                    <span className="font-sans font-bold text-xs md:text-sm">({project.year})</span>
                  </div>
                  <p className="font-serif italic text-gray-500 text-sm mb-3">
                    {language === 'es' ? project.category_es : project.category_en}
                  </p>
                  <p className={`font-sans text-[var(--font-size-body)] font-medium leading-[1.2] tracking-tight ${isLarge ? 'md:max-w-[75%]' : ''}`}>
                    {language === 'es' ? project.desc_es : project.desc_en}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <Footer />
    </div>
  );
}
