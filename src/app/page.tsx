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

      <section id="about" className="min-h-screen">
        <About />
      </section>

      <section id="experience" className="min-h-screen">
        <Experience />
      </section>

      <section id="projects" className="min-h-screen">
        <Projects />
      </section>
    </main>
  );
}