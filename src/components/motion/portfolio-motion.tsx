"use client";

import { useEffect } from "react";

export function PortfolioMotion() {
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

        const context = gsap.context(() => {
          gsap.utils.toArray<HTMLElement>("[data-aos]").forEach((section) => {
            if (section.getBoundingClientRect().top < window.innerHeight) {
              gsap.set(section, { autoAlpha: 1, y: 0 });
              return;
            }

            gsap.to(section, {
              autoAlpha: 1,
              y: 0,
              duration: Number(section.dataset.aosDuration) / 1000 || 1.5,
              ease:
                section.dataset.aosEasing === "linear" ? "none" : "power2.out",
              scrollTrigger: {
                trigger: section,
                start: "top 88%",
                once: true,
              },
            });
          });

          document
            .querySelectorAll<HTMLElement>("[data-typewriter]")
            .forEach((element) => {
              const words = ["PEOPLE", "PRODUCTS", "IMPACTS"] as const;
              const initialWord =
                words.find(
                  (word) => word === element.dataset.typewriterInitial,
                ) ?? words[0];
              const initialIndex = words.indexOf(initialWord);
              const nextWords = [
                ...words.slice(initialIndex + 1),
                ...words.slice(0, initialIndex + 1),
              ];
              const state = { value: initialWord.length };

              const timeline = gsap.timeline({ repeat: -1 });
              timeline.to(state, {
                value: 0,
                duration: initialWord.length * 0.06,
                delay: 1,
                ease: "none",
                roundProps: "value",
                onUpdate: () => {
                  element.textContent = initialWord.slice(0, state.value);
                },
              });

              nextWords.forEach((word) => {
                const typed = { value: 0 };
                timeline
                  .to({}, { duration: 0.2 })
                  .to(typed, {
                    value: word.length,
                    duration: word.length * 0.11,
                    ease: "none",
                    roundProps: "value",
                    onUpdate: () => {
                      element.textContent = word.slice(0, typed.value);
                    },
                  })
                  .to({}, { duration: 1.1 })
                  .to(typed, {
                    value: 0,
                    duration: word.length * 0.06,
                    ease: "none",
                    roundProps: "value",
                    onUpdate: () => {
                      element.textContent = word.slice(0, typed.value);
                    },
                  });
              });
            });
        });

        const aboutMedia = gsap.matchMedia();
        aboutMedia.add(
          {
            desktop: "(min-width: 768px)",
            mobile: "(max-width: 767px)",
          },
          ({ conditions }) => {
            const section = document.querySelector<HTMLElement>("#about");
            const copy =
              section?.querySelector<HTMLElement>("[data-scroll-copy]");
            const words =
              section?.querySelectorAll<HTMLElement>("[data-scroll-word]");
            if (!section || !copy || !words?.length) return;

            const pin = Boolean(conditions?.desktop);
            gsap.to(words, {
              color: "#020617",
              fontWeight: 700,
              duration: 0.01,
              ease: "none",
              stagger: { each: 0.005 },
              scrollTrigger: {
                trigger: pin ? section : copy,
                start: pin ? "top top" : "top 82%",
                end: pin
                  ? () =>
                      `+=${Math.max(window.innerHeight * 1.5, words.length * 9)}`
                  : "bottom 55%",
                pin: pin ? section : false,
                scrub: 0.35,
                anticipatePin: 1,
                invalidateOnRefresh: true,
              },
            });
          },
        );

        const skillsMedia = gsap.matchMedia();
        skillsMedia.add("(min-width: 768px)", () => {
          const skillsContent = document.querySelector<HTMLElement>(
            ".skills-scroll-content",
          );
          const cards = gsap.utils.toArray<HTMLElement>(".skills-list .skill");
          if (!skillsContent || !cards.length) return;

          let activeIndex = -1;
          let skillSequenceReady = false;
          const setActiveSkill = (index: number) => {
            if (index === activeIndex) return;
            activeIndex = index;
            cards.forEach((card, cardIndex) => {
              card.classList.toggle("skill-scroll-active", cardIndex === index);
            });
          };
          const updateActiveSkill = (progress: number) => {
            setActiveSkill(
              Math.min(cards.length - 1, Math.floor(progress * cards.length)),
            );
          };

          ScrollTrigger.create({
            trigger: skillsContent,
            start: "top top",
            end: () => `+=${Math.round(window.innerHeight * 1.55)}`,
            pin: true,
            pinType: "fixed",
            pinReparent: true,
            scrub: 0.35,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onEnter: (trigger) => {
              gsap.set(skillsContent, { autoAlpha: 1 });
              requestAnimationFrame(() => {
                void cards[0]?.offsetWidth;
                requestAnimationFrame(() => {
                  skillSequenceReady = true;
                  updateActiveSkill(trigger.progress);
                });
              });
            },
            onEnterBack: (trigger) => {
              skillSequenceReady = true;
              updateActiveSkill(trigger.progress);
            },
            onLeaveBack: () => {
              skillSequenceReady = false;
              setActiveSkill(-1);
            },
            onUpdate: (trigger) => {
              if (skillSequenceReady) updateActiveSkill(trigger.progress);
            },
          });

          return () =>
            cards.forEach((card) =>
              card.classList.remove("skill-scroll-active"),
            );
        });

        const careerMedia = gsap.matchMedia();
        careerMedia.add(
          {
            desktop: "(min-width: 768px)",
            mobile: "(max-width: 767px)",
          },
          ({ conditions }) => {
            const selector = conditions?.desktop
              ? ".career-stack-card"
              : ".career-mobile-card";
            const cards = gsap.utils.toArray<HTMLElement>(selector);
            if (!cards.length) return;

            const content = document.querySelector<HTMLElement>(
              ".career-scroll-content",
            );

            cards.forEach((card) => {
              const revealCard = () => {
                card.setAttribute("data-career-visible", "");
                gsap.fromTo(
                  card,
                  { autoAlpha: 0, y: 56 },
                  {
                    autoAlpha: 1,
                    y: 0,
                    duration: 0.9,
                    ease: "power3.out",
                  },
                );
              };

              if (card.hasAttribute("data-career-reveal")) {
                ScrollTrigger.create({
                  trigger: card,
                  start: "top 86%",
                  once: true,
                  onEnter: revealCard,
                });
                return;
              }

              gsap.fromTo(
                card,
                { autoAlpha: 0, y: 56 },
                {
                  autoAlpha: 1,
                  y: 0,
                  duration: 0.9,
                  ease: "power3.out",
                  scrollTrigger: {
                    trigger: card,
                    start: "top 86%",
                    once: true,
                  },
                },
              );
            });

            if (conditions?.desktop && content && cards[2]) {
              ScrollTrigger.create({
                trigger: cards[2],
                start: "top 86%",
                onEnter: () => content.classList.add("career-heading-released"),
                onLeaveBack: () =>
                  content.classList.remove("career-heading-released"),
              });
            }

            return () => content?.classList.remove("career-heading-released");
          },
        );

        cleanup = () => {
          careerMedia.revert();
          skillsMedia.revert();
          aboutMedia.revert();
          context.revert();
        };
      },
    );

    return () => {
      disposed = true;
      cleanup?.();
    };
  }, []);

  return null;
}
