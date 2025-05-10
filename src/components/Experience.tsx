import experience from "@/app/resources/experience";
import ExperienceEntry from "./ExperienceEntry";

const Experience = () => {
  return (
    <section className="bg-red-200 mx-16">
      <h2 className="text-center">Experience</h2>
      <div>
        {experience.map((exp, index) => (
          <ExperienceEntry key={index} experience={exp} />
        ))}
      </div>
    </section>
  );
};

export default Experience;