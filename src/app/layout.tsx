import type { Metadata } from "next";
import { Space_Grotesk } from "next/font/google";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-space-grotesk",
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3001",
  ),
  title: {
    default: "Dong Van Cuong | UI/UX & Product Designer",
    template: "%s | Dong Van Cuong",
  },
  description:
    "UI/UX & Product Designer with 5 years of experience designing meaningful experiences for web, mobile, and blockchain products.",
  openGraph: {
    title: "Dong Van Cuong | Portfolio",
    description: "Designing for people. UI/UX & Product Design.",
    type: "website",
    images: [
      {
        url: "/images/cover.png",
        width: 1920,
        height: 1080,
        alt: "Portfolio - UI UX Designer",
      },
    ],
  },
  twitter: { card: "summary_large_image", images: ["/images/cover.png"] },
  icons: { icon: "/icons/spark.svg" },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={spaceGrotesk.variable}>
      <body>
        <a className="skip-link" href="#main-content">
          Skip to content
        </a>
        {children}
      </body>
    </html>
  );
}
