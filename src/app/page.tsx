import HomeSection from "@/components/Home";
import About from "@/components/About";
import Experience from "@/components/Experience";
import Projects from "@/components/Projects";
import "./globals.css";

export default function HomePage() {
  return (
    <main>
      <section id="home" className="scroll-mt-16">
        <HomeSection />
      </section>

      <section id="about">
        <About />
      </section>

      <section id="experience">
        <Experience />
      </section>

      <section id="projects">
        <Projects />
      </section>
    </main>
  );
}