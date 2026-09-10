import Image from "next/image";
import { notFound } from "next/navigation";
import Price from "@/components/product/price";
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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24">
          <div className="relative w-full aspect-square rounded-3xl border border-white/10 bg-[#13161C] overflow-hidden flex items-center justify-center">
            <div className="absolute inset-0 bg-gradient-to-t from-[#CCFF00]/5 to-transparent opacity-50 z-0" />
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-contain p-12 z-10"
              priority
            />
          </div>

          <div className="flex flex-col justify-center">
            <div className="flex items-center gap-3 mb-6">
              <span className="px-3 py-1 rounded-full border border-white/10 bg-[#13161C] text-[#8E8E93] text-xs font-bold uppercase tracking-widest">
                {product.category.title}
              </span>
              <span className="flex items-center text-[#CCFF00] text-sm font-bold">
                ★ {product.reviews.length
                  ? (
                      product.reviews.reduce((sum, review) => sum + review.rating, 0) /
                      product.reviews.length
                    ).toFixed(1)
                  : "0.0"}
                <span className="text-[#8E8E93] ml-1">
                  ({product.reviews.length})
                </span>
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black uppercase text-white tracking-tight leading-[1.1]">
              {product.name}
            </h1>

            <p className="text-lg text-[#8E8E93] mt-6 leading-relaxed max-w-lg">
              {product.description}
            </p>

            <div className="w-full h-px bg-white/10 my-8" />

            <Price
              variants={product.variants}
              id={product.id}
            />
          </div>
        </div>
        <Reviews />
      </div>
    </main>
  );
}
