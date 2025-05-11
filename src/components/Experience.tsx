import experience from "@/app/resources/experience";
import ExperienceEntry from "./ExperienceEntry";

const Experience = () => {
  return (
    <section className="max-w-4xl px-6 mx-auto py-24">
      <h2 className="text-3xl font-semibold mb-8 text-gray-800 text-center">Experience</h2>
      <div>
        {experience.map((exp, index) => (
          <ExperienceEntry key={index} experience={exp} />
        ))}
      </div>
    </section>
  );
};

export default Experience;