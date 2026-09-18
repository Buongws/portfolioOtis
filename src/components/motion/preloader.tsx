"use client";

import { useEffect, useRef, useState } from "react";
import { animate } from "framer-motion";

export function Preloader() {
  const surface = useRef<HTMLDivElement>(null);
  const counter = useRef<HTMLSpanElement>(null);
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    const overlay = surface.current!;
    const content = document.getElementById("site-content")!;
    const previousOverflow = document.documentElement.style.overflow;
    const previousInert = content.inert;
    document.documentElement.style.overflow = "hidden";
    content.inert = true;
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    let cancelled = false;
    let exit: ReturnType<typeof animate> | undefined;
    const restore = () => {
      document.documentElement.style.overflow = previousOverflow;
      content.inert = previousInert;
    };
    const progress = animate(0, 100, {
      duration: reduced ? 0.15 : 2.2,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (value) => {
        if (counter.current)
          counter.current.textContent = String(Math.floor(value));
      },
      onComplete: () => {
        if (cancelled) return;
        exit = animate(overlay, reduced ? { opacity: 0 } : { y: "-100%" }, {
          delay: reduced ? 0 : 0.2,
          duration: reduced ? 0.1 : 0.9,
          ease: [0.76, 0, 0.24, 1],
          onComplete: () => {
            restore();
            setFinished(true);
          },
        });
      },
    });
    return () => {
      cancelled = true;
      progress.stop();
      exit?.stop();
      restore();
    };
  }, []);

  if (finished) return null;

  return (
    <div
      className="preloader"
      ref={surface}
      role="status"
      aria-label="Welcome. Preparing portfolio."
    >
      <div className="preloader-mesh" aria-hidden="true" />
      <div className="preloader-top" aria-hidden="true">
        <span>DVC®</span>
        <span>Creative portfolio / 2026</span>
      </div>
      <div className="preloader-count" aria-hidden="true">
        <span ref={counter}>0</span>
        <span className="preloader-percent">%</span>
      </div>
      <div className="preloader-bottom" aria-hidden="true">
        <span>
          <i /> A little hello before we begin.
        </span>
        <span>UI / UX & Product Design</span>
      </div>
    </div>
  );
}
