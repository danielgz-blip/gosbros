"use client";

import { useState } from "react";
import { useLanguage } from "@/components/LanguageContext";
import MaskReveal from "@/components/MaskReveal";
import Footer from "@/components/Footer";

type ContentBlock = {
  id: string;
  type: 'media' | 'text';
  url?: string;
  mediaFormat?: 'horizontal' | 'vertical';
  text_es?: string;
  text_en?: string;
};

export default function AdminPage() {
  const { language, t } = useLanguage();
  const [status, setStatus] = useState<string | null>(null);
  const [heroImage, setHeroImage] = useState<string>("/Hero_Placeholder.jpg");
  const [contentBlocks, setContentBlocks] = useState<ContentBlock[]>([]);

  const handleHeroUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setStatus("Uploading hero image...");
    try {
      const res = await fetch(`/api/upload?filename=${file.name}`, {
        method: 'POST',
        body: file,
      });
      const blob = await res.json();
      if (blob.url) {
        setHeroImage(blob.url);
        setStatus("Hero image uploaded.");
      } else {
        setStatus("Error uploading hero image.");
      }
    } catch (err) {
      setStatus("Error uploading hero image.");
    }
  };

  const handleAddMedia = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setStatus("Uploading media...");
    
    try {
      const newBlocks: ContentBlock[] = [];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        
        // Auto-detect dimensions for images
        let mediaFormat: 'horizontal' | 'vertical' = 'horizontal';
        if (file.type.startsWith('image/')) {
          const objectUrl = URL.createObjectURL(file);
          const img = new Image();
          img.src = objectUrl;
          await new Promise((resolve) => {
            img.onload = () => {
              if (img.height > img.width) {
                mediaFormat = 'vertical';
              }
              resolve(null);
            };
            img.onerror = () => resolve(null);
          });
          URL.revokeObjectURL(objectUrl);
        } else if (file.type.startsWith('video/')) {
          // Simplistic video check - could be improved by loading video metadata
          mediaFormat = 'horizontal';
        }

        const res = await fetch(`/api/upload?filename=${file.name}`, {
          method: 'POST',
          body: file,
        });
        const blob = await res.json();
        if (blob.url) {
          newBlocks.push({
            id: Date.now().toString() + i,
            type: 'media',
            url: blob.url,
            mediaFormat: mediaFormat,
          });
        }
      }
      setContentBlocks(prev => [...prev, ...newBlocks]);
      setStatus("Media added.");
    } catch (err) {
      setStatus("Error uploading media.");
    }
    
    // Reset input
    e.target.value = '';
  };

  const handleAddText = () => {
    setContentBlocks(prev => [
      ...prev,
      {
        id: Date.now().toString(),
        type: 'text',
        text_es: '',
        text_en: ''
      }
    ]);
  };

  const updateTextBlock = (id: string, field: 'text_es' | 'text_en', value: string) => {
    setContentBlocks(prev => prev.map(block => 
      block.id === id ? { ...block, [field]: value } : block
    ));
  };

  const removeBlock = (id: string) => {
    setContentBlocks(prev => prev.filter(block => block.id !== id));
  };

  const moveBlock = (index: number, direction: 'up' | 'down') => {
    setContentBlocks(prev => {
      const newBlocks = [...prev];
      if (direction === 'up' && index > 0) {
        [newBlocks[index - 1], newBlocks[index]] = [newBlocks[index], newBlocks[index - 1]];
      } else if (direction === 'down' && index < newBlocks.length - 1) {
        [newBlocks[index + 1], newBlocks[index]] = [newBlocks[index], newBlocks[index + 1]];
      }
      return newBlocks;
    });
  };

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("Saving...");
    const formData = new FormData(e.currentTarget);
    const data: Record<string, any> = Object.fromEntries(formData.entries());

    // Basic normalization for id
    data.id = data.title_en.toString().toLowerCase().replace(/[^a-z0-9]+/g, '-');
    data.featured = data.featured === "on";
    data.image = heroImage;
    data.content = contentBlocks;

    try {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        setStatus(t('admin.success'));
        (e.target as HTMLFormElement).reset();
        setHeroImage("/Hero_Placeholder.jpg");
        setContentBlocks([]);
      } else {
        setStatus(t('admin.error'));
      }
    } catch (err) {
      setStatus(t('admin.error'));
    }
  }

  return (
    <div className="flex flex-col min-h-screen pt-32 md:pt-48 bg-[#f4f4f4]">
      <section className="px-4 md:px-8 mb-16 md:mb-24">
        <div className="max-w-[1800px] mx-auto h-full flex flex-col justify-center">
          <MaskReveal>
            <h1 className="text-[var(--font-size-hero)] leading-[0.85] font-sans font-black tracking-tighter uppercase text-left w-full">
              {t('admin.title')}
            </h1>
          </MaskReveal>
          <p className="mt-4 font-sans text-sm text-gray-500 uppercase tracking-widest">
            Local CMS Mode - Zero Database Architecture
          </p>
        </div>
      </section>

      <section className="px-4 md:px-8 pb-32 flex-grow">
        <div className="max-w-[1000px] mx-auto w-full bg-white border border-black p-8 md:p-12">
          <h2 className="font-sans font-bold uppercase text-2xl mb-8 border-b border-black pb-4">
            {t('admin.addProject')}
          </h2>

          <form onSubmit={handleSubmit} className="flex flex-col gap-8 font-sans">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="flex flex-col gap-2">
                <label className="text-xs uppercase font-bold tracking-widest">Title (ES)</label>
                <input required name="title_es" className="border border-black p-3 outline-none focus:bg-black focus:text-white transition-colors" />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-xs uppercase font-bold tracking-widest">Title (EN)</label>
                <input required name="title_en" className="border border-black p-3 outline-none focus:bg-black focus:text-white transition-colors" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="flex flex-col gap-2">
                <label className="text-xs uppercase font-bold tracking-widest">Category (ES)</label>
                <input required name="category_es" placeholder="e.g. Arquitectura, Interiores" className="border border-black p-3 outline-none focus:bg-black focus:text-white transition-colors" />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-xs uppercase font-bold tracking-widest">Category (EN)</label>
                <input required name="category_en" placeholder="e.g. Architecture, Interior" className="border border-black p-3 outline-none focus:bg-black focus:text-white transition-colors" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="flex flex-col gap-2">
                <label className="text-xs uppercase font-bold tracking-widest">Sector (ES)</label>
                <input required name="sector_es" placeholder="e.g. Residencial" className="border border-black p-3 outline-none focus:bg-black focus:text-white transition-colors" />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-xs uppercase font-bold tracking-widest">Sector (EN)</label>
                <input required name="sector_en" placeholder="e.g. Residential" className="border border-black p-3 outline-none focus:bg-black focus:text-white transition-colors" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="flex flex-col gap-2">
                <label className="text-xs uppercase font-bold tracking-widest">Material (ES)</label>
                <input required name="material_es" placeholder="e.g. Concreto Expuesto" className="border border-black p-3 outline-none focus:bg-black focus:text-white transition-colors" />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-xs uppercase font-bold tracking-widest">Material (EN)</label>
                <input required name="material_en" placeholder="e.g. Exposed Concrete" className="border border-black p-3 outline-none focus:bg-black focus:text-white transition-colors" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="flex flex-col gap-2">
                <label className="text-xs uppercase font-bold tracking-widest">Cost Ethos (ES)</label>
                <input required name="cost_ethos_es" placeholder="e.g. Modularidad extrema" className="border border-black p-3 outline-none focus:bg-black focus:text-white transition-colors" />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-xs uppercase font-bold tracking-widest">Cost Ethos (EN)</label>
                <input required name="cost_ethos_en" placeholder="e.g. Extreme Modularity" className="border border-black p-3 outline-none focus:bg-black focus:text-white transition-colors" />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs uppercase font-bold tracking-widest">Description (ES)</label>
              <textarea required name="desc_es" rows={3} className="border border-black p-3 outline-none focus:bg-black focus:text-white transition-colors" />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs uppercase font-bold tracking-widest">Description (EN)</label>
              <textarea required name="desc_en" rows={3} className="border border-black p-3 outline-none focus:bg-black focus:text-white transition-colors" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="flex flex-col gap-2">
                <label className="text-xs uppercase font-bold tracking-widest">Year</label>
                <input required name="year" type="number" defaultValue={2026} className="border border-black p-3 outline-none focus:bg-black focus:text-white transition-colors" />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-xs uppercase font-bold tracking-widest">Size (Works Page Grid)</label>
                <select name="size" className="border border-black p-3 outline-none focus:bg-black focus:text-white transition-colors">
                  <option value="large">Large (65%)</option>
                  <option value="small">Small (35%)</option>
                </select>
              </div>
              <div className="flex items-center gap-4">
                <input type="checkbox" name="featured" id="featured" defaultChecked className="w-5 h-5 accent-black" />
                <label htmlFor="featured" className="text-xs uppercase font-bold tracking-widest">Featured on Home Page?</label>
              </div>
            </div>

            <div className="flex flex-col gap-4 border border-black p-4">
              <label className="text-xs uppercase font-bold tracking-widest">Hero Image (Required)</label>
              <input type="file" accept="image/*,video/*" onChange={handleHeroUpload} className="text-sm" />
              <div className="text-xs text-gray-500 italic mt-[-10px]">Note: Hero image will be forced to 16:9 on the project page.</div>
              {heroImage && heroImage !== "/Hero_Placeholder.jpg" && (
                <div className="aspect-video w-full object-cover relative overflow-hidden max-w-[300px] border border-black">
                  <img src={heroImage} alt="Hero preview" className="h-full w-full object-cover" />
                </div>
              )}
            </div>

            {/* Project Content Builder */}
            <div className="flex flex-col gap-4 border border-black p-4 bg-[#fafafa]">
              <label className="text-sm uppercase font-black tracking-widest border-b border-black pb-2">Project Content Builder</label>
              
              {/* Content List */}
              <div className="flex flex-col gap-2 mt-4">
                {contentBlocks.map((block, index) => (
                  <div key={block.id} className="flex gap-4 p-4 border border-black bg-white items-start">
                    
                    {/* Reorder Buttons */}
                    <div className="flex flex-col gap-1 border-r border-gray-200 pr-4 mt-1">
                      <button type="button" onClick={() => moveBlock(index, 'up')} disabled={index === 0} className="disabled:opacity-20 hover:text-[#ff0080] transition-colors">
                        ▲
                      </button>
                      <button type="button" onClick={() => moveBlock(index, 'down')} disabled={index === contentBlocks.length - 1} className="disabled:opacity-20 hover:text-[#ff0080] transition-colors">
                        ▼
                      </button>
                    </div>

                    {/* Block Preview / Inputs */}
                    <div className="flex-grow flex flex-col gap-2">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-[10px] font-bold uppercase tracking-widest bg-black text-white px-2 py-1">
                          {block.type === 'media' ? `${block.mediaFormat} Media` : 'Text Block'}
                        </span>
                        <button type="button" onClick={() => removeBlock(block.id)} className="text-[10px] uppercase font-bold text-red-500 hover:text-red-700">
                          Remove
                        </button>
                      </div>

                      {block.type === 'media' && block.url && (
                        <div className="flex items-start gap-4">
                           <div className={`border border-black overflow-hidden ${block.mediaFormat === 'vertical' ? 'h-32 w-20' : 'h-24 w-40'}`}>
                             {block.url.match(/\.(mp4|webm|mov)$/i) ? (
                               <video src={block.url} className="h-full w-full object-cover" muted />
                             ) : (
                               <img src={block.url} alt="Media" className="h-full w-full object-cover" />
                             )}
                           </div>
                           <span className="text-xs text-gray-500 italic max-w-xs overflow-hidden text-ellipsis">{block.url}</span>
                        </div>
                      )}

                      {block.type === 'text' && (
                        <div className="flex flex-col gap-4">
                          <textarea 
                            placeholder="Text (ES)" 
                            value={block.text_es} 
                            onChange={(e) => updateTextBlock(block.id, 'text_es', e.target.value)}
                            className="border border-gray-300 p-2 text-sm w-full outline-none focus:border-black"
                            rows={2}
                          />
                          <textarea 
                            placeholder="Text (EN)" 
                            value={block.text_en} 
                            onChange={(e) => updateTextBlock(block.id, 'text_en', e.target.value)}
                            className="border border-gray-300 p-2 text-sm w-full outline-none focus:border-black"
                            rows={2}
                          />
                        </div>
                      )}
                    </div>

                  </div>
                ))}

                {contentBlocks.length === 0 && (
                  <div className="text-center py-8 text-gray-400 text-sm font-bold uppercase tracking-widest border border-dashed border-gray-300">
                    No content yet. Add text or media below.
                  </div>
                )}
              </div>

              {/* Add Content Buttons */}
              <div className="flex flex-wrap gap-4 mt-4 border-t border-black pt-4">
                <button type="button" onClick={handleAddText} className="border border-black px-4 py-2 text-xs uppercase font-bold tracking-widest hover:bg-black hover:text-white transition-colors">
                  + Add Text
                </button>
                <div className="relative">
                  <input type="file" multiple accept="image/*,video/*" onChange={handleAddMedia} className="absolute inset-0 opacity-0 cursor-pointer" />
                  <button type="button" className="border border-black px-4 py-2 text-xs uppercase font-bold tracking-widest hover:bg-black hover:text-white transition-colors pointer-events-none">
                    + Add Media (Images/Video)
                  </button>
                </div>
              </div>

            </div>

            <div className="pt-8 border-t border-black flex justify-between items-center">
              <span className="font-bold text-sm">{status}</span>
              <button 
                type="submit" 
                className="bg-black text-white px-8 py-4 uppercase font-bold tracking-widest hover:bg-white hover:text-black hover:border-black border border-black transition-colors"
                data-cursor-hover
              >
                {t('admin.save')}
              </button>
            </div>

          </form>
        </div>
      </section>

      <Footer />
    </div>
  );
}
