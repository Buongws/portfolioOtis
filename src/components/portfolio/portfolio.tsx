import { Hero } from "@/components/portfolio/hero";
import {
  ProjectGallery,
  CareerJourney,
} from "@/components/portfolio/deferred-sections";
import { About } from "@/components/portfolio/about";
import { CoreSkills } from "@/components/portfolio/core-skills";
import { Contact } from "@/components/portfolio/contact";
import { ProjectProvider } from "@/context/project-context";
import { PortfolioMotion } from "@/components/motion/portfolio-motion";
import type { PortfolioVariant } from "@/types/portfolio";

export function Portfolio({
  variant = "people",
}: {
  variant?: PortfolioVariant;
}) {
  return (
    <main id="main-content">
      <PortfolioMotion />
      <Hero variant={variant} />
      <About />
      <CoreSkills />
      <ProjectProvider initialIndex={variant === "people" ? 0 : 1}>
        <ProjectGallery />
      </ProjectProvider>
      <CareerJourney />
      <Contact />
    </main>
  );
}
