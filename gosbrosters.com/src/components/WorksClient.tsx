"use client";

import Image from "next/image";
import Link from "next/link";
import { useLanguage } from "@/components/LanguageContext";
import { useDepartment } from "@/components/DepartmentContext";
import MaskReveal from "@/components/MaskReveal";
import Footer from "@/components/Footer";

export default function WorksClient({ projects }: { projects: any[] }) {
  const { language, t } = useLanguage();
  const { department } = useDepartment();

  const departmentProjects = projects.filter(p => (p.department || 'architecture') === department);

  return (
    <div className="flex flex-col min-h-screen pt-32 md:pt-48 bg-[#f4f4f4]">
      {/* Title Section */}
      <section className="px-4 md:px-8 mb-16 md:mb-32">
        <div className="max-w-[1800px] mx-auto h-full flex flex-col justify-center">
          <MaskReveal>
            <h1 className="text-hero leading-[0.85] font-display font-black tracking-tighter uppercase text-left w-full">
              {t('works.title')}
            </h1>
          </MaskReveal>
        </div>
      </section>

      {/* Projects Grid Feed */}
      <section className="px-4 md:px-8 pb-32">
        <div className="max-w-[1800px] mx-auto flex flex-col gap-[var(--spacing-9)] md:gap-[var(--spacing-10)]">
          {departmentProjects.map((project, index) => {
            const isLarge = project.size === "large";
            
            return (
              <Link 
                href={`/works/${project.id}`}
                key={project.id} 
                className="w-full flex flex-col gap-4 group cursor-pointer"
                data-cursor-text={t('works.view')}
              >
                <div className={`relative w-full overflow-hidden bg-gray-200 aspect-[4/3] md:aspect-[16/9]`}>
                  <Image
                    src={project.image}
                    alt={language === 'es' ? project.title_es : project.title_en}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="100vw"
                  />
                </div>
                <div className="flex flex-col mt-2">
                  <div className="flex justify-between items-baseline mb-1">
                    <h3 className="text-h3 font-display font-black tracking-tighter uppercase leading-[0.85]">
                      {language === 'es' ? project.title_es : project.title_en}
                    </h3>
                    <span className="font-sans font-bold text-xs md:text-sm">({project.year})</span>
                  </div>
                    <p className="font-serif italic text-gray-500 text-sm">
                      {language === 'es' ? project.category_es : project.category_en}
                    </p>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      <Footer />
    </div>
  );
}
