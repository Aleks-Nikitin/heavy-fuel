"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Plus, Minus } from "lucide-react";
import { ProductVariantDisplay } from "@/lib/product-types";

export default function Price({
  variants,
  id,
}: {
  variants: ProductVariantDisplay[];
  id: string;
}) {
  const [quantity, setQuantity] = useState(1);
  const [selectedSizeIdx, setSelectedSizeIdx] = useState(0);
  const sizes = [...new Set(variants.map((variant) => variant.size))];
  const flavors = [...new Set(variants.map((variant) => variant.variant))];
  const [selectedVariant, setSelectedVariant] = useState(flavors[0]);
  const selectedSize = sizes[selectedSizeIdx];
  const selectedProductVariant = variants.find(
    (variant) =>
      variant.size === selectedSize && variant.variant === selectedVariant,
  ) ?? variants[0];
  const currentPrice = selectedProductVariant?.price ?? 0;
  const totalPrice = currentPrice * quantity;

  return (
    <div className="flex flex-col gap-8">
      <div className="text-4xl font-black text-[#CCFF00]">
        ${totalPrice.toFixed(2)}
      </div>

      <div className="space-y-3">
        <h3 className="text-white font-bold uppercase tracking-wider text-sm">
          Select Flavor
        </h3>
        <div className="flex flex-wrap gap-3">
          {flavors.map((variant) => (
            <Button
              key={variant}
              onClick={() => setSelectedVariant(variant)}
              className={cn(
                "px-5 py-3 rounded-xl border transition-all duration-200 text-sm font-bold uppercase tracking-wide",
                selectedVariant === variant
                  ? "border-[#CCFF00] bg-[#CCFF00]/10 text-[#CCFF00]"
                  : "border-white/10 bg-[#13161C] text-[#8E8E93] hover:border-white/30 hover:text-white",
              )}
            >
              {variant}
            </Button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <h3 className="text-white font-bold uppercase tracking-wider text-sm">
          Select Size
        </h3>
        <div className="flex flex-wrap gap-3">
          {sizes.map((size, index) => {
            return (
              <Button
                key={size}
                onClick={() => setSelectedSizeIdx(index)}
                className={cn(
                  "px-5 py-3 rounded-xl border transition-all duration-200 text-sm font-bold uppercase tracking-wide",
                  selectedSizeIdx === index
                    ? "border-[#CCFF00] bg-[#CCFF00]/10 text-[#CCFF00]"
                    : "border-white/10 bg-[#13161C] text-[#8E8E93] hover:border-white/30 hover:text-white",
                )}
              >
                {size}
              </Button>
            );
          })}
        </div>
      </div>

      <div className="flex flex-row items-center gap-4 pt-4">
        <div className="flex items-center justify-between border border-white/15 bg-[#13161C] rounded-2xl px-2 h-16 sm:w-36 shrink xl:shrink-0">
          <Button
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="w-12 h-12 flex items-center justify-center text-[#8E8E93] hover:text-[#CCFF00] transition-colors"
          >
            <Minus className="w-5 h-5" />
          </Button>
          <span className="text-white font-black text-xl">{quantity}</span>
          <Button
            onClick={() => setQuantity(quantity + 1)}
            className="w-12 h-12 flex items-center justify-center text-[#8E8E93] hover:text-[#CCFF00] transition-colors"
          >
            <Plus className="w-5 h-5" />
          </Button>
        </div>

        <Button
          className="py-4 px-6 md:py-1 xl:flex-1 h-16 rounded-2xl bg-[#CCFF00] text-black font-black uppercase tracking-wider text-lg hover:bg-[#b3e600] transition-all hover:scale-[1.02]"
          onClick={() => {
            console.log("Added to cart:", {
              id,
              variant: selectedVariant,
              size: selectedSize,
              quantity,
              totalPrice,
            });
          }}
        >
          <ShoppingCart className="w-6 h-6 mr-3" />
          Add to Cart
        </Button>
      </div>
    </div>
  );
}
