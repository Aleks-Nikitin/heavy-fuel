"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Plus, Minus } from "lucide-react";
import { ProductVariantDisplay } from "@/lib/product-types";
import { useCartStore } from "@/lib/store";
import { toast } from "react-toastify";

export default function Price({
  variants,
  id,
  name,
  image,
}: {
  variants: ProductVariantDisplay[];
  id: string;
  name: string;
  image: string;
}) {
  const { addToCart, products } = useCartStore();
  const [quantity, setQuantity] = useState(1);
  const sizes = [...new Set(variants.map((variant) => variant.size))];
  const flavors = [...new Set(variants.map((variant) => variant.variant))];
  const [selectedVariant, setSelectedVariant] = useState(flavors[0]);
  const [selectedSize, setSelectedSize] = useState(sizes[0]);
  const selectedProductVariant = variants.find(
    (variant) =>
      variant.size === selectedSize && variant.variant === selectedVariant,
  );

  const currentPrice = selectedProductVariant?.price ?? variants[0]?.price ?? 0;
  const totalPrice = currentPrice * quantity;
  const currentStock = selectedProductVariant?.stock ?? 0;

  const existingCartItem = products?.find(
    (item) =>
      item.productVariantId ===
      (selectedProductVariant?.id ||
        `${id}-${selectedVariant}-${selectedSize}`),
  );
  const existingCartQty = existingCartItem?.quantity ?? 0;
  const remainingStock = Math.max(0, currentStock - existingCartQty);

  const isOutOfStock = currentStock === 0;
  const isMaxStockInCart = !isOutOfStock && remainingStock === 0;
  const isLowStock = currentStock > 0 && currentStock <= 5;
  const handleAddToCart = () => {
    if (quantity > remainingStock) {
      if (isMaxStockInCart) {
        toast.error(
          `Cannot add more. You already have all ${currentStock} available units in your cart!`,
        );
      } else {
        toast.error(
          `Only ${remainingStock} unit(s) remaining for this variant.`,
        );
      }
      return;
    }
    addToCart({
      id,
      variant: selectedVariant,
      size: selectedSize,
      quantity,
      productVariantId:
        selectedProductVariant?.id ||
        `${id}-${selectedVariant}-${selectedSize}`,
      price: currentPrice,
      priceAtPurchase: currentPrice,
      name,
      image,
    });
    toast.success("Item added to cart!");
  };
  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-end justify-between">
        <div className="text-4xl font-black text-[#CCFF00]">
          ${totalPrice.toFixed(2)}
        </div>

        <div className="flex items-center gap-2 mb-1">
          <span
            className={cn(
              "w-3 h-3 rounded-full shadow-[0_0_10px_currentColor]",
              isOutOfStock
                ? "bg-red-500 text-red-500"
                : isLowStock
                  ? "bg-yellow-500 text-yellow-500 animate-pulse"
                  : "bg-green-500 text-green-500",
            )}
          />
          <span className="text-sm font-bold uppercase tracking-wider text-white">
            {isOutOfStock
              ? "Out of Stock"
              : isLowStock
                ? "Low Stock"
                : "In Stock"}
          </span>
        </div>
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
          {sizes.map((size) => (
            <Button
              key={size}
              onClick={() => setSelectedSize(size)}
              className={cn(
                "px-5 py-3 rounded-xl border transition-all duration-200 text-sm font-bold uppercase tracking-wide",
                selectedSize === size
                  ? "border-[#CCFF00] bg-[#CCFF00]/10 text-[#CCFF00]"
                  : "border-white/10 bg-[#13161C] text-[#8E8E93] hover:border-white/30 hover:text-white",
              )}
            >
              {size}
            </Button>
          ))}
        </div>
      </div>

      <div className="flex flex-row items-center gap-4 pt-4">
        <div className="flex items-center justify-between border border-white/15 bg-[#13161C] rounded-2xl px-2 h-16 sm:w-36 shrink xl:shrink-0">
          <Button
            type="button"
            disabled={quantity <= 1 || remainingStock === 0}
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="w-12 h-12 flex items-center justify-center text-[#8E8E93] hover:text-[#CCFF00] transition-colors disabled:opacity-30 disabled:hover:text-[#8E8E93]"
          >
            <Minus className="w-5 h-5" />
          </Button>

          <span className="text-white font-black text-xl">{quantity}</span>

          <Button
            type="button"
            disabled={quantity >= remainingStock}
            onClick={() => {
              if (quantity < remainingStock) {
                setQuantity(quantity + 1);
              } else {
                toast.warning(
                  `Maximum stock limit reached (${remainingStock}).`,
                );
              }
            }}
            className="w-12 h-12 flex items-center justify-center text-[#8E8E93] hover:text-[#CCFF00] transition-colors disabled:opacity-30 disabled:hover:text-[#8E8E93]"
          >
            <Plus className="w-5 h-5" />
          </Button>
        </div>

        <Button
          disabled={isOutOfStock || isMaxStockInCart}
          className="py-4 px-6 md:py-1 xl:flex-1 h-16 rounded-2xl bg-[#CCFF00] text-black font-black uppercase tracking-wider text-lg hover:bg-[#b3e600] transition-all hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:bg-gray-800 disabled:text-white/40"
          onClick={handleAddToCart}
        >
          <ShoppingCart className="w-6 h-6 mr-3" />
          {isOutOfStock
            ? "Sold Out"
            : isMaxStockInCart
              ? "Max Stock in Cart"
              : "Add to Cart"}
        </Button>
      </div>
    </div>
  );
}
