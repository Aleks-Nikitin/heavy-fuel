"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Plus, Minus } from "lucide-react";

export default function Price({
  price,
  id,
  options,
}: {
  price: number;
  id: number;
  options: { size: string[]; additionalSizePrice: number[]; variant: string[] };
}) {
  const [quantity, setQuantity] = useState(1);
  const [selectedSizeIdx, setSelectedSizeIdx] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState(options.variant[0]);
  const currentPrice = price + options.additionalSizePrice[selectedSizeIdx];
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
          {options.variant.map((variant) => (
            <button
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
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <h3 className="text-white font-bold uppercase tracking-wider text-sm">
          Select Size
        </h3>
        <div className="flex flex-wrap gap-3">
          {options.size.map((size, index) => {
            const upcharge = options.additionalSizePrice[index];
            return (
              <button
                key={size}
                onClick={() => setSelectedSizeIdx(index)}
                className={cn(
                  "px-5 py-3 rounded-xl border transition-all duration-200 text-sm font-bold uppercase tracking-wide",
                  selectedSizeIdx === index
                    ? "border-[#CCFF00] bg-[#CCFF00]/10 text-[#CCFF00]"
                    : "border-white/10 bg-[#13161C] text-[#8E8E93] hover:border-white/30 hover:text-white",
                )}
              >
                {size}{" "}
                {upcharge > 0 && (
                  <span className="opacity-70 ml-1">(+${upcharge})</span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-4 pt-4">
        <div className="flex items-center justify-between border border-white/15 bg-[#13161C] rounded-2xl px-2 h-16 w-full sm:w-36 shrink-0">
          <button
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="w-12 h-12 flex items-center justify-center text-[#8E8E93] hover:text-[#CCFF00] transition-colors"
          >
            <Minus className="w-5 h-5" />
          </button>
          <span className="text-white font-black text-xl">{quantity}</span>
          <button
            onClick={() => setQuantity(quantity + 1)}
            className="w-12 h-12 flex items-center justify-center text-[#8E8E93] hover:text-[#CCFF00] transition-colors"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>

        <Button
          className="flex-1 w-full h-16 rounded-2xl bg-[#CCFF00] text-black font-black uppercase tracking-wider text-lg hover:bg-[#b3e600] transition-all hover:scale-[1.02]"
          onClick={() => {
            console.log("Added to cart:", {
              id,
              variant: selectedVariant,
              size: options.size[selectedSizeIdx],
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
