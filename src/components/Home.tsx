'use client';

import home from "@/app/resources/home";
import social from "@/app/resources/social";
import { JSX } from "react";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { MdEmail } from "react-icons/md"; // For email icon

const iconMap: Record<string, JSX.Element> = {
  github: <FaGithub size={20} />,
  linkedin: <FaLinkedin size={20} />,
  email: <MdEmail size={20} />,
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
            {social.map((item) => {
              const isEmail = item.link.startsWith('mailto:');
              return (
                <a
                  key={item.name}
                  href={item.link}
                  {...(!isEmail && { target: "_blank", rel: "noopener noreferrer" })}
                  className="flex items-center gap-2 px-5 py-2 rounded-full bg-gray-100 text-black border border-gray-300 shadow-sm hover:bg-gray-200 transition"
                >
                  <span className="text-xl">{iconMap[item.icon]}</span>
                  <span className="font-medium">{item.name}</span>
                </a>
              );
            })}
          </div>
        </div>

        {/* Right side: Avatar */}
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