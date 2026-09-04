import ProductCard from "./product-card";
import { Product } from "@/lib/project-utils";

interface ProductGridProps {
  title?: string;
  products: Product[];
}

export default function ProductGrid({ title, products }: ProductGridProps) {
  return (
    <section className="w-full py-8">
      {title && (
        <div className="mb-6 md:px-0">
          <h2 className="text-2xl px-4 md:text-3xl text-center font-black uppercase text-white tracking-tight">
            {title}
          </h2>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 px-4 md:px-0">
        {/* make a backend script to fetch only the most popular products    */}
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
