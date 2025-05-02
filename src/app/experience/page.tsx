type ExperienceItem = {
    role: string;        // The job role (e.g., "Frontend Developer Intern")
    company: string;     // The company or organization name (e.g., "TechNova Labs")
    location?: string;   // Optional: location of the company (e.g., "Remote")
    start: string;       // The start date (e.g., "June 2023")
    end: string;         // The end date (e.g., "Aug 2023")
    description: string; // A description of the role (e.g., "Built internal dashboard...")
    image: string;       // Path to the logo image (e.g., "/images/technova-logo.png")
};
  
const experience: ExperienceItem[] = [
  {
    role: 'Frontend Developer Intern',
    company: 'TechNova Labs',
    location: 'Remote',
    start: 'June 2023',
    end: 'Aug 2023',
    description: 'Built internal dashboard using Next.js, Tailwind CSS, and Zustand for state management.',
    image: '/images/technova-logo.png', // Add the logo image here
  },
  {
    role: 'Club Web Designer',
    company: 'Design Society',
    start: 'Sept 2022',
    end: 'Present',
    description: 'Led redesign of club website and branding materials using Figma and Webflow.',
    image: '/images/design-society-logo.png', // Add the logo image here
  },
  {
    role: 'Volunteer Tutor',
    company: 'Code for Youth',
    start: 'Jan 2022',
    end: 'Dec 2022',
    description: 'Taught HTML, CSS, and JavaScript to high school students weekly.',
    image: '/images/code-for-youth-logo.png', // Add the logo image here
  },
];

export default function ExperiencePage() {
  return (
    <section className="max-w-3xl mx-auto px-6 py-24">
      <h1 className="text-3xl md:text-5xl font-bold mb-12 text-center">Experience</h1>

      <ol className="relative border-l border-gray-700">
        {experience.map((item, index) => (
          <li key={index} className="mb-10 ml-4">
            <div className="absolute w-3 h-3 bg-white rounded-full -left-1.5 border border-gray-700" />
            <time className="mb-1 text-sm font-normal leading-none text-gray-500">
              {item.start} – {item.end}
            </time>
            <h3 className="text-lg font-semibold text-white">
              {item.role} <span className="text-gray-400">@ {item.company}</span>
            </h3>
            <p className="text-gray-400 text-sm mt-2">{item.description}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}