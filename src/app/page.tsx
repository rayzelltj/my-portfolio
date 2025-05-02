export default function HomePage() {
  return (
    <section className="flex items-center justify-center min-h-screen bg-black text-white px-6 py-24">
      {/* Content Container */}
      <div className="text-center max-w-4xl mx-auto space-y-8">
        {/* Main Heading */}
        <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-white">
          Hi, I’m Rayzell Tjandra
        </h1>

        {/* Subtitle / Description */}
        <p className="mt-4 text-lg md:text-xl text-gray-300 max-w-2xl mx-auto">
          I’m a creative developer with a passion for building beautiful, accessible, and interactive web experiences. Let’s create something amazing together!
        </p>

        {/* Call to Action Buttons */}
        <div className="mt-8 flex justify-center gap-6">
          <a
            href="/about"
            className="inline-block px-8 py-3 text-lg font-semibold text-black bg-teal-400 hover:bg-teal-500 transition-colors rounded-full shadow-lg transform hover:scale-105"
          >
            Learn More About Me
          </a>
          <a
            href="/projects"
            className="inline-block px-8 py-3 text-lg font-semibold text-teal-400 border border-teal-400 hover:bg-teal-400 hover:text-white transition-colors rounded-full shadow-lg transform hover:scale-105"
          >
            View My Projects
          </a>
        </div>
      </div>
    </section>
  );
}