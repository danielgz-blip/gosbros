import { getProjects } from "@/lib/data";
import HomeClient from "@/components/HomeClient";

export default async function Home() {
  const projects = await getProjects();
  
  return <HomeClient projects={projects} />;
}
