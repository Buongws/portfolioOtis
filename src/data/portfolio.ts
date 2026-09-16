import type { CareerEntry, Project } from "@/types/portfolio";

export const profile = {
  name: "Dong Van Cuong",
  email: "Otisdong.freelancer@gmail.com",
  phone: "098 2525 869",
  phoneHref: "tel:+84982525869",
  tagline:
    "UI/UX & Product Designer turning complex problems into simple, meaningful experiences.",
  introduction:
    "I am Cuong, a UI/UX & Product Designer with 5 years of experience specializing in high-impact digital solutions for Web, ",
  biography:
    "Mobile, and complex Blockchain ecosystems. My approach goes beyond aesthetics; I thrive in business analysis, user research, and cross-functional collaboration to transform intricate requirements into intuitive, user-centric products.",
  ambition:
    "With proven expertise in building scalable Design Systems and optimizing UX, I am dedicated to delivering peak value to both the business and the end-user. Driven by a strategic mindset and high responsibility, I am currently evolving toward Team Leadership, PO, and PM roles to lead long-term design and product strategies. My English proficiency is currently at a basic level.",
};

// Add verified destinations here when the owner supplies them.
export const profileLinks: {
  cv: string | null;
  behance: string | null;
  linkedin: string | null;
} = {
  cv: null,
  behance: null,
  linkedin: null,
};

export const skills = [
  { id: "ui-ux", label: "UI UX Design", node: "1:491" },
  { id: "research", label: "Research", node: "1:574" },
  { id: "design-system", label: "Design System", node: "1:547" },
  { id: "ai-tool", label: "AI Tool", node: "1:526" },
] as const;

export const projects: Project[] = [
  {
    id: "monero",
    image: "/images/monero.webp",
    alt: "Monero mobile wallet design displayed on a phone held by a black-gloved hand",
  },
  {
    id: "web3",
    image: "/images/web3.webp",
    alt: "Web3 mobile product with dark wallet, NFT collection, and exchange screens",
  },
  {
    id: "web3-2",
    image: "/images/web3.webp",
    alt: "Web3 product interface study, second placement from the Figma design",
  },
  {
    id: "web3-3",
    image: "/images/web3.webp",
    alt: "Web3 product interface study, third placement from the Figma design",
  },
];

export const designTools = [
  "Figma",
  "Photoshop",
  "illustrator",
  "After Effect",
  "Premiere",
];
export const toolIcons: Record<string, string> = {
  Figma: "figma.svg",
  Photoshop: "photoshop.svg",
  illustrator: "illustrator.svg",
  "After Effect": "after-effects.svg",
  Premiere: "premiere.svg",
};

export const career: CareerEntry[] = [
  {
    id: "01",
    role: "Product Designer & Graphic Designer",
    company: "MP Solutions",
    period: "6/2019 - 6/2021",
    color: "#3730a3",
    tools: designTools,
    description: [
      "Design and develop products from concept to reality, research user needs, and collaborate with technical, marketing, and production teams to finalize the product.",
      "Create advertising materials, develop brand imagery.",
    ],
  },
  {
    id: "02",
    role: "UI UX Designer",
    company: "IsoftCare",
    period: "6/2021 - 12/2021",
    color: "#4338ca",
    tools: designTools,
    description: [
      "Develop, improve, and research medical-related software.",
      "Research user behavior, ensure product usability, logical UX, and a good user experience.",
    ],
  },
  {
    id: "03",
    role: "Product Designer",
    company: "MooonLab",
    period: "10/2021 - 31/12/2025",
    color: "#4f46e5",
    tools: [...designTools, "AI Tool"],
    description: [
      "Design and develop products from concept to reality, research user needs, and collaborate with technical, marketing, and production teams to finalize blockchain-related products: Design websites, mobile apps, dApps, DEx, CEX, marketplaces, etc.",
    ],
  },
  {
    id: "04",
    role: "Product Designer & Graphic Designer",
    company: "People Connect",
    period: "10/2023 - Present",
    freelance: true,
    color: "#6163e8",
    tools: [...designTools, "AI Tool"],
    description: [
      "Build and develop products according to customer needs. Build and develop People Connect products. Design advertising materials, develop brand imagery, and ensure customer requirements are met.",
    ],
  },
];
