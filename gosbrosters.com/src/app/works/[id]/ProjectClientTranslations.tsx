"use client";

import { useLanguage } from "@/components/LanguageContext";
import MaskReveal from "@/components/MaskReveal";
import Link from "next/link";
import { motion } from "framer-motion";

export default function ProjectClientTranslations({ project }: { project: any }) {
  const { language } = useLanguage();

  const title = language === "es" ? project.title_es : project.title_en;
  const category = language === "es" ? project.category_es : project.category_en;
  const sector = language === "es" ? project.sector_es : project.sector_en;
  const material = language === "es" ? project.material_es : project.material_en;
  const costEthos = language === "es" ? project.cost_ethos_es : project.cost_ethos_en;
  const desc = language === "es" ? project.desc_es : project.desc_en;

  const backText = language === "es" ? "VOLVER A PROYECTOS" : "BACK TO WORKS";
  const relatedText = language === "es" ? "RELACIONADOS" : "RELATED";

  return (
    <div className="flex flex-col w-full">
      {/* Hero Header */}
      <section className="w-full h-screen relative flex flex-col justify-end">
        <div 
          className="absolute inset-0 z-0 bg-center bg-cover bg-no-repeat"
          style={{ backgroundImage: `url(${project.image})` }}
        />
        <div className="absolute inset-0 bg-black/30 z-0" />
        <div className="relative z-10 px-4 md:px-8 pb-16 md:pb-32 w-full max-w-[1800px] mx-auto">
          <MaskReveal>
            <h1 className="text-[clamp(3rem,10vw,12rem)] leading-[0.85] font-display font-black tracking-tighter uppercase text-white">
              {title}
            </h1>
          </MaskReveal>
        </div>
      </section>

      {/* Project Info Bar */}
      <section className="w-full bg-white border-b border-black">
        <div className="max-w-[1800px] mx-auto px-4 md:px-8 py-12 md:py-16 grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12">
          
          {/* Metadata */}
          <div className="col-span-1 md:col-span-1 flex flex-col gap-6 font-sans">
            <div>
              <p className="text-[10px] uppercase font-bold tracking-widest text-gray-500 mb-1">Year</p>
              <p className="text-sm md:text-base font-medium">{project.year}</p>
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold tracking-widest text-gray-500 mb-1">Discipline</p>
              <p className="text-sm md:text-base font-medium">{category}</p>
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold tracking-widest text-gray-500 mb-1">Sector</p>
              <p className="text-sm md:text-base font-medium">{sector}</p>
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold tracking-widest text-gray-500 mb-1">Material</p>
              <p className="text-sm md:text-base font-medium">{material}</p>
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold tracking-widest text-gray-500 mb-1">Cost Ethos</p>
              <p className="text-sm md:text-base font-medium">{costEthos}</p>
            </div>
          </div>

          {/* Description */}
          <div className="col-span-1 md:col-span-3">
            <p className="text-xl md:text-3xl lg:text-5xl font-sans text-black leading-[1.1] tracking-tight font-medium">
              {desc}
            </p>
          </div>
        </div>
      </section>

      {/* Media Gallery */}
      {project.gallery && project.gallery.length > 0 && (
        <section className="w-full bg-[#f4f4f4] py-8 md:py-16 px-4 md:px-8">
          <div className="max-w-[1800px] mx-auto">
            {/* Desktop 2-column, Mobile 1-column stacked */}
            <div className="columns-1 md:columns-2 gap-8 md:gap-12 space-y-8 md:space-y-12">
              {project.gallery.map((mediaUrl: string, idx: number) => {
                // If it's a video file, render video tag. Else img.
                const isVideo = mediaUrl.match(/\.(mp4|webm|ogg)$/i) || mediaUrl.includes('vimeo') || mediaUrl.includes('youtube');
                
                return (
                  <div key={idx} className="break-inside-avoid w-full">
                    {isVideo && !mediaUrl.includes('vimeo') && !mediaUrl.includes('youtube') ? (
                      <video 
                        src={mediaUrl} 
                        autoPlay 
                        muted 
                        loop 
                        playsInline 
                        className="w-full h-auto object-cover border border-black shadow-lg"
                      />
                    ) : isVideo && (mediaUrl.includes('vimeo') || mediaUrl.includes('youtube')) ? (
                      <div className="w-full aspect-video border border-black shadow-lg">
                        <iframe src={mediaUrl} className="w-full h-full" frameBorder="0" allow="autoplay; fullscreen; picture-in-picture" allowFullScreen></iframe>
                      </div>
                    ) : (
                      <img 
                        src={mediaUrl} 
                        alt={`${title} Gallery Image ${idx + 1}`} 
                        className="w-full h-auto object-cover shadow-lg"
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Navigation Footer */}
      <section className="w-full bg-white border-t border-black px-4 md:px-8 py-16 md:py-32 flex flex-col items-center">
        <Link 
          href="/works" 
          className="inline-block bg-black text-white px-8 md:px-12 py-4 md:py-6 uppercase font-bold tracking-widest text-sm md:text-base hover:bg-[#f4f4f4] hover:text-black hover:border-black border border-black transition-colors"
          data-cursor-hover
        >
          {backText}
        </Link>
      </section>

    </div>
  );
}
