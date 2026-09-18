"use client";

import Image from "next/image";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useEffect, useRef, type PointerEvent } from "react";
import { useProject } from "@/context/project-context";
import { projects } from "@/data/portfolio";
import { RevealHeading } from "@/components/motion/reveal-heading";

export function ProjectGallery() {
  const { activeIndex, selectProject } = useProject();
  const viewport = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const initialIndex = useRef(activeIndex);
  const drag = useRef<{ x: number; left: number } | null>(null);
  const pendingLeft = useRef<number | null>(null);
  const requestUpdate = useRef<() => void>(() => {});
  const centerNearest = useRef<() => void>(() => {});

  useEffect(() => {
    const gallery = viewport.current!;
    const rail = track.current!;
    const cards = Array.from(rail.children) as HTMLElement[];
    const first = cards[0];
    if (!first) return;
    let frame = 0;
    let offsets: number[] = [];
    let horizontal = false;
    let step = 1;
    let displayedIndex = initialIndex.current;
    const measure = () => {
      offsets = cards.map(
        (card) =>
          card.offsetLeft + card.offsetWidth / 2 - gallery.clientWidth / 2,
      );
      horizontal = gallery.scrollWidth > gallery.clientWidth;
      step = cards[1] ? cards[1].offsetLeft - first.offsetLeft : 1;
    };
    const update = () => {
      frame = 0;
      if (pendingLeft.current !== null) {
        gallery.scrollLeft = pendingLeft.current;
        pendingLeft.current = null;
      }
      // Read once before writing styles; geometry is cached until resize.
      const left = gallery.scrollLeft;
      let nearest = 0;
      let distance = Infinity;
      cards.forEach((card, index) => {
        const delta = Math.abs(offsets[index]! - left);
        const proximity = horizontal ? Math.max(0, 1 - delta / step) : 1;
        const eased = proximity * proximity * (3 - 2 * proximity);
        card.style.setProperty("--project-scale", String(0.84 + eased * 0.24));
        card.style.setProperty(
          "--project-opacity",
          String(0.62 + eased * 0.38),
        );
        if (delta < distance) {
          distance = delta;
          nearest = index;
        }
      });
      if (horizontal && nearest !== displayedIndex) {
        displayedIndex = nearest;
        selectProject(nearest);
      }
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    const settle = () => {
      if (drag.current || !horizontal) return;
      if (pendingLeft.current !== null) {
        gallery.scrollLeft = pendingLeft.current;
        pendingLeft.current = null;
      }
      const left = gallery.scrollLeft;
      const target = offsets.reduce((nearest, offset) =>
        Math.abs(offset - left) < Math.abs(nearest - left) ? offset : nearest,
      );
      if (Math.abs(target - left) < 1) return;
      gallery.scrollTo({
        left: target,
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
          ? "instant"
          : "smooth",
      });
    };
    requestUpdate.current = schedule;
    centerNearest.current = settle;
    measure();
    gallery.scrollLeft = offsets[initialIndex.current]!;
    update();
    gallery.addEventListener("scroll", schedule, { passive: true });
    gallery.addEventListener("scrollend", settle);
    const observer = new ResizeObserver(() => {
      measure();
      schedule();
    });
    observer.observe(gallery);
    observer.observe(rail);
    return () => {
      cancelAnimationFrame(frame);
      requestUpdate.current = () => {};
      centerNearest.current = () => {};
      gallery.removeEventListener("scrollend", settle);
      gallery.removeEventListener("scroll", schedule);
      observer.disconnect();
    };
  }, [selectProject]);

  function startDrag(event: PointerEvent<HTMLDivElement>) {
    if (event.pointerType !== "mouse" || event.button !== 0) return;
    const gallery = event.currentTarget;
    if (gallery.scrollWidth <= gallery.clientWidth) return;
    // Stop any arrow-button scroll before handing control to the pointer.
    gallery.scrollTo({ left: gallery.scrollLeft, behavior: "instant" });
    drag.current = { x: event.clientX, left: gallery.scrollLeft };
    gallery.classList.add("is-dragging");
    gallery.setPointerCapture(event.pointerId);
    event.preventDefault();
  }

  function moveDrag(event: PointerEvent<HTMLDivElement>) {
    if (!drag.current) return;
    pendingLeft.current = drag.current.left + drag.current.x - event.clientX;
    requestUpdate.current();
  }

  function endDrag(event: PointerEvent<HTMLDivElement>) {
    if (!drag.current) return;
    drag.current = null;
    event.currentTarget.classList.remove("is-dragging");
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    centerNearest.current();
  }

  function showProject(index: number) {
    const item = track.current?.children[index] as HTMLElement | undefined;
    const gallery = viewport.current;
    if (!item || !gallery) return;
    pendingLeft.current = null;
    viewport.current?.scrollTo({
      left: item.offsetLeft + item.offsetWidth / 2 - gallery.clientWidth / 2,
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "instant"
        : "smooth",
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
      <div className="project-scroll-content">
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
          onPointerDown={startDrag}
          onPointerMove={moveDrag}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
          onLostPointerCapture={endDrag}
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
                  draggable={false}
                  fill
                  sizes="(max-width: 767px) 92vw, (min-width: 1920px) 758px, 39.48vw"
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
