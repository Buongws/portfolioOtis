"use client";

import Image from "next/image";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useEffect, useRef } from "react";
import { useProject } from "@/context/project-context";
import { projects } from "@/data/portfolio";
import { RevealHeading } from "@/components/motion/reveal-heading";

export function ProjectGallery() {
  const { activeIndex, selectProject } = useProject();
  const scrollContent = useRef<HTMLDivElement>(null);
  const viewport = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const scrollToProject = useRef<(index: number) => boolean>(() => false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let disposed = false;
    let cleanup: (() => void) | undefined;

    void Promise.all([import("gsap"), import("gsap/ScrollTrigger")]).then(
      ([gsapModule, scrollTriggerModule]) => {
        if (disposed) return;

        const gsap = gsapModule.gsap;
        const { ScrollTrigger } = scrollTriggerModule;
        gsap.registerPlugin(ScrollTrigger);

        const media = gsap.matchMedia();
        media.add("(min-width: 768px)", () => {
          const content = scrollContent.current;
          const rail = track.current;
          const galleryViewport = viewport.current;
          if (!content || !rail || !galleryViewport) return;

          let displayedIndex = -1;
          const selectDisplayedProject = (index: number) => {
            if (index === displayedIndex) return;
            displayedIndex = index;
            selectProject(index);
          };
          const updateActiveProject = (progress: number) =>
            selectDisplayedProject(
              Math.min(
                projects.length - 1,
                Math.round(progress * (projects.length - 1)),
              ),
            );
          const getTravelDistance = () =>
            Math.max(0, rail.scrollWidth - window.innerWidth);
          const revealGallery = () => {
            content.classList.add("project-gallery-ready");
            gsap.set(content, { autoAlpha: 1 });
            gsap.fromTo(
              galleryViewport,
              { autoAlpha: 0, y: 64 },
              {
                autoAlpha: 1,
                duration: 1.1,
                ease: "power3.out",
                overwrite: "auto",
                y: 0,
              },
            );
          };
          const concealGallery = () => {
            gsap.killTweensOf(galleryViewport);
            content.classList.remove("project-gallery-ready");
            gsap.set(galleryViewport, {
              clearProps: "transform,opacity,visibility",
            });
          };

          galleryViewport.classList.add("project-scroll-ready");
          const tween = gsap.to(rail, {
            x: () => -getTravelDistance(),
            ease: "none",
            scrollTrigger: {
              trigger: content,
              start: "top top",
              end: () => `+=${getTravelDistance()}`,
              pin: true,
              pinType: "fixed",
              pinReparent: true,
              scrub: 0.65,
              anticipatePin: 1,
              invalidateOnRefresh: true,
              onEnter: revealGallery,
              onEnterBack: revealGallery,
              onLeaveBack: concealGallery,
              onRefresh: (trigger) => updateActiveProject(trigger.progress),
              onUpdate: (trigger) => updateActiveProject(trigger.progress),
            },
          });

          scrollToProject.current = (index) => {
            const scrollTrigger = tween.scrollTrigger;
            if (!scrollTrigger) return false;

            window.scrollTo({
              top:
                scrollTrigger.start +
                ((scrollTrigger.end - scrollTrigger.start) * index) /
                  (projects.length - 1),
              behavior: "smooth",
            });
            return true;
          };

          requestAnimationFrame(() => {
            ScrollTrigger.refresh();
          });

          return () => {
            galleryViewport.classList.remove("project-scroll-ready");
            concealGallery();
            scrollToProject.current = () => false;
          };
        });

        cleanup = () => media.revert();
      },
    );

    return () => {
      disposed = true;
      cleanup?.();
    };
  }, [selectProject]);

  function showProject(index: number) {
    selectProject(index);
    if (scrollToProject.current(index)) return;

    const item = track.current?.children[index] as HTMLElement | undefined;
    viewport.current?.scrollTo({
      left: item?.offsetLeft ?? 0,
      behavior: "smooth",
    });
  }

  return (
    <section
      id="work"
      className="projects-section"
      aria-labelledby="projects-heading"
      data-aos="fade-up"
      data-aos-easing="linear"
      data-aos-duration="1500"
    >
      <div className="project-scroll-content" ref={scrollContent}>
        <div className="page-container flex items-end justify-between gap-4">
          <RevealHeading id="projects-heading" className="section-title">
            Product
          </RevealHeading>
          <div className="gallery-controls">
            <button
              className="icon-button"
              type="button"
              onClick={() => showProject(activeIndex - 1)}
              disabled={activeIndex === 0}
              aria-label="Previous project"
              title="Previous project"
            >
              <ArrowLeft size={22} />
            </button>
            <button
              className="icon-button"
              type="button"
              onClick={() => showProject(activeIndex + 1)}
              disabled={activeIndex === projects.length - 1}
              aria-label="Next project"
              title="Next project"
            >
              <ArrowRight size={22} />
            </button>
          </div>
        </div>
        <div
          className="project-viewport"
          ref={viewport}
          tabIndex={0}
          role="region"
          aria-label="Project gallery"
        >
          <div className="project-track" ref={track}>
            {projects.map((project, index) => (
              <figure
                key={project.id}
                className={`project-card ${index === activeIndex ? "project-active" : ""}`}
              >
                <Image
                  src={project.image}
                  alt={project.alt}
                  fill
                  sizes="(max-width: 767px) 92vw, 63vw"
                  className="object-cover object-top"
                />
              </figure>
            ))}
          </div>
        </div>
      </div>
      <p className="sr-only" aria-live="polite">
        Project {activeIndex + 1} of {projects.length}
      </p>
    </section>
  );
}
