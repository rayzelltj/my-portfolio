export default function AboutPage() {
    return (
      <section className="max-w-3xl mx-auto px-6 py-24 space-y-16">
        {/* Intro */}
        <div className="space-y-4 text-center">
          <h1 className="text-3xl md:text-5xl font-bold">About Me</h1>
          <p className="text-gray-400 text-lg">
            I’m Rayzell Tjandra — a creative developer passionate about building beautiful, accessible, and interactive web experiences.
          </p>
        </div>
  
        {/* Bio */}
        <div className="text-gray-300 text-base space-y-6">
          <p>
            My journey into design and development started with curiosity and creativity. Over time, I’ve grown a strong passion for building digital products that balance form and function.
          </p>
          <p>
            I love working with modern tools like <strong>Next.js</strong>, <strong>Tailwind CSS</strong>, and <strong>TypeScript</strong>. I’m also drawn to animation, microinteractions, and great UX.
          </p>
        </div>
  
        {/* Skills */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Technologies I Use</h2>
          <ul className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm text-gray-400">
            <li>Next.js</li>
            <li>React</li>
            <li>TypeScript</li>
            <li>Tailwind CSS</li>
            <li>Figma</li>
            <li>Framer Motion</li>
          </ul>
        </div>
      </section>
    );
  }
  