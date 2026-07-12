'use client';

import Link from "next/link";
import { motion } from "framer-motion";
import { FaArrowRight, FaGithub } from "react-icons/fa";

interface Project {
  title: string;
  description: string;
  technologies: string[];
  category: string;
  github?: string;
  caseStudy?: string;
  image?: string;
}

// Impact metrics for the MER Review Agent (see PORTFOLIO_BRIEF.md §5/§7)
const metrics = [
  { value: "~90%", label: "Faster review" },
  { value: "16", label: "Accountants" },
  { value: "270+", label: "Clients" },
  { value: "94% → ~1%", label: "Redundant OAuth calls" },
];

const FeaturedProject = ({ project }: { project: Project }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="group relative max-w-screen-xl mx-auto mb-12 overflow-hidden rounded-3xl border border-accent/40 bg-surface p-7 sm:p-10 transition-colors duration-300 hover:border-accent hover:shadow-[0_0_40px_-8px_rgba(99,102,241,0.4)]"
    >
      {/* Faint accent radial glow for depth */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full opacity-60 blur-3xl"
        style={{ background: "radial-gradient(circle, rgba(99,102,241,0.13), transparent 70%)" }}
      />

      <div className="relative grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
        {/* Left: copy + CTA */}
        <div>
          <div className="mb-4 flex items-center gap-2">
            <span className="font-mono text-[0.65rem] px-2.5 py-0.5 rounded-full bg-accent-soft border border-accent/50 text-accent uppercase tracking-wide">
              ★ Featured · Case Study
            </span>
          </div>

          <h3 className="text-2xl sm:text-3xl font-bold text-fg leading-tight mb-4">
            {project.title}
          </h3>

          <p className="text-muted leading-relaxed mb-6">{project.description}</p>

          <div className="mb-7 flex flex-wrap gap-2">
            {project.technologies.map((tech) => (
              <span
                key={tech}
                className="whitespace-nowrap font-mono text-[0.7rem] px-3 py-1 rounded-full bg-bg-alt text-muted border border-subtle"
              >
                {tech}
              </span>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-5">
            {project.caseStudy && (
              <Link
                href={project.caseStudy}
                prefetch={false}
                className="inline-flex items-center gap-2 rounded-full bg-accent px-5 py-2.5 text-sm font-medium text-white transition-colors duration-200 hover:bg-accent-hover"
              >
                Read the case study
                <FaArrowRight size={12} className="transition-transform duration-200 group-hover:translate-x-0.5" />
              </Link>
            )}
            {project.github && (
              <a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm text-muted hover:text-accent transition-colors"
              >
                <FaGithub size={16} />
                Source
              </a>
            )}
          </div>
        </div>

        {/* Right: impact metrics */}
        <div className="grid grid-cols-2 gap-px rounded-2xl overflow-hidden border border-subtle bg-subtle">
          {metrics.map((m) => (
            <div key={m.label} className="flex flex-col gap-1.5 p-5 bg-surface">
              <span className="font-mono text-xl sm:text-2xl font-semibold text-accent">
                {m.value}
              </span>
              <span className="text-xs text-muted leading-snug">{m.label}</span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default FeaturedProject;
