import projectsData from "@/data/projects.json";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import Footer from "@/components/Footer";
import ProjectClientTranslations from "./ProjectClientTranslations";

export function generateStaticParams() {
  return projectsData.map((project) => ({
    id: project.id,
  }));
}

export default async function ProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const project = projectsData.find((p) => p.id === id);

  if (!project) {
    notFound();
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#f4f4f4]">
      {/* Dynamic Client Wrapper for Language switching the Go Back button */}
      <ProjectClientTranslations project={project} />
      <Footer />
    </div>
  );
}
