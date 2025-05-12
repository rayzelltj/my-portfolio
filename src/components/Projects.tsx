import projects from "@/app/resources/projects";
import ProjectCard from "./ProjectCard";

// Define the type of each project in the projects array
interface Project {
  title: string;
  description: string;
  technologies: string[];
  category: string;
  github: string;
  image?: string;
}


const Projects = () => {
  return (
    <section className="py-20 px-6 mx-auto py-24">
      <h2 className="text-3xl font-semibold mb-8 text-gray-800 text-center">Projects</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10 max-w-screen-xl mx-auto">
        {projects.map((project: Project, index: number) => (
          <ProjectCard key={index} project={project} />
        ))}
      </div>
    </section>
  );
};

export default Projects;
