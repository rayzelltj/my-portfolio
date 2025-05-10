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

// const ExperienceEntry = ({ experience }: { experience: ExperienceProps }) => {
//   return (
//     <div className="flex items-start gap-4">
//       {experience.icon && (
//         <img
//           src={experience.icon}
//           alt={`${experience.organization} logo`}
//           width="80"
//           height="80"
//           className="rounded-full border border-black mt-1 "
//         />
//       )}
//       <div>
//         <div>
//           <strong>{experience.role}</strong> — {experience.date}
//         </div>
//         <div>
//           <em>{experience.organization}</em>
//         </div>
//         <div>{experience.location}</div>
//         <div>{experience.description}</div>
//       </div>
//     </div>
//   );
// };

// export default ExperienceEntry;

const ExperienceEntry = ({ experience }: { experience: ExperienceProps }) => {
  return (
    <div className="flex gap-6 p-6 border border-neutral-800 rounded-2xl bg-neutral-900 shadow-md">
      {experience.icon && (
        <div className="flex-shrink-0">
          <img
            src={experience.icon}
            alt={`${experience.organization} logo`}
            width="64"
            height="64"
            className="rounded-xl object-cover border border-neutral-700"
          />
        </div>
      )}

      <div className="flex flex-col gap-2 text-sm text-neutral-300">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
          <div className="text-lg font-semibold text-white">
            {experience.role}
            <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-indigo-600 text-white uppercase tracking-wide">
              {experience.type}
            </span>
          </div>
          <div className="text-sm text-neutral-400 mt-1 sm:mt-0">{experience.date}</div>
        </div>

        <div className="text-neutral-200">
          <span className="font-medium">{experience.organization}</span> · {experience.location}
        </div>

        <p className="mt-1 text-neutral-400 leading-relaxed">{experience.description}</p>
      </div>
    </div>
  );
};

export default ExperienceEntry;