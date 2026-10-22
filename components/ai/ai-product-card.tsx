"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { ProductCard } from "@/lib/ai/product-card-types";

type Props = {
  product: ProductCard;
  onNavigate?: () => void;
};

export default function AIProductCard({ product, onNavigate }: Props) {
  const availableVariants = product.variants.filter(
    (variant) => variant.stock > 0,
  );

  const prices = availableVariants.map((variant) => Number(variant.price));
  const startingPrice = prices.length > 0 ? Math.min(...prices) : null;

  return (
    <Link
      href={product.url}
      onClick={onNavigate}
      className="group flex gap-3 rounded-xl border border-white/10 bg-[#13161C] p-3 transition-colors hover:border-[#CCFF00]/40"
    >
      <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-[#0B0D10]">
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="80px"
          className="object-contain p-1"
        />
      </div>

      <div className="flex min-w-0 flex-1 flex-col justify-center">
        <p className="text-[10px] font-bold uppercase tracking-wider text-[#8E8E93]">
          {product.category}
        </p>

        <h4 className="mt-1 line-clamp-2 text-xs font-bold uppercase text-white group-hover:text-[#CCFF00]">
          {product.name}
        </h4>

        <div className="mt-2 flex items-center justify-between gap-2">
          <span className="text-sm font-black text-[#CCFF00]">
            {startingPrice !== null
              ? `From $${startingPrice.toFixed(2)}`
              : "Out of stock"}
          </span>

          <ArrowUpRight
            size={16}
            className="shrink-0 text-white/50 transition-colors group-hover:text-[#CCFF00]"
          />
        </div>
      </div>
    </Link>
  );
}
