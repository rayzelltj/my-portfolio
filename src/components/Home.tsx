'use client';

import home from "@/app/resources/home";
import social from "@/app/resources/social";
import { JSX } from "react";
import { motion } from "framer-motion";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { MdEmail } from "react-icons/md"; // For email icon

const iconMap: Record<string, JSX.Element> = {
  github: <FaGithub size={20} />,
  linkedin: <FaLinkedin size={20} />,
  email: <MdEmail size={20} />,
};

const container = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.12, delayChildren: 0.05 },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};

const HomeSection = () => {
  return (
    <section className="py-24 px-5">
      {/* Top content: Name + Avatar */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="flex justify-center items-center gap-12 max-w-3xl mx-auto flex-nowrap flex-col md:flex-row"
      >
        {/* Left side: name, title, socials */}
        <div className="min-w-[300px] text-center md:text-left">
          <motion.p
            variants={fadeUp}
            className="mb-3 font-mono text-xs uppercase tracking-[0.2em] text-accent"
          >
            Software Engineer
          </motion.p>

          <motion.h1
            variants={fadeUp}
            className="text-4xl sm:text-5xl font-bold mb-4 leading-tight shimmer-text"
          >
            {home.tagline}
          </motion.h1>

          <motion.h2
            variants={fadeUp}
            className="text-lg sm:text-xl text-muted mb-4 leading-relaxed"
          >
            {home.description}
          </motion.h2>

          {/* Social Buttons */}
          <motion.div
            variants={fadeUp}
            className="flex flex-wrap gap-2 justify-center md:justify-start mt-6"
          >
            {social.map((item) => {
              const isEmail = item.link.startsWith('mailto:');
              return (
                <a
                  key={item.name}
                  href={item.link}
                  {...(!isEmail && { target: "_blank", rel: "noopener noreferrer" })}
                  className="flex items-center gap-2 px-5 py-2 rounded-full bg-surface text-fg border border-subtle transition-colors duration-200 hover:border-accent hover:text-accent"
                >
                  <span className="text-xl">{iconMap[item.icon]}</span>
                  <span className="font-medium">{item.name}</span>
                </a>
              );
            })}
          </motion.div>
        </div>

        {/* Right side: Avatar */}
        <motion.div
          variants={fadeUp}
          className="flex justify-center"
        >
          <div className="relative w-[220px] h-[220px] rounded-full p-[3px] overflow-hidden ring-avatar">
            <div className="w-full h-full rounded-full overflow-hidden bg-bg">
              <img
                src={home.avatar}
                alt={`${home.tagline} avatar`}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default HomeSection;
