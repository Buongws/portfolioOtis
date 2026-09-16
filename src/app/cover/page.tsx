import Image from "next/image";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Portfolio Cover" };
export default function CoverPage() {
  return (
    <main id="main-content" className="cover" data-figma-node="1:893">
      <Image
        src="/images/cover.png"
        alt="Portfolio - UI UX Designer"
        width={1920}
        height={1080}
        preload
        sizes="100vw"
      />
      <h1 className="sr-only">Dong Van Cuong - UI UX Designer Portfolio</h1>
    </main>
  );
}
