'use client';

import home from "@/app/resources/home";
import social from "@/app/resources/social";

const iconMap: Record<string, string> = {
  github: "🐙",    // Replace with actual icons later if needed
  linkedin: "💼",
  email: "✉️",
};

const HomeSection = () => {
  return (
    <section style={{ padding: "100px 20px" }}>
      {/* Top content: Name + Avatar */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: "40px",
          flexWrap: "nowrap", // force side-by-side layout
          maxWidth: "800px",
          margin: "0 auto",
        }}
      >
        {/* Left side: name, title, socials placeholder */}
        <div style={{ minWidth: "300px" }}>
          <h1 style={{ fontSize: "3rem", marginBottom: "0.5rem" }}>{home.name}</h1>
          <h2 style={{ fontSize: "1.5rem", color: "#555", marginBottom: "1rem" }}>
            {home.title}
          </h2>
          {/* Social Buttons */}
          <div style={{ display: "flex", flexDirection: "row", gap: "10px", marginTop: "1rem", flexWrap: "wrap" }}>
            {social.map((item) => (
              <a
                key={item.name}
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "flex",
                  alignItems: "center",
                  padding: "10px 16px",
                  border: "1px solid #ccc",
                  borderRadius: "8px",
                  textDecoration: "none",
                  color: "#333",
                  fontSize: "1rem",
                  width: "fit-content",
                  transition: "background 0.2s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "#f0f0f0")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "white")}
              >
                <span style={{ marginRight: "8px" }}>{iconMap[item.icon]}</span>
                {item.name}
              </a>
            ))}
          </div>
        </div>

        {/* Right side: Avatar */}
        <div>
          <img
            src={home.avatar}
            alt={`${home.name} avatar`}
            style={{
              width: "200px",
              height: "200px",
              borderRadius: "50%",
              objectFit: "cover",
            }}
          />
        </div>
      </div>

      {/* Bottom: Full-width description */}
      <div style={{ marginTop: "60px", maxWidth: "800px", marginLeft: "auto", marginRight: "auto" }}>
        <p style={{ fontSize: "1rem", lineHeight: "1.6", color: "#333" }}>
          {home.description}
        </p>
      </div>
    </section>
  );
};

export default HomeSection;