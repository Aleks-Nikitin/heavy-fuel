import Image from "next/image";
import Link from "next/link";
import { Product } from "@/lib/project-utils";

export default function ProductCard({ product }: { product: Product }) {
  return (
    <Link
      href={product.link}
      className="group flex flex-col w-full h-[400px] justify-between p-6 rounded-3xl border border-white/10 bg-[#13161C] hover:border-[#CCFF00]/50 hover:bg-[#181c24] transition-all duration-300 cursor-pointer"
    >
      <div className="relative w-full h-[220px] flex items-center justify-center overflow-hidden">
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
          {product.options.variant[0]}
        </span>
      </div>

      <div className="flex items-center justify-between w-full pt-4 mt-auto border-t border-white/5">
        <span className="text-[#CCFF00] font-black text-xl">
          ${product.price.toFixed(2)}
        </span>
        <span className="text-xs text-white font-semibold uppercase tracking-wider group-hover:text-[#CCFF00] transition-colors">
          View Details →
        </span>
      </div>
    </Link>
  );
}
