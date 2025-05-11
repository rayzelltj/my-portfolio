'use client';

import home from "@/app/resources/home";
import social from "@/app/resources/social";

const iconMap: Record<string, string> = {
  github: "🐙",
  linkedin: "💼",
  email: "✉️",
};

const HomeSection = () => {
  return (
    <section className="py-24 px-5">
      {/* Top content: Name + Avatar */}
      <div className="flex justify-center items-center gap-10 max-w-3xl mx-auto flex-nowrap flex-col md:flex-row">
        {/* Left side: name, title, socials */}
        <div className="min-w-[300px] text-center md:text-left">
          <h1 className="text-5xl font-bold mb-2">{home.tagline}</h1>
          <h2 className="text-2xl text-gray-600 mb-4">{home.description}</h2>

          {/* Social Buttons */}
          <div className="flex flex-wrap gap-2 justify-center md:justify-start mt-4">
            {social.map((item) => (
              <a
                key={item.name}
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center px-4 py-2 border border-gray-300 rounded-lg text-gray-800 text-base hover:bg-gray-100 transition-colors"
              >
                <span className="mr-2">{iconMap[item.icon]}</span>
                {item.name}
              </a>
            ))}
          </div>
        </div>

        {/* Right side: Avatar */}
        {/* <div className="flex justify-center">
          <img
            src={home.avatar}
            alt={`${home.name} avatar`}
            className="w-[200px] h-[200px] rounded-full object-cover"
          />
        </div> */}
        <div className="flex justify-center">
          <div className="relative w-[220px] h-[220px] rounded-full p-[5px] overflow-hidden ring-avatar">
            <div className="w-full h-full rounded-full overflow-hidden">
              <img
                src={home.avatar}
                alt={`${home.tagline} avatar`}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HomeSection;