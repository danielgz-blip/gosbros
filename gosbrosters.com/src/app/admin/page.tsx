"use client";

import { useState, useEffect, useRef } from "react";
import { useLanguage } from "@/components/LanguageContext";
import MaskReveal from "@/components/MaskReveal";
import Footer from "@/components/Footer";
import { Eye, Pencil, Trash2 } from "lucide-react";

type ContentBlock = {
  id: string;
  type: 'media' | 'text' | 'embed';
  url?: string;
  mediaFormat?: 'horizontal' | 'vertical';
  text_es?: string;
  text_en?: string;
  behanceUrl?: string;
};

type Project = {
  id: string;
  title_es: string;
  title_en: string;
  category_es: string;
  category_en: string;
  sector_es: string;
  sector_en: string;
  material_es: string;
  material_en: string;
  cost_ethos_es: string;
  cost_ethos_en: string;
  desc_es: string;
  desc_en: string;
  year: number;
  size: string;
  featured: boolean;
  image: string;
  department?: 'architecture' | 'design';
  content: ContentBlock[];
};

export default function AdminPage() {
  const { language, t } = useLanguage();
  const formRef = useRef<HTMLFormElement>(null);

  // --- Project List State ---
  const [projects, setProjects] = useState<Project[]>([]);
  const [loadingProjects, setLoadingProjects] = useState(true);
  const [isOpenProjects, setIsOpenProjects] = useState(false);

  // --- Form / Editor State ---
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [heroImage, setHeroImage] = useState<string>("/Hero_Placeholder.jpg");
  const [contentBlocks, setContentBlocks] = useState<ContentBlock[]>([]);

  // Controlled form field state (needed so we can populate when editing)
  const [formFields, setFormFields] = useState({
    title_es: '', title_en: '',
    category_es: '', category_en: '',
    sector_es: '', sector_en: '',
    material_es: '', material_en: '',
    cost_ethos_es: '', cost_ethos_en: '',
    desc_es: '', desc_en: '',
    year: 2026,
    size: 'large',
    featured: true,
    department: 'architecture',
  });

  // Pricing State
  const [pricingStatus, setPricingStatus] = useState<string | null>(null);
  const [pricing, setPricing] = useState<any>(null);
  const [isOpenPricing, setIsOpenPricing] = useState(false);

  // --- Load projects & pricing on mount ---
  useEffect(() => {
    fetchProjects();
    fetch("/api/pricing")
      .then(res => res.json())
      .then(data => setPricing(data))
      .catch(err => console.error("Error loading pricing", err));
  }, []);

  async function fetchProjects() {
    setLoadingProjects(true);
    try {
      const res = await fetch("/api/projects");
      if (res.ok) {
        const data = await res.json();
        setProjects(data);
      }
    } catch (err) {
      console.error("Error loading projects", err);
    }
    setLoadingProjects(false);
  }

  // --- Form field updater ---
  function updateField(field: string, value: any) {
    setFormFields(prev => ({ ...prev, [field]: value }));
  }

  // --- Load a project into the form for editing ---
  function handleEdit(project: Project) {
    setEditingProject(project);
    setFormFields({
      title_es: project.title_es || '',
      title_en: project.title_en || '',
      category_es: project.category_es || '',
      category_en: project.category_en || '',
      sector_es: project.sector_es || '',
      sector_en: project.sector_en || '',
      material_es: project.material_es || '',
      material_en: project.material_en || '',
      cost_ethos_es: project.cost_ethos_es || '',
      cost_ethos_en: project.cost_ethos_en || '',
      desc_es: project.desc_es || '',
      desc_en: project.desc_en || '',
      year: project.year || 2026,
      size: project.size || 'large',
      featured: project.featured ?? true,
      department: project.department || 'architecture',
    });
    setHeroImage(project.image || "/Hero_Placeholder.jpg");
    setContentBlocks(project.content ? project.content.map((b, i) => ({ ...b, id: b.id || Date.now().toString() + i })) : []);
    setStatus(null);

    // Scroll to form
    formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  // --- Cancel editing, reset form ---
  function handleCancelEdit() {
    setEditingProject(null);
    setFormFields({
      title_es: '', title_en: '',
      category_es: '', category_en: '',
      sector_es: '', sector_en: '',
      material_es: '', material_en: '',
      cost_ethos_es: '', cost_ethos_en: '',
      desc_es: '', desc_en: '',
      year: 2026, size: 'large', featured: true, department: 'architecture',
    });
    setHeroImage("/Hero_Placeholder.jpg");
    setContentBlocks([]);
    setStatus(null);
  }

  // --- Delete a project ---
  async function handleDelete(projectId: string, projectTitle: string) {
    const confirmed = window.confirm(`¿Estás seguro de que deseas eliminar el proyecto "${projectTitle}"? Esta acción no se puede deshacer.`);
    if (!confirmed) return;

    try {
      const res = await fetch("/api/projects", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: projectId }),
      });

      if (res.ok) {
        // If we were editing this project, cancel the edit
        if (editingProject?.id === projectId) {
          handleCancelEdit();
        }
        await fetchProjects();
        setStatus("Proyecto eliminado exitosamente.");
      } else {
        setStatus("Error al eliminar el proyecto.");
      }
    } catch (err) {
      setStatus("Error al eliminar el proyecto.");
    }
  }

  // --- Hero upload ---
  const handleHeroUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setStatus("Subiendo imagen hero...");
    try {
      const res = await fetch(`/api/upload?filename=${file.name}`, {
        method: 'POST',
        body: file,
      });
      const blob = await res.json();
      if (blob.url) {
        setHeroImage(blob.url);
        setStatus("Imagen hero subida.");
      } else {
        setStatus("Error al subir imagen hero.");
      }
    } catch (err) {
      setStatus("Error al subir imagen hero.");
    }
  };

  // --- Media upload ---
  const handleAddMedia = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setStatus("Subiendo medios...");
    
    try {
      const newBlocks: ContentBlock[] = [];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        
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
      setStatus("Medios agregados.");
    } catch (err) {
      setStatus("Error al subir medios.");
    }
    
    e.target.value = '';
  };

  // --- Text block ---
  const handleAddText = () => {
    setContentBlocks(prev => [
      ...prev,
      { id: Date.now().toString(), type: 'text', text_es: '', text_en: '' }
    ]);
  };

  const updateTextBlock = (id: string, field: 'text_es' | 'text_en', value: string) => {
    setContentBlocks(prev => prev.map(block => 
      block.id === id ? { ...block, [field]: value } : block
    ));
  };

  // --- Embed block ---
  const handleAddEmbed = () => {
    setContentBlocks(prev => [
      ...prev,
      { id: Date.now().toString(), type: 'embed', url: '', behanceUrl: '' }
    ]);
  };

  const updateEmbedBlock = (id: string, field: 'url' | 'behanceUrl', value: string) => {
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

  // --- Submit (create or update) ---
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("Guardando...");

    const data: Record<string, any> = { ...formFields };

    if (editingProject) {
      // Editing — keep the original id
      data.id = editingProject.id;
    } else {
      // Creating — generate id from English title
      data.id = data.title_en.toString().toLowerCase().replace(/[^a-z0-9]+/g, '-');
    }

    data.image = heroImage;
    data.content = contentBlocks;

    try {
      const method = editingProject ? "PUT" : "POST";
      const res = await fetch("/api/projects", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        setStatus(editingProject ? "Proyecto actualizado exitosamente." : t('admin.success'));
        if (!editingProject) {
          handleCancelEdit(); // Reset form after creating
        }
        await fetchProjects(); // Refresh the list
      } else {
        setStatus(t('admin.error'));
      }
    } catch (err) {
      setStatus(t('admin.error'));
    }
  }

  // --- Pricing submit ---
  async function handlePricingSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!pricing) return;
    
    setPricingStatus("Guardando precios...");
    try {
      const res = await fetch("/api/pricing", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(pricing),
      });

      if (res.ok) {
        setPricingStatus("Precios actualizados exitosamente.");
      } else {
        setPricingStatus("Error al guardar precios.");
      }
    } catch (err) {
      setPricingStatus("Error al guardar precios.");
    }
  }

  const updatePricing = (path: (string | number)[], value: any) => {
    setPricing((prev: any) => {
      const newData = JSON.parse(JSON.stringify(prev)); // Deep copy
      let current = newData;
      for (let i = 0; i < path.length - 1; i++) {
        current = current[path[i]];
      }
      current[path[path.length - 1]] = value;
      return newData;
    });
  };

  return (
    <div className="flex flex-col min-h-screen pt-32 md:pt-48 bg-[#f4f4f4]">
      <section className="px-4 md:px-8 mb-16 md:mb-24">
        <div className="max-w-[1800px] mx-auto h-full flex flex-col justify-center">
          <MaskReveal>
            <h1 className="text-hero leading-[0.85] font-display font-black tracking-tighter uppercase text-left w-full">
              {t('admin.title')}
            </h1>
          </MaskReveal>
          <p className="mt-4 font-sans text-sm text-gray-500 uppercase tracking-widest">
            Modo CMS Local - Arquitectura sin base de datos
          </p>
        </div>
      </section>

      <section className="px-4 md:px-8 pb-32 flex-grow">

        {/* ========== EXISTING PROJECTS LIST ========== */}
        <div className="max-w-[1000px] mx-auto w-full bg-white border border-black p-8 md:p-12 mb-16">
          <div className="flex justify-between items-center border-b border-black pb-4 mb-8 cursor-pointer hover:opacity-70 transition-opacity" onClick={() => setIsOpenProjects(!isOpenProjects)}>
            <h2 className="font-display font-bold uppercase text-h3 mb-0 border-0 pb-0">
              Proyectos Existentes
            </h2>
            <span className="w-[62px] h-[62px] flex items-center justify-center text-6xl font-light">{isOpenProjects ? '−' : '+'}</span>
          </div>

          {isOpenProjects && (
            loadingProjects ? (
              <div className="text-center py-12 text-gray-400 text-sm font-bold uppercase tracking-widest">
                Cargando proyectos...
              </div>
            ) : projects.length === 0 ? (
              <div className="text-center py-12 text-gray-400 text-sm font-bold uppercase tracking-widest border border-dashed border-gray-300">
                No hay proyectos aún.
              </div>
            ) : (
              <div className="flex flex-col">
                {/* Table Header */}
                <div className="hidden md:flex w-full border-b border-black py-3 uppercase font-sans text-[10px] font-bold tracking-widest text-gray-500">
                  <div className="w-[60px]"></div>
                  <div className="flex-1">Título</div>
                  <div className="w-[100px]">Año</div>
                  <div className="w-[160px]">Categoría</div>
                  <div className="w-[180px] text-right">Acciones</div>
                </div>

                {/* Project Rows */}
                {[...projects].sort((a, b) => (a.title_es || a.title_en).localeCompare(b.title_es || b.title_en)).map((project) => (
                  <div
                    key={project.id}
                    className={`flex flex-col md:flex-row md:items-center w-full border-b border-gray-200 py-4 gap-3 md:gap-0 transition-colors ${editingProject?.id === project.id ? 'bg-yellow-50' : 'hover:bg-gray-50'}`}
                  >
                    {/* Thumbnail */}
                    <div className="w-[60px] shrink-0">
                      {project.image && project.image !== "/Hero_Placeholder.jpg" ? (
                        <div className="w-12 h-8 border border-gray-300 overflow-hidden">
                          <img src={project.image} alt="" className="w-full h-full object-cover" />
                        </div>
                      ) : (
                        <div className="w-12 h-8 border border-dashed border-gray-300 bg-gray-100" />
                      )}
                    </div>

                    {/* Title */}
                    <div className="flex-1 font-sans font-bold text-sm uppercase">
                      {project.title_es || project.title_en}
                      {editingProject?.id === project.id && (
                        <span className="ml-2 text-[10px] font-bold uppercase bg-black text-white px-2 py-0.5 normal-case tracking-widest">
                          Editando
                        </span>
                      )}
                    </div>

                    {/* Year */}
                    <div className="w-[100px] font-sans text-sm text-gray-500">
                      {project.year}
                    </div>

                    {/* Category */}
                    <div className="w-[160px] font-serif italic text-sm text-gray-500 truncate">
                      {project.category_es || project.category_en}
                    </div>

                    {/* Actions */}
                    <div className="w-[120px] flex gap-2 justify-end">
                      <a 
                        href={`/works/${project.id}`}
                        target="_blank"
                        title="Ver"
                        className="border border-black p-2 text-black hover:bg-black hover:text-white transition-colors flex items-center justify-center"
                      >
                        <Eye size={16} strokeWidth={2.5} />
                      </a>
                      <button
                        type="button"
                        onClick={() => {
                          setIsOpenProjects(false);
                          handleEdit(project);
                        }}
                        title="Editar"
                        className="border border-black p-2 text-black hover:bg-black hover:text-white transition-colors flex items-center justify-center"
                      >
                        <Pencil size={16} strokeWidth={2.5} />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(project.id, project.title_es || project.title_en)}
                        title="Eliminar"
                        className="border border-red-500 p-2 text-red-500 hover:bg-red-500 hover:text-white transition-colors flex items-center justify-center"
                      >
                        <Trash2 size={16} strokeWidth={2.5} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )
          )}
        </div>

        {/* ========== PROJECT FORM (CREATE / EDIT) ========== */}
        <div className="max-w-[1000px] mx-auto w-full bg-white border border-black p-8 md:p-12">
          <div className="flex justify-between items-center mb-8 border-b border-black pb-4">
            <h2 className="font-display font-bold uppercase text-h3">
              {editingProject ? `Editando: ${editingProject.title_es || editingProject.title_en}` : t('admin.addProject')}
            </h2>
          </div>

          <form ref={formRef} onSubmit={handleSubmit} className="flex flex-col gap-8 font-sans">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="flex flex-col gap-2">
                <label className="text-xs uppercase font-bold tracking-widest">Título (ES)</label>
                <input required value={formFields.title_es} onChange={(e) => updateField('title_es', e.target.value)} className="border border-black p-3 outline-none focus:bg-black focus:text-white transition-colors" />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-xs uppercase font-bold tracking-widest">Título (EN)</label>
                <input required type="text" value={formFields.title_en} onChange={(e) => updateField('title_en', e.target.value)} className="border border-black p-3 outline-none focus:bg-black focus:text-white transition-colors" />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-xs uppercase font-bold tracking-widest">Departamento / Autor</label>
                <select value={formFields.department} onChange={(e) => updateField('department', e.target.value)} className="border border-black p-3 outline-none focus:bg-black focus:text-white transition-colors bg-transparent cursor-pointer">
                  <option value="architecture" className="text-black bg-white">Arquitectura (Andrés)</option>
                  <option value="design" className="text-black bg-white">Diseño Gráfico y Estrategia (Daniel)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="flex flex-col gap-2">
                <label className="text-xs uppercase font-bold tracking-widest">Categoría (ES)</label>
                <input required value={formFields.category_es} onChange={(e) => updateField('category_es', e.target.value)} placeholder="ej. Arquitectura, Interiores" className="border border-black p-3 outline-none focus:bg-black focus:text-white transition-colors" />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-xs uppercase font-bold tracking-widest">Categoría (EN)</label>
                <input required value={formFields.category_en} onChange={(e) => updateField('category_en', e.target.value)} placeholder="ej. Architecture, Interior" className="border border-black p-3 outline-none focus:bg-black focus:text-white transition-colors" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="flex flex-col gap-2">
                <label className="text-xs uppercase font-bold tracking-widest">Sector (ES)</label>
                <input required value={formFields.sector_es} onChange={(e) => updateField('sector_es', e.target.value)} placeholder="ej. Residencial" className="border border-black p-3 outline-none focus:bg-black focus:text-white transition-colors" />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-xs uppercase font-bold tracking-widest">Sector (EN)</label>
                <input required value={formFields.sector_en} onChange={(e) => updateField('sector_en', e.target.value)} placeholder="ej. Residential" className="border border-black p-3 outline-none focus:bg-black focus:text-white transition-colors" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="flex flex-col gap-2">
                <label className="text-xs uppercase font-bold tracking-widest">Material (ES)</label>
                <input required value={formFields.material_es} onChange={(e) => updateField('material_es', e.target.value)} placeholder="ej. Concreto Expuesto" className="border border-black p-3 outline-none focus:bg-black focus:text-white transition-colors" />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-xs uppercase font-bold tracking-widest">Material (EN)</label>
                <input required value={formFields.material_en} onChange={(e) => updateField('material_en', e.target.value)} placeholder="ej. Exposed Concrete" className="border border-black p-3 outline-none focus:bg-black focus:text-white transition-colors" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="flex flex-col gap-2">
                <label className="text-xs uppercase font-bold tracking-widest">Filosofía de Costo (ES)</label>
                <input required value={formFields.cost_ethos_es} onChange={(e) => updateField('cost_ethos_es', e.target.value)} placeholder="ej. Modularidad extrema" className="border border-black p-3 outline-none focus:bg-black focus:text-white transition-colors" />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-xs uppercase font-bold tracking-widest">Filosofía de Costo (EN)</label>
                <input required value={formFields.cost_ethos_en} onChange={(e) => updateField('cost_ethos_en', e.target.value)} placeholder="ej. Extreme Modularity" className="border border-black p-3 outline-none focus:bg-black focus:text-white transition-colors" />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs uppercase font-bold tracking-widest">Descripción (ES)</label>
              <textarea required value={formFields.desc_es} onChange={(e) => updateField('desc_es', e.target.value)} rows={3} className="border border-black p-3 outline-none focus:bg-black focus:text-white transition-colors" />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs uppercase font-bold tracking-widest">Descripción (EN)</label>
              <textarea required value={formFields.desc_en} onChange={(e) => updateField('desc_en', e.target.value)} rows={3} className="border border-black p-3 outline-none focus:bg-black focus:text-white transition-colors" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="flex flex-col gap-2">
                <label className="text-xs uppercase font-bold tracking-widest">Año</label>
                <input required type="number" value={formFields.year} onChange={(e) => updateField('year', Number(e.target.value))} className="border border-black p-3 outline-none focus:bg-black focus:text-white transition-colors" />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-xs uppercase font-bold tracking-widest">Tamaño (Cuadrícula de Proyectos)</label>
                <select value={formFields.size} onChange={(e) => updateField('size', e.target.value)} className="border border-black p-3 outline-none focus:bg-black focus:text-white transition-colors">
                  <option value="large">Grande (65%)</option>
                  <option value="small">Pequeño (35%)</option>
                </select>
              </div>
              <div className="flex items-center gap-4">
                <input type="checkbox" id="featured" checked={formFields.featured} onChange={(e) => updateField('featured', e.target.checked)} className="w-5 h-5 accent-black" />
                <label htmlFor="featured" className="text-xs uppercase font-bold tracking-widest">¿Destacado en el Inicio?</label>
              </div>
            </div>

            <div className="flex flex-col gap-4 border border-black p-4">
              <label className="text-xs uppercase font-bold tracking-widest">Imagen Hero (Obligatorio)</label>
              <div className="relative w-fit">
                <input type="file" accept="image/*,video/*" onChange={handleHeroUpload} className="absolute inset-0 opacity-0 cursor-pointer z-10" />
                <button type="button" className="border border-black px-4 py-2 text-xs uppercase font-bold tracking-widest hover:bg-black hover:text-white transition-colors pointer-events-none">
                  + Seleccionar Archivo
                </button>
              </div>
              <div className="text-xs text-gray-500 italic mt-[-10px]">Nota: La imagen hero será forzada a una proporción de 16:9 en la página del proyecto.</div>
              {heroImage && heroImage !== "/Hero_Placeholder.jpg" && (
                <div className="aspect-video w-full object-cover relative overflow-hidden max-w-[300px] border border-black">
                  <img src={heroImage} alt="Hero preview" className="h-full w-full object-cover" />
                </div>
              )}
            </div>

            {/* Project Content Builder */}
            <div className="flex flex-col gap-4 border border-black p-4 bg-[#fafafa]">
              <label className="text-sm uppercase font-black tracking-widest border-b border-black pb-2">Constructor de Contenido del Proyecto</label>
              
              {/* Content List */}
              <div className="flex flex-col gap-2 mt-4">
                {contentBlocks.map((block, index) => (
                  <div key={block.id} className="flex gap-4 p-4 border border-black bg-white items-start">
                    
                    {/* Reorder Buttons */}
                    <div className="flex flex-col gap-1 border-r border-gray-200 pr-4 mt-1">
                      <button type="button" onClick={() => moveBlock(index, 'up')} disabled={index === 0} className="disabled:opacity-20 hover:text-accent-pink transition-colors">
                        ▲
                      </button>
                      <button type="button" onClick={() => moveBlock(index, 'down')} disabled={index === contentBlocks.length - 1} className="disabled:opacity-20 hover:text-accent-pink transition-colors">
                        ▼
                      </button>
                    </div>

                    {/* Block Preview / Inputs */}
                    <div className="flex-grow flex flex-col gap-2">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-[10px] font-bold uppercase tracking-widest bg-black text-white px-2 py-1">
                          {block.type === 'media' ? `Medio ${block.mediaFormat === 'vertical' ? 'Vertical' : 'Horizontal'}` : block.type === 'text' ? 'Bloque de Texto' : 'Embed (Behance)'}
                        </span>
                        <button type="button" onClick={() => removeBlock(block.id)} className="text-[10px] uppercase font-bold text-red-500 hover:text-red-700">
                          Eliminar
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
                            placeholder="Texto (ES)" 
                            value={block.text_es} 
                            onChange={(e) => updateTextBlock(block.id, 'text_es', e.target.value)}
                            className="border border-gray-300 p-2 text-sm w-full outline-none focus:border-black"
                            rows={2}
                          />
                          <textarea 
                            placeholder="Texto (EN)" 
                            value={block.text_en} 
                            onChange={(e) => updateTextBlock(block.id, 'text_en', e.target.value)}
                            className="border border-gray-300 p-2 text-sm w-full outline-none focus:border-black"
                            rows={2}
                          />
                        </div>
                      )}

                      {block.type === 'embed' && (
                        <div className="flex flex-col gap-4">
                          <div className="flex flex-col gap-1">
                            <label className="text-[10px] uppercase font-bold tracking-widest text-gray-500">URL Embed (iframe)</label>
                            <input 
                              placeholder="https://www.behance.net/embed/project/12345678?ilo0=1"
                              value={block.url || ''} 
                              onChange={(e) => updateEmbedBlock(block.id, 'url', e.target.value)}
                              className="border border-gray-300 p-2 text-sm w-full outline-none focus:border-black"
                            />
                          </div>
                          <div className="flex flex-col gap-1">
                            <label className="text-[10px] uppercase font-bold tracking-widest text-gray-500">URL del Proyecto en Behance (enlace externo)</label>
                            <input 
                              placeholder="https://www.behance.net/gallery/12345678/Slug"
                              value={block.behanceUrl || ''} 
                              onChange={(e) => updateEmbedBlock(block.id, 'behanceUrl', e.target.value)}
                              className="border border-gray-300 p-2 text-sm w-full outline-none focus:border-black"
                            />
                          </div>
                        </div>
                      )}
                    </div>

                  </div>
                ))}

                {contentBlocks.length === 0 && (
                  <div className="text-center py-8 text-gray-400 text-sm font-bold uppercase tracking-widest border border-dashed border-gray-300">
                    Sin contenido aún. Agrega texto o medios abajo.
                  </div>
                )}
              </div>

              {/* Add Content Buttons */}
              <div className="flex flex-col gap-2 mt-4 border-t border-black pt-4">
                <div className="flex flex-wrap gap-4">
                  <button type="button" onClick={handleAddText} className="border border-black px-4 py-2 text-xs uppercase font-bold tracking-widest hover:bg-black hover:text-white transition-colors">
                    + Agregar Texto
                  </button>
                  <button type="button" onClick={handleAddEmbed} className="border border-black px-4 py-2 text-xs uppercase font-bold tracking-widest hover:bg-black hover:text-white transition-colors">
                    + Agregar Embed (Behance)
                  </button>
                  <div className="relative flex-grow max-w-[300px]">
                    <input type="file" multiple accept="image/*,video/*" onChange={handleAddMedia} className="absolute inset-0 opacity-0 cursor-pointer" />
                    <button type="button" className="w-full border border-black px-4 py-2 text-xs uppercase font-bold tracking-widest hover:bg-black hover:text-white transition-colors pointer-events-none text-left">
                      + Agregar Medios (Imágenes/Video)
                    </button>
                  </div>
                </div>
                <div className="text-xs text-gray-500 italic">
                  Nota: Las imágenes subidas para los medios deben tener una proporción de 16:9 (horizontal) o 9:16 (vertical).
                </div>
              </div>

            </div>

            <div className="pt-8 border-t border-black flex justify-between items-center">
              <span className="font-bold text-sm">{status}</span>
              <div className="flex gap-4">
                {editingProject && (
                  <button
                    type="button"
                    onClick={handleCancelEdit}
                    className="border border-black px-6 py-4 uppercase font-bold tracking-widest hover:bg-gray-100 transition-colors text-sm"
                  >
                    Cancelar
                  </button>
                )}
                <button 
                  type="submit" 
                  className="bg-black text-white px-8 py-4 uppercase font-bold tracking-widest hover:bg-white hover:text-black hover:border-black border border-black transition-colors"
                  data-cursor-hover
                >
                  {editingProject ? 'Actualizar Proyecto' : t('admin.save')}
                </button>
              </div>
            </div>

          </form>
        </div>

        {/* PRICING CONFIGURATION PANEL */}
        {pricing && (
        <div className="max-w-[1000px] mx-auto w-full bg-white border border-black p-8 md:p-12 mt-16">
          <div className="flex justify-between items-center border-b border-black pb-4 mb-8 cursor-pointer hover:opacity-70 transition-opacity" onClick={() => setIsOpenPricing(!isOpenPricing)}>
            <h2 className="font-display font-bold uppercase text-h3 mb-0 border-0 pb-0">
              CONFIGURACIÓN DE PRECIOS
            </h2>
            <span className="w-[62px] h-[62px] flex items-center justify-center text-6xl font-light">{isOpenPricing ? '−' : '+'}</span>
          </div>

          {isOpenPricing && (
            <form onSubmit={handlePricingSubmit} className="flex flex-col gap-8 font-sans">
              
              {/* Global Settings */}
              <div className="border border-black p-6 bg-[#fafafa]">
                <h3 className="font-display font-bold uppercase text-lg mb-4 border-b border-gray-300 pb-2">Configuración Global</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="flex flex-col gap-2">
                    <label className="text-xs uppercase font-bold tracking-widest">Tipo de Cambio USD (MXN)</label>
                    <input 
                      type="number" step="0.01" 
                      value={pricing.exchangeRate} 
                      onChange={(e) => updatePricing(['exchangeRate'], Number(e.target.value))}
                      className="border border-black p-3 outline-none focus:bg-black focus:text-white transition-colors" 
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-xs uppercase font-bold tracking-widest">Varianza (+/- %)</label>
                    <input 
                      type="number" 
                      value={pricing.variancePercent} 
                      onChange={(e) => updatePricing(['variancePercent'], Number(e.target.value))}
                      className="border border-black p-3 outline-none focus:bg-black focus:text-white transition-colors" 
                    />
                  </div>
                </div>
              </div>

              {/* Architecture Settings */}
              <div className="border border-black p-6">
                <h3 className="font-display font-bold uppercase text-lg mb-4 border-b border-gray-300 pb-2">Tarifas de Arquitectura (por m²)</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {pricing.architecture.projectTypes.map((pt: any, idx: number) => (
                    <div key={pt.id} className="flex flex-col gap-2">
                      <label className="text-xs uppercase font-bold tracking-widest">{pt.label_en}</label>
                      <div className="relative">
                        <span className="absolute left-3 top-3 font-bold">$</span>
                        <input 
                          type="number" 
                          value={pt.baseRate} 
                          onChange={(e) => updatePricing(['architecture', 'projectTypes', idx, 'baseRate'], Number(e.target.value))}
                          className="border border-black p-3 pl-8 outline-none focus:bg-black focus:text-white transition-colors w-full" 
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Branding Settings */}
              <div className="border border-black p-6 bg-[#fafafa]">
                <h3 className="font-display font-bold uppercase text-lg mb-4 border-b border-gray-300 pb-2">Precios Base de Branding</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  {pricing.branding.scopes.map((scope: any, idx: number) => (
                    <div key={scope.id} className="flex flex-col gap-2">
                      <label className="text-xs uppercase font-bold tracking-widest">{scope.label_en}</label>
                      <div className="relative">
                        <span className="absolute left-3 top-3 font-bold">$</span>
                        <input 
                          type="number" 
                          value={scope.basePrice} 
                          onChange={(e) => updatePricing(['branding', 'scopes', idx, 'basePrice'], Number(e.target.value))}
                          className="border border-black p-3 pl-8 outline-none focus:bg-black focus:text-white transition-colors w-full" 
                        />
                      </div>
                    </div>
                  ))}
                </div>
                
                <h4 className="text-sm font-bold uppercase tracking-widest mb-4">Multiplicadores por Tamaño de Cliente</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {pricing.branding.clientSizes.map((cs: any, idx: number) => (
                    <div key={cs.id} className="flex flex-col gap-2">
                      <label className="text-xs uppercase font-bold tracking-widest text-gray-500">{cs.label_en}</label>
                      <input 
                        type="number" step="0.1" 
                        value={cs.multiplier} 
                        onChange={(e) => updatePricing(['branding', 'clientSizes', idx, 'multiplier'], Number(e.target.value))}
                        className="border border-black p-3 outline-none focus:bg-black focus:text-white transition-colors w-full" 
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Strategy Settings */}
              <div className="border border-black p-6">
                <h3 className="font-display font-bold uppercase text-lg mb-4 border-b border-gray-300 pb-2">Tarifas Fijas de Estrategia</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {pricing.strategy.types.map((st: any, idx: number) => (
                    <div key={st.id} className="flex flex-col gap-2">
                      <label className="text-xs uppercase font-bold tracking-widest">{st.label_en}</label>
                      <div className="relative">
                        <span className="absolute left-3 top-3 font-bold">$</span>
                        <input 
                          type="number" 
                          value={st.basePrice} 
                          onChange={(e) => updatePricing(['strategy', 'types', idx, 'basePrice'], Number(e.target.value))}
                          className="border border-black p-3 pl-8 outline-none focus:bg-black focus:text-white transition-colors w-full" 
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-8 border-t border-black flex justify-between items-center">
                <span className="font-bold text-sm">{pricingStatus}</span>
                <button 
                  type="submit" 
                  className="bg-black text-white px-8 py-4 uppercase font-bold tracking-widest hover:bg-white hover:text-black hover:border-black border border-black transition-colors"
                  data-cursor-hover
                >
                  GUARDAR PRECIOS
                </button>
              </div>

            </form>
          )}
        </div>
        )}

      </section>

      <Footer />
    </div>
  );
}
