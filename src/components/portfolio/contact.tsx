import { profile } from "@/data/portfolio";
import { AssetIcon } from "@/components/ui/asset-icon";
import { BlurText } from "@/components/motion/blur-text";
import { CursorGrid } from "@/components/motion/cursor-grid";

function SocialIcon({ name }: { name: "Facebook" | "Instagram" | "LinkedIn" }) {
  if (name === "Facebook") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M13.7 21v-8h2.7l.4-3h-3.1V8.1c0-.9.3-1.6 1.6-1.6H17V3.8c-.3 0-1.4-.1-2.5-.1-2.5 0-4.3 1.5-4.3 4.4V10H7.3v3h2.9v8h3.5Z" />
      </svg>
    );
  }

  if (name === "LinkedIn") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M6.1 8.2H2.7V21h3.4V8.2ZM4.4 3C3.3 3 2.5 3.9 2.5 5s.8 2 1.9 2 1.9-.9 1.9-2S5.5 3 4.4 3ZM21.5 13.7c0-3.8-2-5.6-4.7-5.6-2.2 0-3.2 1.2-3.7 2V8.2H9.7V21h3.4v-6.3c0-1.7.3-3.3 2.4-3.3 2 0 2.1 1.9 2.1 3.4V21h3.4v-7.3h.5Z" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" className="social-icon-dot" />
    </svg>
  );
}

export function Contact() {
  return (
    <footer
      id="contact"
      className="contact"
      data-aos="fade-up"
      data-aos-easing="linear"
      data-aos-duration="1500"
    >
      <CursorGrid
        className="contact-grid"
        cellSize={72}
        color="#5862ec"
        radius={180}
        holdTime={240}
        fadeDuration={900}
        lineWidth={1.4}
        maxOpacity={0.56}
        fillOpacity={0.06}
        gridOpacity={0.04}
        cellRadius={8}
      />
      <div className="page-container contact-content">
        <BlurText
          className="contact-heading"
          text="Ready for the next challenge"
        />
        <div className="contact-links">
          <a href={`mailto:${profile.email}`}>{profile.email}</a>
          <AssetIcon src="/icons/spark.svg" size={42} />
          <a href={profile.phoneHref}>{profile.phone}</a>
        </div>
        <div className="contact-socials" aria-label="Social profiles">
          {(["Facebook", "LinkedIn", "Instagram"] as const).map((name) => (
            <span className="contact-social-icon" key={name} title={name}>
              <SocialIcon name={name} />
              <span className="sr-only">{name}</span>
            </span>
          ))}
        </div>
      </div>
    </footer>
  );
}
