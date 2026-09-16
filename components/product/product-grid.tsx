import ProductCard from "./product-card";
import { ProductDisplay } from "@/lib/product-types";

interface ProductGridProps {
  title?: string;
  products: ProductDisplay[];
}

export default function ProductGrid({ title, products }: ProductGridProps) {
  return (
    <section className="w-full py-8">
      {title && (
        <div className="mb-6 md:px-0">
          <h2 className="text-xl sm:text-2xl px-4 md:text-3xl text-center font-black uppercase text-white tracking-tight">
            {title}
          </h2>
        </div>
      )}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6 px-3 sm:px-0 max-w-7xl mx-auto">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
