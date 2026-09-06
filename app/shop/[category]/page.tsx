import ProductGrid from "@/components/product/product-grid";
import { getProductsByCategory } from "@/actions/product-actions";
interface CategoryPageProps {
  params: Promise<{ category: string }>;
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { category } = await params;
  const PRODUCTS = await getProductsByCategory(category);
  console.log("CATEGORY PAGE PRODUCTS:", PRODUCTS);
  return (
    <main>
      <ProductGrid title={category} products={PRODUCTS} />
    </main>
  );
}
