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

function RatingStars({ rating }: { rating: number }) {
  return (
    <div
      className="flex items-center gap-0.5"
      aria-label={`${rating.toFixed(1)} out of 5 stars`}
    >
      {[1, 2, 3, 4, 5].map((star) => {
        const fillAmount = Math.max(0, Math.min(1, rating - (star - 1)));
        return (
          <div
            key={star}
            className="relative h-3.5 w-3.5 sm:h-4 sm:w-4 shrink-0"
          >
            <Star className="absolute inset-0 h-full w-full text-white/20" />
            {fillAmount > 0 && (
              <div
                className="absolute inset-0 overflow-hidden"
                style={{
                  width:
                    fillAmount >= 0.75
                      ? "100%"
                      : fillAmount >= 0.25
                        ? "50%"
                        : "0%",
                }}
              >
                <Star className="absolute left-0 top-0 h-3.5 w-3.5 sm:h-4 sm:w-4 fill-[#CCFF00] text-[#CCFF00]" />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
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
    ? product.reviews.reduce(
        (sum, review) => sum + review.rating,

        0,
      ) / product.reviews.length
    : 0;

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
    <article className="group flex h-full min-w-0 flex-col">
      <Link
        href={`/products/${product.id}`}
        className="relative block aspect-[4/5] sm:aspect-square w-full overflow-hidden rounded-xl sm:rounded-2xl border border-white/[0.08] bg-[#13161C]"
      >
        <Image
          src={currentImage}
          alt={`${product.name} ${selectedVariant}`}
          fill
          sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="object-contain p-2 sm:p-4 transition-transform duration-500 group-hover:scale-[1.04]"
        />

        {isOutOfStock && (
          <div className="absolute left-2 top-2 rounded-md bg-[#0B0D10]/90 px-2 py-1 text-[9px] sm:text-[10px] font-black uppercase tracking-wider text-white backdrop-blur-sm">
            Sold Out
          </div>
        )}
      </Link>
      <div className="flex flex-1 flex-col pt-3 sm:pt-4">
        <Link href={`/products/${product.id}`} className="min-w-0">
          <p className="mb-1 truncate text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.16em] text-[#8E8E93]">
            {product.category.title}
          </p>

          <h3 className="truncate text-xs sm:text-sm md:text-base font-bold uppercase tracking-wide text-white transition-colors group-hover:text-[#CCFF00]">
            {product.name}
          </h3>
        </Link>
        <div className="mt-2 flex min-w-0 items-center gap-1.5">
          <RatingStars rating={averageRating} />
          <span className="hidden sm:inline text-xs font-semibold text-white/60">
            {averageRating.toFixed(1)}
          </span>

          <span className="truncate text-[9px] sm:text-xs text-[#8E8E93]">
            ({product.reviews.length})
          </span>
        </div>
        <div
          className="mt-3 grid w-full min-w-0 grid-cols-2 gap-1.5 sm:gap-2"
          onClick={(e) => {
            e.preventDefault();

            e.stopPropagation();
          }}
        >
          <Select
            value={selectedSize}
            onValueChange={(value) => {
              if (value !== null) {
                setSelectedSize(value);
              }
            }}
          >
            <SelectTrigger
              aria-label="Select size"
              className="h-8 min-w-0 w-full rounded-lg border-white/10 bg-[#13161C] px-2 text-[10px] sm:h-9 sm:px-3 sm:text-xs text-white focus:ring-[#CCFF00]"
            >
              <div className="min-w-0 flex-1 overflow-hidden text-left">
                <SelectValue placeholder="Size" />
              </div>
            </SelectTrigger>

            <SelectContent className="bg-[#0B0D10] border-white/10 text-white">
              <SelectGroup>
                <SelectLabel className="text-[#8E8E93] text-xs">
                  Size
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
            onValueChange={(value) => {
              if (value !== null) {
                setSelectedVariant(value);
              }
            }}
          >
            <SelectTrigger
              aria-label="Select flavor"
              className="h-8 min-w-0 w-full rounded-lg border-white/10 bg-[#13161C] px-2 text-[10px] sm:h-9 sm:px-3 sm:text-xs text-white focus:ring-[#CCFF00]"
            >
              <div className="min-w-0 flex-1 overflow-hidden text-left">
                <SelectValue placeholder="Flavor" />
              </div>
            </SelectTrigger>
            <SelectContent className="bg-[#0B0D10] border-white/10 text-white">
              <SelectGroup>
                <SelectLabel className="text-[#8E8E93] text-xs">
                  Flavor
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
        <div className="mt-4">
          <span className="text-lg sm:text-xl font-black tracking-tight text-white">
            ${currentPrice.toFixed(2)}
          </span>
        </div>
        <Button
          disabled={isOutOfStock || isMaxStockInCart}
          onClick={handleAddToCart}
          className="mt-3 h-9 sm:h-11 w-full rounded-lg sm:rounded-xl bg-[#CCFF00] px-2 sm:px-4 text-[10px] sm:text-xs font-black uppercase tracking-wide text-black transition-all hover:bg-[#b3e600] active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-white/10 disabled:text-white/30 disabled:opacity-100"
        >
          <ShoppingCart className="mr-1.5 h-3.5 w-3.5 sm:mr-2 sm:h-4 sm:w-4 shrink-0" />

          <span className="truncate">
            {isOutOfStock
              ? "Sold Out"
              : isMaxStockInCart
                ? "Max in Cart"
                : "Add to Cart"}
          </span>
        </Button>
      </div>
    </article>
  );
}
