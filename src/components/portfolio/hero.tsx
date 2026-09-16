import Image from "next/image";
import { profile } from "@/data/portfolio";
import type { PortfolioVariant } from "@/types/portfolio";

export function Hero({ variant }: { variant: PortfolioVariant }) {
  return (
    <header
      className="hero"
      data-aos="fade-up"
      data-aos-easing="linear"
      data-aos-duration="1500"
      data-figma-node={
        variant === "people" ? "1:15" : variant === "impact" ? "1:204" : "1:110"
      }
    >
      <div className="hero-background" aria-hidden="true">
        <Image
          src="/images/hero-background.webp"
          alt=""
          fill
          sizes="100vw"
          preload
          className="object-cover"
        />
      </div>
      <div className="page-container hero-content">
        <h1 className="hero-title">
          <span className="hero-prefix">Designing for</span>
          <strong className="hero-word-desktop" aria-hidden="true">
            <span
              data-typewriter
              data-typewriter-initial={variant.toUpperCase()}
            >
              {variant}
            </span>
            .
          </strong>
          <strong className="hero-word-mobile" aria-hidden="true">
            <span
              data-typewriter
              data-typewriter-initial={variant.toUpperCase()}
            >
              {variant}
            </span>
            .
          </strong>
          <span className="sr-only">people, products, and impacts.</span>
        </h1>
        <p className="hero-tagline">{profile.tagline}</p>
      </div>
    </header>
  );
}
