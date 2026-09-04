"use client";
import { useParams } from "next/navigation";
import { Product } from "@/lib/project-utils";
import ProductGrid from "@/components/product/product-grid";
import { PRODUCT_DATA } from "@/lib/project-utils";
export default function CategoryPage() {
  const { category } = useParams();
  const TITLE = category?.toString();
  const PRODUCTS: Product[] = PRODUCT_DATA.filter(
    (product) => product.category.toLowerCase() == category,
  );
  console.log("CATEGORY PAGE PRODUCTS:", PRODUCTS);
  return (
    <main>
      <ProductGrid title={TITLE} products={PRODUCTS} />
    </main>
  );
}
