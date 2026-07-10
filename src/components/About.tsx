'use client';

import { motion } from 'framer-motion';
import about from '../app/resources/about';

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};

const About = () => {
  return (
    <motion.section
      variants={container}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: '-80px' }}
      className="max-w-3xl mx-auto px-6 py-24 text-center"
    >
      <motion.p
        variants={fadeUp}
        className="mb-3 font-mono text-xs uppercase tracking-[0.2em] text-accent"
      >
        01 — About
      </motion.p>
      <motion.h2
        variants={fadeUp}
        className="text-3xl font-semibold mb-8 text-fg"
      >
        About Me
      </motion.h2>
      {about.description.map((paragraph, idx) => (
        <motion.p
          key={idx}
          variants={fadeUp}
          className="mb-6 text-lg text-muted leading-relaxed"
        >
          {paragraph}
        </motion.p>
      ))}
    </motion.section>
  );
};

export default About;
