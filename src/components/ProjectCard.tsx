'use client';

import { FaGithub, FaExternalLinkAlt } from "react-icons/fa";
import React from "react";
import { motion, type Variants } from "framer-motion";

interface Project {
  title: string;
  description: string;
  technologies: string[];
  category: string;
  github: string;
  devpost?: string;
  caseStudy?: string;
  image?: string;
}

const ProjectCard = ({
  project,
  variants,
}: {
  project: Project;
  variants?: Variants;
}) => {
  return (
    <motion.div
      variants={variants}
      whileHover={{ y: -6 }}
      transition={{ type: "spring", stiffness: 300, damping: 24 }}
      className="group relative flex flex-col gap-4 p-6 rounded-2xl border border-subtle bg-surface transition-colors duration-300 hover:border-accent/60 hover:shadow-[0_0_28px_-4px_rgba(99,102,241,0.35)]"
    >
      {/* Top Row: Category + Icons */}
      <div className="flex items-center justify-between">
        <span className="w-fit font-mono text-[0.65rem] px-2 py-0.5 rounded-full bg-accent-soft border border-accent/40 text-accent uppercase tracking-wide">
          {project.category}
        </span>

        <div className="flex gap-3">
          {project.github && (
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${project.title} on GitHub`}
              className="text-muted hover:text-accent transition-colors"
            >
              <FaGithub size={18} />
            </a>
          )}
          {project.caseStudy && (
            <a
              href={project.caseStudy}
              aria-label={`${project.title} case study`}
              className="text-muted hover:text-accent transition-colors"
            >
              <FaExternalLinkAlt size={16} />
            </a>
          )}
          {project.devpost && (
            <a
              href={project.devpost}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${project.title} on Devpost`}
              className="text-muted hover:text-accent transition-colors"
            >
              <FaExternalLinkAlt size={16} />
            </a>
          )}
        </div>
      </div>

      {/* Project image — falls back to a branded placeholder when none exists */}
      {project.image ? (
        <img
          src={project.image}
          alt={`${project.title} screenshot`}
          className="w-full rounded-xl object-cover border border-subtle aspect-[4/3]"
        />
      ) : (
        <div className="relative flex w-full items-center justify-center overflow-hidden rounded-xl border border-subtle bg-gradient-to-br from-accent-soft to-bg-alt aspect-[4/3]">
          <div
            aria-hidden
            className="absolute inset-0 opacity-60"
            style={{
              backgroundImage:
                "linear-gradient(rgba(99,102,241,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.06) 1px, transparent 1px)",
              backgroundSize: "22px 22px",
            }}
          />
          <span className="relative z-10 px-4 text-center font-mono text-xs text-muted">
            <span className="text-accent">$ </span>
            {project.title}
          </span>
        </div>
      )}

      {/* Title */}
      <h3 className="text-xl font-semibold text-fg">{project.title}</h3>

      {/* Description */}
      <p className="text-sm text-muted leading-relaxed">{project.description}</p>

      {/* Technologies */}
      <div className="mt-auto flex gap-2 overflow-x-auto no-scrollbar pb-1">
        {project.technologies.map((tech) => (
          <span
            key={tech}
            className="whitespace-nowrap font-mono text-[0.7rem] px-3 py-1 rounded-full bg-bg-alt text-muted border border-subtle"
          >
            {tech}
          </span>
        ))}
      </div>
    </motion.div>
  );
};

export default ProjectCard;
