"use client";

import Image from "next/image";
import MaskReveal from "@/components/MaskReveal";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import { useLanguage } from "@/components/LanguageContext";
import projects from "@/data/projects.json";

export default function Home() {
  const { language, t } = useLanguage();
  
  // Get featured projects to show on home page
  const featuredProjects = projects.filter(p => p.featured).slice(0, 2);

  return (
    <div className="flex flex-col min-h-screen">
      <Hero />

      {/* Featured Projects Section (AUGE Style) */}
      <section className="w-full bg-[#f4f4f4] py-16 md:py-32 px-4 md:px-8">
        <div className="max-w-[1800px] mx-auto">
          {/* Top Text Section */}
          <div className="flex flex-col md:flex-row justify-between items-start mb-16 md:mb-24">
            <div className="text-xs font-sans uppercase font-bold tracking-widest mb-8 md:mb-0 leading-tight whitespace-pre-line">
              {t('home.locationTag')}
            </div>
            <div className="w-full md:w-[75%] flex flex-col items-end">
              <MaskReveal>
                <h2 className="text-[var(--font-size-hero)] leading-[0.85] font-display font-black tracking-tighter uppercase text-left w-full whitespace-pre-line">
                  {t('home.heroTitle')}
                </h2>
              </MaskReveal>
              <div className="mt-8 md:mt-12 w-full flex justify-end md:pr-12">
                <a href="/about" className="text-xs md:text-sm font-sans font-bold flex items-center gap-2 hover:opacity-70 transition-opacity uppercase">
                  {t('home.moreAboutUs')} <span className="text-lg leading-none">&rarr;</span>
                </a>
              </div>
            </div>
          </div>

          {/* Projects Flex Layout */}
          <div className="flex flex-col md:flex-row gap-12 md:gap-8 w-full items-start">
            
            {featuredProjects.map((project, index) => {
              const isLarge = project.size === "large";
              const colClass = isLarge ? "w-full md:w-[65%]" : "w-full md:w-[35%]";
              
              return (
                <div 
                  key={project.id}
                  className={`${colClass} flex flex-col gap-4 group cursor-pointer`}
                  data-cursor-text={t('home.view')}
                >
                  <div className={`relative w-full overflow-hidden bg-gray-200 ${isLarge ? 'aspect-[4/3] md:aspect-[16/10]' : 'aspect-[4/3]'}`}>
                    <Image
                      src={project.image}
                      alt={language === 'es' ? project.title_es : project.title_en}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                      sizes={isLarge ? "(max-width: 768px) 100vw, 65vw" : "(max-width: 768px) 100vw, 35vw"}
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
        </div>
      </section>

      {/* Mission / Statement Section */}
      <section className="py-[var(--spacing-6)] px-4 bg-white grid-line border-black">
        <div className="max-w-4xl mx-auto">
          <MaskReveal>
            <h2 className="text-[var(--font-size-h2)] font-display font-black tracking-tighter leading-[0.9] mb-[var(--spacing-4)] whitespace-pre-line">
              {t('home.missionTitle1')} <br />
              <span className="text-gray-400">{t('home.missionTitle2')}</span>
            </h2>
          </MaskReveal>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-[var(--spacing-4)] mt-[var(--spacing-6)]">
            <p className="text-[var(--font-size-body)] text-gray-600">
              {t('home.missionText')}
            </p>
            <div className="flex flex-col gap-[var(--spacing-3)]">
              <div className="flex justify-between items-center py-[var(--spacing-2)] grid-line-light uppercase text-xs font-sans font-bold tracking-widest">
                <span>{t('home.strategy')}</span>
                <span className="font-serif">01</span>
              </div>
              <div className="flex justify-between items-center py-[var(--spacing-2)] grid-line-light uppercase text-xs font-sans font-bold tracking-widest">
                <span>{t('home.architecture')}</span>
                <span className="font-serif">02</span>
              </div>
              <div className="flex justify-between items-center py-[var(--spacing-2)] grid-line-light uppercase text-xs font-sans font-bold tracking-widest">
                <span>{t('home.branding')}</span>
                <span className="font-serif">03</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
