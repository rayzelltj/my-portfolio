type ProjectItem = {
    title: string;       // Project name (e.g., "Personal Portfolio")
    description: string; // Short description of the project
    technologies: string[]; // Technologies used (e.g., ["Next.js", "Tailwind CSS", "TypeScript"])
    link: string;        // Link to the live project or GitHub (e.g., "https://github.com/user/project")
    image?: string;      // Optional: link to an image or screenshot of the project
};

const projects: ProjectItem[] = [
    {
      title: 'Personal Portfolio',
      description: 'A personal portfolio website built with Next.js and Tailwind CSS to showcase my work and skills.',
      technologies: ['Next.js', 'Tailwind CSS', 'TypeScript'],
      link: 'https://github.com/your-username/portfolio',  // Link to your GitHub or live site
      image: '/images/portfolio-screenshot.png',           // Optional project screenshot
    },
    {
      title: 'Weather App',
      description: 'A weather app that fetches data from an API to show current weather in any location.',
      technologies: ['React', 'Tailwind CSS', 'OpenWeather API'],
      link: 'https://github.com/your-username/weather-app',
      image: '/images/weather-app-screenshot.png',
    },
    {
      title: 'Task Manager',
      description: 'A task manager app that allows users to create, update, and delete tasks.',
      technologies: ['Vue.js', 'Vuetify'],
      link: 'https://github.com/your-username/task-manager',
    },
];

export default function ProjectsPage() {
    return (
      <section className="max-w-5xl mx-auto px-6 py-24 space-y-16">
        <h1 className="text-3xl md:text-5xl font-bold text-center">Projects</h1>
  
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12 mt-12">
          {projects.map((project, index) => (
            <div key={index} className="bg-gray-800 rounded-lg overflow-hidden shadow-lg">
              {project.image && (
                <div className="w-full h-48 overflow-hidden">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div className="p-6">
                <h3 className="text-xl font-semibold text-white">{project.title}</h3>
                <p className="text-gray-400 mt-2">{project.description}</p>
                <ul className="flex space-x-3 mt-4 text-sm text-gray-400">
                  {project.technologies.map((tech, idx) => (
                    <li key={idx} className="bg-gray-700 px-2 py-1 rounded-full">
                      {tech}
                    </li>
                  ))}
                </ul>
                <div className="mt-4">
                  <a
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-semibold text-blue-400 hover:text-blue-500"
                  >
                    View Project
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }