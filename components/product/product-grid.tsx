import ProductCard from "./product-card";
import { ProductDisplay } from "@/lib/product-types";

interface ProductGridProps {
  title?: string;
  products: ProductDisplay[];
}

export default function ProductGrid({ title, products }: ProductGridProps) {
  return (
    <section className="w-full py-10 sm:py-14">
      <div className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8">
        {title && (
          <div className="mb-5 sm:mb-8">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-black uppercase tracking-tight text-white">
              {title}
            </h2>
          </div>
        )}

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-3 gap-y-8 sm:gap-x-6 sm:gap-y-10">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
