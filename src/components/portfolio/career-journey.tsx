import { CareerCard } from "@/components/portfolio/career-card";
import { career } from "@/data/portfolio";
import { RevealHeading } from "@/components/motion/reveal-heading";

export function CareerJourney() {
  return (
    <section
      id="experience"
      className="career-section"
      aria-labelledby="career-heading"
      data-figma-node="1:298"
    >
      <div className="page-container">
        <div className="career-scroll-content">
          <RevealHeading id="career-heading" data-career-heading>
            Career Journey
          </RevealHeading>
          <div className="career-desktop">
            <div
              className="career-stack"
              role="list"
              aria-label="Career experience"
            >
              {career.map((entry, index) => (
                <div
                  className="career-stack-card"
                  key={entry.id}
                  role="listitem"
                  data-career-reveal={index > 0 ? "" : undefined}
                >
                  <CareerCard entry={entry} />
                </div>
              ))}
            </div>
          </div>
          <div className="career-mobile">
            {career.map((entry, index) => (
              <div
                className="career-mobile-card"
                key={entry.id}
                data-career-reveal={index > 0 ? "" : undefined}
              >
                <CareerCard entry={entry} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
