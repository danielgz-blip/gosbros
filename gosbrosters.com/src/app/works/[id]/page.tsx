import { getProjects } from "@/lib/data";
import WorkDetailClient from "@/components/WorkDetailClient";

export default async function ProjectDetail() {
  const projects = await getProjects();
  return <WorkDetailClient projects={projects} />;
}

