import React from "react";

interface ExperienceProps {
  role: string;
  organization: string;
  type: string;
  date: string;
  location: string;
  description: string;
  icon?: string;
}

const ExperienceEntry = ({ experience }: { experience: ExperienceProps }) => {
  return (
    <div className="flex items-start gap-4">
      {experience.icon && (
        <img
          src={experience.icon}
          alt={`${experience.organization} logo`}
          width="80"
          height="80"
          className="rounded-full border border-black mt-1 "
        />
      )}
      <div>
        <div>
          <strong>{experience.role}</strong> — {experience.date}
        </div>
        <div>
          <em>{experience.organization}, {experience.location}</em>
        </div>
        <div>{experience.description}</div>
      </div>
    </div>
  );
};

export default ExperienceEntry;