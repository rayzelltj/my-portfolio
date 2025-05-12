"use client";

import { useEffect, useState } from "react";
import { Home, User, Briefcase, Folder } from "lucide-react";

const navItems = [
  { label: "Home", href: "#home", icon: Home },
  { label: "About", href: "#about", icon: User },
  { label: "Experience", href: "#experience", icon: Briefcase },
  { label: "Projects", href: "#projects", icon: Folder },
];

const Header = () => {
  const [activeId, setActiveId] = useState("home");

  useEffect(() => {
    const handleScroll = () => {
      const sectionOffsets = navItems.map((item) => {
        const el = document.getElementById(item.href.slice(1));
        if (!el) return { id: item.href.slice(1), top: Infinity };
        const rect = el.getBoundingClientRect();
        return { id: el.id, top: Math.abs(rect.top) };
      });

      const closest = sectionOffsets.reduce((a, b) =>
        a.top < b.top ? a : b
      );

      setActiveId(closest.id);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // initialize on mount

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50">
      <nav className="backdrop-blur-md bg-white/30 border border-white/40 shadow-lg rounded-full px-8 py-2">
        <ul className="flex space-x-8 text-sm font-medium text-black">
          {navItems.map((item) => {
            const isActive = activeId === item.href.slice(1);
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