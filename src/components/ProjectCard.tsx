interface Project {
    title: string;
    description: string;
    technologies: string[];
    category: string;
    github: string;
    image?: string;
  }
  
  const ProjectCard = ({ project }: { project: Project }) => {
    return (
      <div style={{ border: "1px solid #ddd", borderRadius: "12px", padding: "20px", background: "#fff" }}>
        {project.image && (
          <img
            src={project.image}
            alt={`${project.title} screenshot`}
            style={{ width: "100%", borderRadius: "8px", marginBottom: "1rem" }}
          />
        )}
        <h3 style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>{project.title}</h3>
        <p style={{ fontSize: "1rem", color: "#555", marginBottom: "1rem" }}>{project.description}</p>
        <p style={{ fontSize: "0.9rem", marginBottom: "1rem", color: "#888" }}>
          <strong>Tech:</strong> {project.technologies.join(", ")}
        </p>
        <a href={project.github} target="_blank" rel="noopener noreferrer" style={{ color: "#0070f3", fontWeight: "bold" }}>
          View Project →
        </a>
      </div>
    );
  };
  
  export default ProjectCard;