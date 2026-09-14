"use client";
import Link from "next/link";
import { ShoppingCartIcon } from "lucide-react";
import { useCartStore } from "@/lib/store";
export default function CartIcon({ mobile }: { mobile?: boolean }) {
  const { totalItems } = useCartStore();
  return (
    <Link href="/cart">
      <ShoppingCartIcon className="text-white transition-colors hover:text-[#CCFF00]" />
      <span
        className={
          mobile
            ? "absolute top-2 right-15 bg-[#CCFF00] text-black text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center"
            : "absolute top-2 right-2 bg-[#CCFF00] text-black text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center"
        }
      >
        {totalItems}
      </span>
    </Link>
  );
}
