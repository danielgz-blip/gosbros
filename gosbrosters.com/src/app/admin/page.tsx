"use client";

import { useState } from "react";
import { useLanguage } from "@/components/LanguageContext";
import MaskReveal from "@/components/MaskReveal";
import Footer from "@/components/Footer";

export default function AdminPage() {
  const { language, t } = useLanguage();
  const [status, setStatus] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("Saving...");
    const formData = new FormData(e.currentTarget);
    const data: Record<string, any> = Object.fromEntries(formData.entries());

    // Basic normalization for id
    data.id = data.title_en.toString().toLowerCase().replace(/[^a-z0-9]+/g, '-');
    data.featured = data.featured === "on";

    try {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        setStatus(t('admin.success'));
        (e.target as HTMLFormElement).reset();
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
                <label className="text-xs uppercase font-bold tracking-widest">Image Path</label>
                <input required name="image" placeholder="/image.jpg" defaultValue="/Hero_Placeholder.jpg" className="border border-black p-3 outline-none focus:bg-black focus:text-white transition-colors" />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-xs uppercase font-bold tracking-widest">Size (Works Page Grid)</label>
                <select name="size" className="border border-black p-3 outline-none focus:bg-black focus:text-white transition-colors">
                  <option value="large">Large (65%)</option>
                  <option value="small">Small (35%)</option>
                </select>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <input type="checkbox" name="featured" id="featured" defaultChecked className="w-5 h-5 accent-black" />
              <label htmlFor="featured" className="text-xs uppercase font-bold tracking-widest">Featured on Home Page?</label>
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
