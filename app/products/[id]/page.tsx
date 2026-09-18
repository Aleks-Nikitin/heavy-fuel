import { notFound } from "next/navigation";
import ProductInfo from "@/components/product/product-info";
import Reviews from "@/components/product/reviews";
import { getProductById } from "@/lib/actions/product-actions";
interface ProductPageProps {
  params: Promise<{ id: string }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params;
  const product = await getProductById(id);
  if (!product) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-[#0B0D10] py-12 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ProductInfo product={product} />

        <div id="reviews" className="scroll-mt-24">
          <Reviews
            productId={product.id}
            productName={product.name}
            reviews={product.reviews}
          />
        </div>
      </div>
    </main>
  );
}
