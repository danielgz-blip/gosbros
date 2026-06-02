"use client";

import { useLanguage } from "@/components/LanguageContext";
import projectsData from "@/data/projects.json";
import MaskReveal from "@/components/MaskReveal";
import Footer from "@/components/Footer";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function ProjectDetail() {
  const params = useParams();
  const { language, t } = useLanguage();
  
  const project = projectsData.find(p => p.id === params.id);
  
  if (!project) {
    return (
      <div className="min-h-screen flex flex-col bg-[#f4f4f4]">
        <div className="flex-grow flex items-center justify-center">
          <h1 className="font-display font-black text-6xl uppercase tracking-tighter">Project not found</h1>
        </div>
        <Footer />
      </div>
    );
  }

  const title = language === 'es' ? project.title_es : project.title_en;
  const category = language === 'es' ? project.category_es : project.category_en;
  const sector = language === 'es' ? project.sector_es : project.sector_en;
  const material = language === 'es' ? project.material_es : project.material_en;
  const costEthos = language === 'es' ? project.cost_ethos_es : project.cost_ethos_en;
  const desc = language === 'es' ? project.desc_es : project.desc_en;

  return (
    <div className="flex flex-col min-h-screen bg-[#f4f4f4]">
      {/* Hero Section */}
      <section className="w-full h-screen relative">
        {project.image.match(/\.(mp4|webm|mov)$/i) ? (
          <video src={project.image} autoPlay loop muted playsInline className="w-full h-full object-cover" />
        ) : (
          <img src={project.image} alt={title} className="w-full h-full object-cover" />
        )}
      </section>

      {/* Project Metadata */}
      <section className="w-full bg-white px-4 md:px-8 py-16 md:py-24 border-b border-black">
        <div className="max-w-[1800px] mx-auto flex flex-col lg:flex-row gap-12 lg:gap-24">
          {/* Left Col - Title & Desc */}
          <div className="w-full lg:w-1/2 flex flex-col gap-8">
            <MaskReveal>
              <h1 className="text-h2 font-display font-black tracking-tighter uppercase leading-[0.85] text-black whitespace-pre-line">
                {title}
              </h1>
            </MaskReveal>
            <p className="text-body font-sans text-gray-500 leading-[1.2] tracking-tight">
              {desc}
            </p>
          </div>
          
          {/* Right Col - Meta Details */}
          <div className="w-full lg:w-1/2 grid grid-cols-2 gap-x-8 gap-y-12 font-sans pt-4">
            <div className="flex flex-col gap-2">
              <span className="text-xs font-sans font-bold uppercase tracking-widest border-b border-black pb-2 mb-2">Year</span>
              <span className="text-sm md:text-lg text-black font-medium">{project.year}</span>
            </div>
            <div className="flex flex-col gap-2">
              <span className="text-xs font-sans font-bold uppercase tracking-widest border-b border-black pb-2 mb-2">{language === 'es' ? 'Categoría' : 'Category'}</span>
              <span className="text-sm md:text-lg text-black font-medium">{category}</span>
            </div>
            <div className="flex flex-col gap-2">
              <span className="text-xs font-sans font-bold uppercase tracking-widest border-b border-black pb-2 mb-2">Sector</span>
              <span className="text-sm md:text-lg text-black font-medium">{sector}</span>
            </div>
            <div className="flex flex-col gap-2">
              <span className="text-xs font-sans font-bold uppercase tracking-widest border-b border-black pb-2 mb-2">Material</span>
              <span className="text-sm md:text-lg text-black font-medium">{material}</span>
            </div>
            <div className="flex flex-col gap-2 col-span-2">
              <span className="text-xs font-sans font-bold uppercase tracking-widest border-b border-black pb-2 mb-2">Ethos</span>
              <span className="text-sm md:text-lg text-black font-medium">{costEthos}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Content Section */}
      {project.content && project.content.length > 0 && (
        <section className="w-full bg-[#f4f4f4] py-16 md:py-32 px-4 md:px-8">
          <div className="max-w-[1800px] mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-center">
              {(project.content as any[]).map((block, index) => {
                
                if (block.type === 'text') {
                  return (
                    <div key={block.id || index} className="w-full md:col-span-2 py-8 md:py-16">
                      <p className="font-serif text-[clamp(2rem,5vw,4rem)] leading-[1.1] tracking-tight text-center max-w-[1200px] mx-auto text-black">
                        {language === 'es' ? block.text_es : block.text_en}
                      </p>
                    </div>
                  );
                }

                if (block.type === 'media' && block.url) {
                  const isHorizontal = block.mediaFormat === 'horizontal';
                  const colSpanClass = isHorizontal ? 'md:col-span-2' : 'md:col-span-1';
                  const aspectClass = isHorizontal ? 'aspect-video' : 'aspect-[9/16]';
                  
                  return (
                    <div key={block.id || index} className={`w-full relative overflow-hidden bg-white border border-black group ${colSpanClass} ${aspectClass}`}>
                      {block.url.match(/\.(mp4|webm|mov)$/i) ? (
                        <video src={block.url} autoPlay loop muted playsInline className="w-full h-full object-cover" />
                      ) : (
                        <img src={block.url} alt={`${title} content ${index + 1}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-in-out" />
                      )}
                    </div>
                  );
                }

                return null;
              })}
            </div>
          </div>
        </section>
      )}

      {/* Next Project / Back to Works */}
      <section className="w-full bg-black text-white py-24 px-4 md:px-8 flex flex-col items-center justify-center cursor-pointer hover:bg-[#ff0080] transition-colors duration-500">
         <Link href="/works" className="w-full h-full flex items-center justify-center">
           <span className="font-display font-black text-[clamp(4rem,10vw,12rem)] uppercase tracking-tighter leading-[0.85] text-center">
              {language === 'es' ? 'VER MÁS PROYECTOS' : 'VIEW MORE WORKS'}
           </span>
         </Link>
      </section>

      <Footer />
    </div>
  );
}
