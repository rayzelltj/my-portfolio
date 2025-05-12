"use client";

import { useEffect, useState } from "react";
import { Home, User, Briefcase, Folder } from "lucide-react";

const navItems = [
  { label: "Home", href: "#home", icon: Home},
  { label: "About", href: "#about", icon: User },
  { label: "Experience", href: "#experience", icon: Briefcase},
  { label: "Projects", href: "#projects", icon: Folder},
];

const Header = () => {
  const [activeId, setActiveId] = useState<string>("home");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visibleSection = entries.find((entry) => entry.isIntersecting);
        if (visibleSection?.target.id) {
          setActiveId(visibleSection.target.id);
        }
      },
      {
        threshold: 0.6,
      }
    );

    const sectionIds = navItems.map((item) => item.href.replace("#", ""));
    const sections = sectionIds.map((id) => document.getElementById(id)).filter(Boolean);

    sections.forEach((section) => observer.observe(section!));

    return () => {
      sections.forEach((section) => observer.unobserve(section!));
    };
  }, []);

  return (
    <header className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50">
      <nav className="backdrop-blur-md bg-white/30 border border-white/40 shadow-lg rounded-full px-8 py-2">
        <ul className="flex space-x-8 text-sm font-medium text-black">
          {navItems.map((item) => {
            const targetId = item.href.replace("#", "");
            const isActive = activeId === targetId;
            return (
              <li key={item.href}>
                <a
                  href={item.href}
                  className={`transition-colors ${
                    isActive ? "text-indigo-600 font-semibold" : "hover:text-indigo-600"
                  }`}
                >
                  {item.label}
                </a>
              </li>
            );
          })}
        </ul>
      </nav>
    </header>
  );
};

export default Header;