import HeroBanner from "@/components/hero-banner/hero-banner";
import Category from "@/components/category/category";
import { PRODUCT_DATA } from "@/lib/project-utils";
import ProductCard from "@/components/product/product-card";
import ProductGrid from "@/components/product/product-grid";
export default function Home() {
  return (
    <main>
      <HeroBanner />
      <Category />
      <ProductGrid title="Most Popular Products" products={PRODUCT_DATA} />
    </main>
  );
}
