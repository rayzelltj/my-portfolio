"use client";

import { useEffect, useState } from "react";
import { Home, User, Briefcase, Folder } from "lucide-react";

const navItems = [
  { label: "Home", id: "home", href: "/#home", icon: Home },
  { label: "About", id: "about", href: "/#about", icon: User },
  { label: "Experience", id: "experience", href: "/#experience", icon: Briefcase },
  { label: "Projects", id: "projects", href: "/#projects", icon: Folder },
];

const Header = () => {
  const [activeId, setActiveId] = useState("home");

  useEffect(() => {
    const handleScroll = () => {
      const sectionOffsets = navItems.map((item) => {
        const el = document.getElementById(item.id);
        if (!el) return { id: item.id, top: Infinity };
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
    <header className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50 w-[calc(100%-2rem)] sm:w-auto">
      <nav className="backdrop-blur-md bg-surface/70 border border-subtle shadow-lg shadow-black/5 rounded-full px-4 sm:px-8 py-2">
        <ul className="flex justify-between sm:justify-start gap-4 sm:gap-8 text-sm font-medium text-muted">
          {navItems.map((item) => {
            const isActive = activeId === item.id;
            return (
              <li key={item.href}>
                <a
                  href={item.href}
                  aria-current={isActive ? "page" : undefined}
                  className={`relative transition-colors duration-200 ${
                    isActive
                      ? "text-accent font-semibold"
                      : "hover:text-fg"
                  }`}
                >
                  {item.label}
                  <span
                    className={`absolute -bottom-1.5 left-0 h-px w-full bg-accent transition-transform duration-300 origin-left ${
                      isActive ? "scale-x-100" : "scale-x-0"
                    }`}
                  />
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