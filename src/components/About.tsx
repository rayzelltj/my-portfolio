import about from '../app/resources/about';

const About = () => {
  return (
    <section className="max-w-3xl mx-auto px-6 py-24 text-center">
      <h2 className="text-3xl font-semibold mb-8 text-gray-800">About Me</h2>
      {about.description.map((paragraph, idx) => (
        <p key={idx} className="mb-6 text-lg text-gray-600 leading-relaxed">
          {paragraph}
        </p>
      ))}
    </section>
  );
};

export default About;