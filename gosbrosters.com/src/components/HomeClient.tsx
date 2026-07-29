"use client";

import Image from "next/image";
import { useState } from "react";
import MaskReveal from "@/components/MaskReveal";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import QuoteCalculator from "@/components/QuoteCalculator";
import { useLanguage } from "@/components/LanguageContext";

export default function HomeClient({ projects }: { projects: any[] }) {
  const { language, t } = useLanguage();
  
  const [activeDepartment, setActiveDepartment] = useState<'architecture' | 'design'>('architecture');

  // Filter projects by department, treating missing department as 'architecture'
  const departmentProjects = projects.filter(p => (p.department || 'architecture') === activeDepartment);
  
  // Get featured projects to show on home page for the active department
  const featuredProjects = departmentProjects.filter((p: any) => p.featured).slice(0, 2);

  return (
    <div className="flex flex-col min-h-screen">
      <Hero projects={projects} />

      {/* Featured Projects Section (AUGE Style) */}
      <section className="w-full bg-[#f4f4f4] py-[var(--spacing-8)] md:py-[var(--spacing-10)] px-[var(--spacing-4)] md:px-[var(--spacing-8)]">
        <div className="max-w-[1800px] mx-auto">
          {/* Top Text Section */}
          <div className="flex flex-col md:flex-row justify-between items-start mb-[var(--spacing-8)] md:mb-[var(--spacing-9)]">
            <div className="text-xs font-sans uppercase font-bold tracking-widest mb-[var(--spacing-6)] md:mb-0 leading-tight whitespace-pre-line">
              {t('home.locationTag')}
            </div>
            <div className="w-full md:w-[75%] flex flex-col items-end">
              <MaskReveal>
                <h2 className="text-h2 leading-[0.85] font-display font-black tracking-tighter uppercase text-left w-full whitespace-pre-line">
                  {t('home.heroTitle')}
                </h2>
              </MaskReveal>

              <div className="mt-[var(--spacing-6)] md:mt-[var(--spacing-7)] w-full flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                
                {/* Department Toggle */}
                <div className="inline-flex bg-gray-200 rounded-full p-1 self-start">
                  <button
                    onClick={() => setActiveDepartment('architecture')}
                    className={`px-6 py-2 rounded-full text-xs font-sans font-bold uppercase tracking-widest transition-all duration-300 ${activeDepartment === 'architecture' ? 'bg-black text-white shadow-md' : 'text-gray-500 hover:text-black'}`}
                  >
                    Arquitectura
                  </button>
                  <button
                    onClick={() => setActiveDepartment('design')}
                    className={`px-6 py-2 rounded-full text-xs font-sans font-bold uppercase tracking-widest transition-all duration-300 ${activeDepartment === 'design' ? 'bg-black text-white shadow-md' : 'text-gray-500 hover:text-black'}`}
                  >
                    Diseño y Estrategia
                  </button>
                </div>

                <a href="/about" className="text-xs md:text-sm font-sans font-bold flex items-center gap-2 hover:opacity-70 transition-opacity uppercase md:pr-12">
                  {t('home.moreAboutUs')} <span className="text-lg leading-none">&rarr;</span>
                </a>
              </div>
            </div>
          </div>

          {/* Projects Flex Layout */}
          <div className="flex flex-col md:flex-row gap-[var(--spacing-7)] md:gap-[var(--spacing-6)] w-full items-start">
            
            {featuredProjects.map((project, index) => {
              const isLarge = project.size === "large";
              const colClass = isLarge ? "w-full md:w-[65%]" : "w-full md:w-[35%]";
              const desc = language === 'es' ? project.desc_es : project.desc_en;
              const words = desc ? desc.split(' ') : [];
              const truncatedDesc = words.length > 25 ? words.slice(0, 25).join(' ') + '...' : desc;
              const hasMore = words.length > 25;
              
              return (
                <div 
                  key={project.id}
                  className={`${colClass} flex flex-col gap-4 group cursor-pointer`}
                  data-cursor-text={t('home.view')}
                  onClick={() => window.location.href = `/works/${project.id}`}
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
                      <h3 className="text-h3 font-display font-black tracking-tighter uppercase leading-[0.85]">
                        {language === 'es' ? project.title_es : project.title_en}
                      </h3>
                      <span className="font-sans font-bold text-xs md:text-sm">({project.year})</span>
                    </div>
                    <p className="font-serif italic text-gray-500 text-sm mb-3">
                      {language === 'es' ? project.category_es : project.category_en}
                    </p>
                    <p className={`font-sans text-body font-medium leading-[1.2] tracking-tight ${isLarge ? 'md:max-w-[75%]' : ''}`}>
                      {truncatedDesc}
                      {hasMore && (
                        <span className="ml-2 font-bold underline hover:opacity-70 transition-opacity whitespace-nowrap">
                          {language === 'es' ? 'Ver más' : 'Read more'}
                        </span>
                      )}
                    </p>
                  </div>
                </div>
              );
            })}

          </div>
        </div>
      </section>

      {/* Quotation Calculator Section */}
      <QuoteCalculator activeDepartment={activeDepartment} />

      <Footer />
    </div>
  );
}
