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

type ProductDetailsProps = {
  id: string;
  name: string;
  defaultImage: string;
  variants: ProductVariantDisplay[];
  variantImages: VariantImage[];
};

export default function ProductDetails({
  id,
  name,
  defaultImage,
  variants,
  variantImages,
}: ProductDetailsProps) {
  const flavors = [...new Set(variants.map((variant) => variant.variant))];

  const [selectedVariant, setSelectedVariant] = useState(flavors[0] ?? "");

  const selectedVariantImage =
    variantImages.find((item) => item.variant === selectedVariant)?.image ??
    defaultImage;

  return (
    <>
      <div className="relative w-full aspect-square rounded-3xl border border-white/10 bg-[#13161C] overflow-hidden flex items-center justify-center">
        <div className="absolute inset-0 bg-gradient-to-t from-[#CCFF00]/5 to-transparent opacity-50 z-0" />

        <Image
          src={selectedVariantImage}
          alt={`${name} ${selectedVariant}`}
          fill
          className="object-contain p-12 z-10"
          priority
        />
      </div>

      <Price
        variants={variants}
        id={id}
        name={name}
        image={selectedVariantImage}
        selectedVariant={selectedVariant}
        setSelectedVariant={setSelectedVariant}
      />
    </>
  );
}
