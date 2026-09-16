"use client";

import dynamic from "next/dynamic";

// Client boundaries split code while preserving prerendered section HTML.
export const ProjectGallery = dynamic(() =>
  import("@/components/portfolio/project-gallery").then(
    (module) => module.ProjectGallery,
  ),
);

export const CareerJourney = dynamic(() =>
  import("@/components/portfolio/career-journey").then(
    (module) => module.CareerJourney,
  ),
);
