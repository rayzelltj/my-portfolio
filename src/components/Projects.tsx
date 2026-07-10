'use client';

import { motion } from "framer-motion";
import projects from "@/app/resources/projects";
import ProjectCard from "./ProjectCard";
import FeaturedProject from "./FeaturedProject";

// Define the type of each project in the projects array
interface Project {
  title: string;
  description: string;
  technologies: string[];
  category: string;
  github: string;
  image?: string;
}

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
};

const Projects = () => {
  const [featured, ...rest] = projects as Project[];

  return (
    <section className="px-6 mx-auto py-24">
      <motion.p
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.5 }}
        className="mb-3 text-center font-mono text-xs uppercase tracking-[0.2em] text-accent"
      >
        03 — Projects
      </motion.p>
      <motion.h2
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.5, delay: 0.05 }}
        className="text-3xl font-semibold mb-10 text-fg text-center"
      >
        Projects
      </motion.h2>

      {/* Featured case study — lead with the agent */}
      {featured && <FeaturedProject project={featured} />}

      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: '-80px' }}
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 max-w-screen-xl mx-auto"
      >
        {rest.map((project: Project, index: number) => (
          <ProjectCard key={index} project={project} variants={fadeUp} />
        ))}
      </motion.div>
    </section>
  );
};

export default Projects;
