'use client';

import React from "react";
import { motion, type Variants } from "framer-motion";

interface ExperienceProps {
  role: string;
  organization: string;
  type: string;
  date: string;
  location: string;
  description: string;
  icon?: string;
}

const ExperienceEntry = ({
  experience,
  variants,
}: {
  experience: ExperienceProps;
  variants?: Variants;
}) => {
  return (
    <motion.div
      variants={variants}
      className="group relative flex gap-5 p-6 pt-12 sm:pt-6 rounded-2xl border border-subtle bg-surface transition-colors duration-300 hover:border-accent/60 hover:bg-surface-hover"
    >
      {/* Logo */}
      {experience.icon && (
        <div className="flex-shrink-0">
          <img
            src={experience.icon}
            alt={`${experience.organization} logo`}
            width="64"
            height="64"
            className="rounded-full object-cover border border-subtle bg-bg"
          />
        </div>
      )}

      {/* Main content */}
      <div className="flex flex-col gap-2 text-sm w-full">
        {/* Top right date */}
        <div className="absolute top-4 right-6 font-mono text-xs text-muted">
          {experience.date}
        </div>

        {/* Role and tag */}
        <div className="text-lg font-semibold text-fg">
          {experience.role}
          <span className="ml-2 align-middle px-2 py-0.5 font-mono text-[0.65rem] rounded-full border border-accent/50 text-accent bg-accent-soft uppercase tracking-wide">
            {experience.type}
          </span>
        </div>

        {/* Organization and location */}
        <div className="text-muted">
          <span className="font-medium text-fg">{experience.organization}</span> · {experience.location}
        </div>

        {/* Description */}
        <p className="mt-1 text-muted leading-relaxed">{experience.description}</p>
      </div>
    </motion.div>
  );
};

export default ExperienceEntry;
