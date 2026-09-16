import { skills } from "@/data/portfolio";
import { SkillIcon } from "@/components/portfolio/skill-icon";
import { RevealHeading } from "@/components/motion/reveal-heading";

export function CoreSkills() {
  return (
    <section
      id="skills"
      className="page-container skills-section"
      aria-labelledby="skills-heading"
      data-aos="fade-up"
      data-aos-easing="linear"
      data-aos-duration="1500"
    >
      <div className="skills-scroll-content">
        <RevealHeading
          id="skills-heading"
          className="section-title text-center"
        >
          Core Skills
        </RevealHeading>
        <ul className="skills-list">
          {skills.map((skill) => (
            <li key={skill.id} className="skill" data-figma-node={skill.node}>
              <SkillIcon id={skill.id} />
              <h3>{skill.label}</h3>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
