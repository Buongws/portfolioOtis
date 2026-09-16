import Image from "next/image";
import { profile, profileLinks } from "@/data/portfolio";
import { AssetIcon } from "@/components/ui/asset-icon";
import { ProfileLink } from "@/components/ui/profile-link";

function ScrollWords({ text }: { text: string }) {
  return text.split(/(\s+)/).map((part, index) =>
    part.trim() ? (
      <span key={index} data-scroll-word>
        {part}
      </span>
    ) : (
      part
    ),
  );
}

export function About() {
  return (
    <section
      id="about"
      aria-label="About Dong Van Cuong"
      className="page-container about"
      data-aos="fade-up"
      data-aos-easing="linear"
      data-aos-duration="1500"
    >
      <div className="about-stack" aria-hidden="true">
        <i />
        <i />
        <i />
      </div>
      <div className="about-surface">
        <div className="about-masthead">
          <span>{profile.name}</span>
          <AssetIcon src="/icons/spark.svg" size={42} />
          <span className="masthead-extra">Portfolio</span>
          <AssetIcon
            src="/icons/spark.svg"
            size={42}
            className="masthead-extra"
          />
          <span className="masthead-extra">UI UX Design</span>
        </div>
        <div className="about-grid">
          <div className="portrait">
            <div className="portrait-crop">
              <Image
                src="/images/portrait.png"
                alt="Dong Van Cuong wearing a black T-shirt and sunglasses"
                fill
                loading="eager"
                fetchPriority="high"
                sizes="(max-width: 767px) 90vw, 32vw"
                className="portrait-image"
              />
            </div>
          </div>
          <div className="about-copy" data-scroll-copy>
            <div>
              <p>
                <ScrollWords
                  text={`${profile.introduction}${profile.biography}`}
                />
              </p>
              <p>
                <ScrollWords text={profile.ambition} />
              </p>
            </div>
            <div className="profile-links">
              <ProfileLink
                href={profileLinks.cv}
                primary
                download
                label="Download CV"
              >
                Download CV
              </ProfileLink>
              <ProfileLink href={profileLinks.behance} label="Behance">
                <AssetIcon src="/icons/behance.webp" />
                <span>Behance</span>
              </ProfileLink>
              <ProfileLink href={profileLinks.linkedin} label="LinkedIn">
                <span className="linkedin-icon">
                  <AssetIcon src="/icons/linkedin.webp" />
                </span>
                <span>Linkedin</span>
              </ProfileLink>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
