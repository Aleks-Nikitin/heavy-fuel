import HeroBanner from "@/components/hero-banner/hero-banner";
import Category from "@/components/category/category";
import ProductGrid from "@/components/product/product-grid";
import { getProducts } from "@/actions/product-actions";

export default async function Home() {
  const products = await getProducts();

  return (
    <main>
      <HeroBanner />
      <Category />
      <ProductGrid title="Most Popular Products" products={products} />
    </main>
  );
}
