"use client";

const navItems = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Experience", href: "#experience" },
  { label: "Projects", href: "#projects" },
];

const Header = () => {
  return (
    <header
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "60px",
        position: "fixed", // optional: makes it stick to the top
        top: 0,
        width: "100%",
        background: "#fff", // optional background
        zIndex: 1000,
      }}
    >
      <nav>
        <ul style={{ display: "flex", listStyle: "none", padding: 0, margin: 0 }}>
          {navItems.map((item) => (
            <li key={item.href} style={{ margin: "0 20px" }}>
              <a href={item.href}>{item.label}</a>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
};

export default Header;