"use client";

import { useState } from "react";
import Image from "next/image";
import Price from "@/components/product/price";
import { ProductVariantDisplay } from "@/lib/product-types";

type VariantImage = {
  id: string;
  variant: string;
  image: string;
  imagePublicId: string | null;
};

type ProductInfoProps = {
  product: {
    id: string;
    name: string;
    image: string;
    description: string;
    category: {
      title: string;
    };
    variants: ProductVariantDisplay[];
    variantImages: VariantImage[];
    reviews: {
      rating: number;
    }[];
  };
};

export default function ProductInfo({ product }: ProductInfoProps) {
  const flavors = [
    ...new Set(product.variants.map((variant) => variant.variant)),
  ];

  const [selectedVariant, setSelectedVariant] = useState(flavors[0] ?? "");

  const currentImage =
    product.variantImages.find((image) => image.variant === selectedVariant)
      ?.image ?? product.image;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24">
      <div className="relative w-full aspect-square rounded-3xl border border-white/10 bg-[#13161C] overflow-hidden flex items-center justify-center">
        <div className="absolute inset-0 bg-gradient-to-t from-[#CCFF00]/5 to-transparent opacity-50 z-0" />

        <Image
          src={currentImage}
          alt={`${product.name} ${selectedVariant}`}
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

          <a
            href="#reviews"
            className="flex items-center text-[#CCFF00] text-base md:text-lg font-bold hover:scale-105 transition-transform cursor-pointer group"
          >
            ★{" "}
            {product.reviews.length
              ? (
                  product.reviews.reduce(
                    (sum, review) => sum + review.rating,
                    0,
                  ) / product.reviews.length
                ).toFixed(1)
              : "0.0"}
            <span className="text-[#8E8E93] ml-2 underline decoration-white/20 underline-offset-4 group-hover:decoration-[#CCFF00] transition-colors">
              Read {product.reviews.length} Reviews
            </span>
          </a>
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
          image={currentImage}
          name={product.name}
          selectedVariant={selectedVariant}
          setSelectedVariant={setSelectedVariant}
        />
      </div>
    </div>
  );
}
