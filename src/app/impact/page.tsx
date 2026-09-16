import type { Metadata } from "next";
import { Portfolio } from "@/components/portfolio/portfolio";

export const metadata: Metadata = { title: "Designing for Impact" };
export default function ImpactPage() {
  return <Portfolio variant="impact" />;
}
