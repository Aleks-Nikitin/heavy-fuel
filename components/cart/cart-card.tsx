"use client";

import Image from "next/image";
import { XIcon, Minus, Plus, Image as ImageIcon } from "lucide-react";
import { useCartStore } from "@/lib/store";
import { toast } from "react-toastify";

export default function CartCard({ item }: { item: any }) {
  const { removeFromCart, updateQuantity } = useCartStore();

  return (
    <div className="flex flex-col sm:flex-row items-center gap-6 p-5 rounded-3xl border border-white/10 bg-[#13161C] hover:border-white/20 transition-all">
      <div className="relative w-full sm:w-32 h-32 shrink-0 bg-[#0B0D10] rounded-2xl flex items-center justify-center overflow-hidden border border-white/5">
        {item.image ? (
          <Image
            src={item.image}
            alt={item.name || "Product image"}
            fill
            className="object-contain p-2"
          />
        ) : (
          <div className="flex flex-col items-center gap-2 text-white/20">
            <ImageIcon size={24} />
            <span className="font-bold uppercase tracking-widest text-[10px]">
              No Image
            </span>
          </div>
        )}
      </div>

      <div className="flex flex-col flex-1 w-full text-center sm:text-left gap-2">
        <h3 className="text-xl font-black uppercase text-white tracking-wide">
          {item.name || "Unknown Product"}
        </h3>

        <div className="flex items-center justify-center sm:justify-start gap-2 text-xs text-[#8E8E93] uppercase font-bold tracking-wider">
          <span>{item.variant}</span>
          <span className="w-1 h-1 rounded-full bg-white/20" />
          <span>{item.size}</span>
        </div>

        <div className="flex items-center justify-center sm:justify-start mt-2">
          <div className="flex items-center justify-between border border-white/15 bg-[#0B0D10] rounded-xl px-1 h-10 w-28">
            <button
              onClick={() =>
                updateQuantity(
                  item.productVariantId,
                  Math.max(1, item.quantity - 1),
                )
              }
              className="w-8 h-8 flex items-center justify-center text-[#8E8E93] hover:text-[#CCFF00] transition-colors"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="text-white font-black">{item.quantity}</span>
            <button
              disabled={item.quantity >= item.stock}
              onClick={() => {
                if (item.quantity < item.stock) {
                  updateQuantity(item.productVariantId, item.quantity + 1);
                } else {
                  toast.warning(`Maximum stock limit reached (${item.stock}).`);
                }
              }}
              className="w-8 h-8 flex items-center justify-center text-[#8E8E93] hover:text-[#CCFF00] transition-colors disabled:opacity-30 disabled:hover:text-[#8E8E93]"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-4 pt-4 sm:pt-0 border-t sm:border-t-0 border-white/10">
        <span className="text-2xl font-black text-[#CCFF00]">
          ${(item.price * (item.quantity || 1)).toFixed(2)}
        </span>
        <button
          className="flex items-center gap-2 text-xs uppercase font-bold tracking-widest text-[#8E8E93] hover:text-red-500 transition-colors"
          onClick={() => removeFromCart(item.productVariantId)}
        >
          <XIcon size={16} />
          <span>Remove</span>
        </button>
      </div>
    </div>
  );
}
