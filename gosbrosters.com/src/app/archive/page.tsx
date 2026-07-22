import { getProjects } from "@/lib/data";
import ArchiveClient from "@/components/ArchiveClient";

export default async function ArchivePage() {
  const projects = await getProjects();
  return <ArchiveClient projects={projects} />;
}

