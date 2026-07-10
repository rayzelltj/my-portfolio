'use client';

import { motion } from "framer-motion";
import experience from "@/app/resources/experience";
import ExperienceEntry from "./ExperienceEntry";

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};

const Experience = () => {
  return (
    <section className="max-w-4xl px-6 mx-auto py-24">
      <motion.p
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.5 }}
        className="mb-3 text-center font-mono text-xs uppercase tracking-[0.2em] text-accent"
      >
        02 — Work
      </motion.p>
      <motion.h2
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.5, delay: 0.05 }}
        className="text-3xl font-semibold mb-10 text-fg text-center"
      >
        Experience
      </motion.h2>

      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: '-80px' }}
        className="flex flex-col gap-5"
      >
        {experience.map((exp, index) => (
          <ExperienceEntry key={index} experience={exp} variants={fadeUp} />
        ))}
      </motion.div>
    </section>
  );
};

export default Experience;
