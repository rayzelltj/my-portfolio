import { FaGithub, FaExternalLinkAlt} from "react-icons/fa";
import React from "react";

interface Project {
  title: string;
  description: string;
  technologies: string[];
  category: string;
  github: string;
  devpost?: string;
  image?: string;
}

const ProjectCard = ({ project }: { project: Project }) => {
  return (
    <div className="relative flex flex-col gap-4 p-6 border border-indigo-100 rounded-2xl bg-white/60 shadow-md backdrop-blur-md">
      
      {/* Top Row: Category + Icons */}
<div className="flex items-center justify-between">
  <span className="w-fit text-xs px-2 py-0.5 rounded-full bg-white border border-indigo-400 text-indigo-600 font-medium tracking-wide">
    {project.category}
  </span>

  <div className="flex gap-2">
    <a
      href={project.github}
      target="_blank"
      rel="noopener noreferrer"
      className="text-indigo-600 hover:text-indigo-900 transition"
    >
      <FaGithub size={18} />
    </a>
    {project.devpost && (
      <a
        href={project.devpost}
        target="_blank"
        rel="noopener noreferrer"
        className="text-indigo-600 hover:text-indigo-900 transition"
      >
        <FaExternalLinkAlt size={16} />
      </a>
    )}
  </div>
</div>


      {/* Project image */}
      {project.image && (
        <img
          src={project.image}
          alt={`${project.title} screenshot`}
          className="w-full rounded-xl object-cover border border-indigo-200 aspect-[4/3]"
        />
      )}

      {/* Title + Category */}
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold text-indigo-900">{project.title}</h3>
      </div>

      {/* Description */}
      <p className="text-sm text-neutral-700 leading-relaxed">{project.description}</p>

      {/* Technologies */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
        {project.technologies.map((tech) => (
          <span
            key={tech}
            className="whitespace-nowrap text-xs px-3 py-1 rounded-full bg-indigo-100 text-indigo-700 border border-indigo-300 font-medium"
          >
            {tech}
          </span>
        ))}
      </div>
    </div>
  );
};

export default ProjectCard;