"use client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ShoppingCart, Star } from "lucide-react";
import { toast } from "react-toastify";
import { useCartStore } from "@/lib/store";
import { ProductDisplay } from "@/lib/product-types";
import { Button } from "../ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function ProductCard({ product }: { product: ProductDisplay }) {
  const { addToCart, products } = useCartStore();
  const sizes = [...new Set(product.variants.map((variant) => variant.size))];
  const flavors = [
    ...new Set(product.variants.map((variant) => variant.variant)),
  ];
  const [selectedVariant, setSelectedVariant] = useState(flavors[0]);
  const [selectedSize, setSelectedSize] = useState(sizes[0]);
  const currentImage =
    product.variantImages.find((image) => image.variant === selectedVariant)
      ?.image ?? product.image;
  const selectedProductVariant = product.variants.find(
    (variant) =>
      variant.size === selectedSize && variant.variant === selectedVariant,
  );

  const currentPrice =
    selectedProductVariant?.price ?? product.variants[0]?.price ?? 0;
  const currentStock = selectedProductVariant?.stock ?? 0;

  const existingCartItem = products.find(
    (item) =>
      item.productVariantId ===
      (selectedProductVariant?.id ||
        `${product.id}-${selectedVariant}-${selectedSize}`),
  );

  const existingCartQty = existingCartItem?.quantity ?? 0;
  const remainingStock = Math.max(0, currentStock - existingCartQty);

  const isOutOfStock = currentStock === 0;
  const isMaxStockInCart = !isOutOfStock && remainingStock === 0;

  const averageRating = product.reviews.length
    ? (
        product.reviews.reduce((sum, review) => sum + review.rating, 0) /
        product.reviews.length
      ).toFixed(1)
    : "0.0";

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (1 > remainingStock) {
      if (isMaxStockInCart) {
        toast.error(
          `Cannot add more. You already have all ${currentStock} available units in your cart!`,
        );
      } else {
        toast.error(`Sold out! No units remaining for this variant.`);
      }
      return;
    }

    addToCart({
      id: product.id,
      variant: selectedVariant,
      size: selectedSize,
      quantity: 1,
      productVariantId:
        selectedProductVariant?.id ||
        `${product.id}-${selectedVariant}-${selectedSize}`,
      price: currentPrice,
      priceAtPurchase: currentPrice,
      name: product.name,
      image: currentImage,
      stock: currentStock,
    });

    toast.success("Item added to cart!");
  };

  return (
    <Link
      href={`/products/${product.id}`}
      className="group flex flex-col w-full h-full justify-between p-3 sm:p-5 rounded-2xl sm:rounded-3xl border border-white/10 bg-[#13161C] hover:border-[#CCFF00]/50 hover:bg-[#181c24] transition-all duration-300 cursor-pointer"
    >
      <div className="relative w-full h-[140px] sm:h-[200px] flex items-center justify-center overflow-hidden shrink-0">
        <Image
          src={currentImage}
          alt={`${product.name} ${selectedVariant}`}
          fill
          className="object-contain p-1 group-hover:scale-105 transition-transform duration-500"
        />
      </div>
      <div className="flex flex-col gap-1 pt-3 text-center">
        <span className="text-white font-bold tracking-wider text-sm sm:text-base uppercase line-clamp-1">
          {product.name}
        </span>
        <span className="text-[#8E8E93] text-[10px] sm:text-xs uppercase tracking-widest">
          {product.category.title}
        </span>

        <div className="flex items-center justify-center gap-1.5 mt-0.5">
          <div className="flex items-center text-[#CCFF00]">
            <Star className="w-3 h-3 sm:w-4 sm:h-4 fill-current" />
            <span className="ml-1 font-bold text-xs sm:text-sm">
              {averageRating}
            </span>
          </div>
          <span className="text-[#8E8E93] text-[9px] sm:text-xs font-semibold uppercase tracking-wider">
            ({product.reviews.length})
          </span>
        </div>
      </div>

      <div className="flex flex-col items-center justify-between w-full pt-4 mt-auto">
        <div
          className="flex flex-col sm:flex-row items-center gap-2 w-full max-w-[85%] mx-auto"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
        >
          <Select
            value={selectedSize}
            onValueChange={(val) => {
              if (val !== null) setSelectedSize(val);
            }}
          >
            <SelectTrigger className="w-full flex-1 bg-[#0B0D10] border-white/10 text-white focus:ring-[#CCFF00] h-8 sm:h-9 rounded-lg text-xs">
              <SelectValue placeholder="Size" />
            </SelectTrigger>
            <SelectContent className="bg-[#0B0D10] border-white/10 text-white">
              <SelectGroup>
                <SelectLabel className="text-[#8E8E93] text-xs">
                  Sizes:
                </SelectLabel>
                {sizes.map((size) => (
                  <SelectItem
                    key={size}
                    value={size}
                    className="text-xs cursor-pointer"
                  >
                    {size}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>

          <Select
            value={selectedVariant}
            onValueChange={(val) => {
              if (val !== null) setSelectedVariant(val);
            }}
          >
            <SelectTrigger className="w-full flex-1 bg-[#0B0D10] border-white/10 text-white focus:ring-[#CCFF00] h-8 sm:h-9 rounded-lg text-xs">
              <SelectValue placeholder="Flavor" />
            </SelectTrigger>
            <SelectContent className="bg-[#0B0D10] border-white/10 text-white">
              <SelectGroup>
                <SelectLabel className="text-[#8E8E93] text-xs">
                  Variant:
                </SelectLabel>
                {flavors.map((variant) => (
                  <SelectItem
                    key={variant}
                    value={variant}
                    className="text-xs cursor-pointer"
                  >
                    {variant}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center justify-between w-full gap-2 mt-4 pt-4 border-t border-white/5">
          <span className="text-[#CCFF00] font-black text-lg sm:text-xl shrink-0">
            ${currentPrice.toFixed(2)}
          </span>

          <Button
            disabled={isOutOfStock || isMaxStockInCart}
            onClick={handleAddToCart}
            className="h-9 sm:h-10 px-3 sm:px-4 rounded-xl bg-[#CCFF00] text-black font-black uppercase tracking-wider text-[10px] sm:text-xs hover:bg-[#b3e600] transition-all hover:scale-[1.02] disabled:opacity-50 shrink-0"
          >
            <ShoppingCart className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
            <span className="hidden sm:inline">
              {isOutOfStock
                ? "Sold Out"
                : isMaxStockInCart
                  ? "Max Added"
                  : "Add to Cart"}
            </span>
            <span className="sm:hidden">
              {isOutOfStock ? "Out" : isMaxStockInCart ? "Max" : "Add"}
            </span>
          </Button>
        </div>
      </div>
    </Link>
  );
}
