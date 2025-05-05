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

const ProjectsSection = () => {
  return (
    <section style={{ padding: "80px 20px" }}>
      <h2 style={{ fontSize: "2rem", marginBottom: "2rem", textAlign: "center" }}>
        Projects
      </h2>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: "40px",
          maxWidth: "1200px",
          margin: "0 auto",
        }}
      >
        {projects.map((project: Project, index: number) => (
          <ProjectCard key={index} project={project} />
        ))}
      </div>
    </section>
  );
};

export default ProjectsSection;