"use client";

import { useState } from "react";
import Link from "next/link";
import { useLanguage } from "@/components/LanguageContext";
import MaskReveal from "@/components/MaskReveal";
import Footer from "@/components/Footer";
import projects from "@/data/projects.json";

type FilterType = 'All' | 'Architecture' | 'Branding';

export default function ArchivePage() {
  const { language, t } = useLanguage();
  const [filter, setFilter] = useState<FilterType>('All');

  const filteredProjects = projects.filter(p => {
    if (filter === 'All') return true;
    if (filter === 'Architecture') return p.category_en.includes('Architecture');
    if (filter === 'Branding') return p.category_en.includes('Branding') || p.category_en.includes('Identity');
    return true;
  });

  return (
    <div className="flex flex-col min-h-screen pt-32 md:pt-48 bg-[#f4f4f4]">
      {/* Title Section */}
      <section className="px-4 md:px-8 mb-16 md:mb-32">
        <div className="max-w-[1800px] mx-auto h-full flex flex-col md:flex-row justify-between md:items-end gap-8">
          <MaskReveal>
            <h1 className="text-hero leading-[0.85] font-display font-black tracking-tighter uppercase text-left">
              {t('archive.title')}
            </h1>
          </MaskReveal>
          
          <div className="flex gap-4 font-sans text-xs uppercase font-bold tracking-widest pb-4">
            <button 
              onClick={() => setFilter('All')} 
              className={`hover:opacity-100 transition-opacity ${filter === 'All' ? 'opacity-100 border-b border-black' : 'opacity-40'}`}
              data-cursor-hover
            >
              {t('archive.filterAll')}
            </button>
            <button 
              onClick={() => setFilter('Architecture')} 
              className={`hover:opacity-100 transition-opacity ${filter === 'Architecture' ? 'opacity-100 border-b border-black' : 'opacity-40'}`}
              data-cursor-hover
            >
              {t('archive.filterArchitecture')}
            </button>
            <button 
              onClick={() => setFilter('Branding')} 
              className={`hover:opacity-100 transition-opacity ${filter === 'Branding' ? 'opacity-100 border-b border-black' : 'opacity-40'}`}
              data-cursor-hover
            >
              {t('archive.filterBranding')}
            </button>
          </div>
        </div>
      </section>

      {/* Ledger Table */}
      <section className="px-4 md:px-8 pb-32">
        <div className="max-w-[1800px] mx-auto w-full">
          {/* Table Header (Hidden on small mobile) */}
          <div className="hidden md:flex w-full border-t border-b border-black py-4 uppercase font-sans text-xs font-bold tracking-widest text-gray-500">
            <div className="w-[30%]">{t('archive.colTitle')}</div>
            <div className="w-[20%]">{t('archive.colDiscipline')}</div>
            <div className="w-[25%]">{t('archive.colMaterial')}</div>
            <div className="w-[20%]">{t('archive.colEthos')}</div>
            <div className="w-[5%] text-right">{t('archive.colYear')}</div>
          </div>

          {/* Table Rows */}
          <div className="flex flex-col">
            {filteredProjects.map((project, i) => (
              <Link 
                href={`/works/${project.id}`}
                key={project.id} 
                className="flex flex-col md:flex-row w-full border-b border-[#c0c0c0] py-6 md:py-4 md:items-center hover:bg-white transition-colors cursor-pointer group"
                data-cursor-text={t('works.view')}
              >
                <div className="w-full md:w-[30%] font-sans font-bold text-lg md:text-base uppercase mb-2 md:mb-0 group-hover:pl-2 transition-all">
                  {language === 'es' ? project.title_es : project.title_en}
                </div>
                <div className="w-full md:w-[20%] font-serif italic text-sm text-gray-600 mb-1 md:mb-0">
                  {language === 'es' ? project.category_es : project.category_en}
                </div>
                <div className="w-full md:w-[25%] font-sans text-sm mb-1 md:mb-0">
                  {language === 'es' ? project.material_es : project.material_en}
                </div>
                <div className="w-full md:w-[20%] font-sans text-sm mb-1 md:mb-0">
                  {language === 'es' ? project.cost_ethos_es : project.cost_ethos_en}
                </div>
                <div className="w-full md:w-[5%] font-sans font-bold text-sm text-left md:text-right text-gray-400 mt-2 md:mt-0">
                  {project.year}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
