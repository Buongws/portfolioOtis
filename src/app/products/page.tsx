import type { Metadata } from "next";
import { Portfolio } from "@/components/portfolio/portfolio";

export const metadata: Metadata = { title: "Designing for Products" };
export default function ProductsPage() {
  return <Portfolio variant="products" />;
}
