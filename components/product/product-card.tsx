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
  const { addToCart } = useCartStore();
  const [quantity, setQuantity] = useState(1);

  const sizes = [...new Set(product.variants.map((variant) => variant.size))];
  const flavors = [
    ...new Set(product.variants.map((variant) => variant.variant)),
  ];

  const [selectedVariant, setSelectedVariant] = useState(flavors[0]);
  const [selectedSize, setSelectedSize] = useState(sizes[0]);

  const selectedProductVariant = product.variants.find(
    (variant) =>
      variant.size === selectedSize && variant.variant === selectedVariant,
  );

  const currentPrice =
    selectedProductVariant?.price ?? product.variants[0]?.price ?? 0;
  const totalPrice = currentPrice * quantity;

  const averageRating = product.reviews.length
    ? (
        product.reviews.reduce((sum, review) => sum + review.rating, 0) /
        product.reviews.length
      ).toFixed(1)
    : "0.0";

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    addToCart({
      id: product.id,
      variant: selectedVariant,
      size: selectedSize,
      quantity,
      productVariantId:
        selectedProductVariant?.id ||
        `${product.id}-${selectedVariant}-${selectedSize}`,
      price: currentPrice,
      priceAtPurchase: currentPrice,
      name: product.name,
      image: product.image,
    });
    toast.success("Item added to cart!");
  };

  return (
    <Link
      href={`/products/${product.id}`}
      className="group flex flex-col w-full h-full min-h-[460px] justify-between p-6 rounded-3xl border border-white/10 bg-[#13161C] hover:border-[#CCFF00]/50 hover:bg-[#181c24] transition-all duration-300 cursor-pointer"
    >
      <div className="relative w-full h-[220px] flex items-center justify-center overflow-hidden shrink-0">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-contain p-2 group-hover:scale-105 transition-transform duration-500"
        />
      </div>
      <div className="flex flex-col gap-1 pt-4 text-center">
        <span className="text-white font-bold tracking-wider text-lg uppercase line-clamp-1">
          {product.name}
        </span>
        <span className="text-[#8E8E93] text-sm uppercase tracking-widest">
          {product.category.title}
        </span>

        <div className="flex items-center justify-center gap-1.5 mt-1">
          <div className="flex items-center text-[#CCFF00]">
            <Star className="w-4 h-4 fill-current" />
            <span className="ml-1 font-bold text-sm">{averageRating}</span>
          </div>
          <span className="text-[#8E8E93] text-xs font-semibold uppercase tracking-wider">
            ({product.reviews.length} reviews)
          </span>
        </div>
      </div>

      <div className="flex flex-col items-center justify-between w-full pt-6 mt-auto border-t border-white/5 gap-4">
        <div
          className="flex items-center gap-2 w-full"
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
            <SelectTrigger className="w-full flex-1 bg-[#0B0D10] border-white/10 text-white focus:ring-[#CCFF00] h-11 rounded-xl">
              <SelectValue placeholder="Select size" />
            </SelectTrigger>
            <SelectContent className="bg-[#0B0D10] border-white/10 text-white">
              <SelectGroup>
                <SelectLabel className="text-[#8E8E93]">Sizes:</SelectLabel>
                {sizes.map((size) => (
                  <SelectItem
                    key={size}
                    value={size}
                    className="focus:bg-white/10 focus:text-white cursor-pointer"
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
            <SelectTrigger className="w-full flex-1 bg-[#0B0D10] border-white/10 text-white focus:ring-[#CCFF00] h-11 rounded-xl">
              <SelectValue placeholder="Select flavor" />
            </SelectTrigger>
            <SelectContent className="bg-[#0B0D10] border-white/10 text-white">
              <SelectGroup>
                <SelectLabel className="text-[#8E8E93]">Variant:</SelectLabel>
                {flavors.map((variant) => (
                  <SelectItem
                    key={variant}
                    value={variant}
                    className="focus:bg-white/10 focus:text-white cursor-pointer"
                  >
                    {variant}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center justify-between w-full gap-4">
          <span className="text-[#CCFF00] font-black text-2xl shrink-0">
            ${totalPrice.toFixed(2)}
          </span>

          <Button
            onClick={handleAddToCart}
            className="flex-1 h-12 rounded-xl bg-[#CCFF00] text-black font-black uppercase tracking-wider text-sm hover:bg-[#b3e600] transition-all hover:scale-[1.02]"
          >
            <ShoppingCart className="w-5 h-5 mr-2" />
            Add
          </Button>
        </div>
      </div>
    </Link>
  );
}
