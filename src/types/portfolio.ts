export type PortfolioVariant = "people" | "impact" | "products";

export interface Project {
  id: string;
  image: string;
  alt: string;
}

export interface CareerEntry {
  id: string;
  role: string;
  company: string;
  period: string;
  freelance?: boolean;
  description: string[];
  tools: string[];
  color: string;
}
