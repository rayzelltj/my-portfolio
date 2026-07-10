import social from "@/app/resources/social";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import type { JSX } from "react";

const iconMap: Record<string, JSX.Element> = {
  github: <FaGithub size={18} />,
  linkedin: <FaLinkedin size={18} />,
  email: <MdEmail size={18} />,
};

export default function Footer() {
  return (
    <footer className="border-t border-subtle mt-24 py-12 text-sm text-center text-muted">
      <div className="max-w-4xl mx-auto px-4 flex flex-col items-center gap-6">
        {/* Socials */}
        <div className="flex items-center gap-5">
          {social.map((item) => {
            const isEmail = item.link.startsWith("mailto:");
            return (
              <a
                key={item.name}
                href={item.link}
                aria-label={item.name}
                {...(!isEmail && { target: "_blank", rel: "noopener noreferrer" })}
                className="text-muted hover:text-accent transition-colors"
              >
                {iconMap[item.icon]}
              </a>
            );
          })}
        </div>

        <p className="font-mono text-xs text-muted">
          Thanks for stopping by :)
        </p>
        <p className="text-xs text-muted/70">
          © {new Date().getFullYear()} Rayzell Tjandra — built with Next.js &amp; Tailwind.
        </p>
      </div>
    </footer>
  );
}
