import { getProjects } from "@/lib/data";
import WorksClient from "@/components/WorksClient";

export default async function WorksPage() {
  const projects = await getProjects();
  return <WorksClient projects={projects} />;
}
