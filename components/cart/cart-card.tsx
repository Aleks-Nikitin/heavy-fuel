"use client";

import Image from "next/image";
import { XIcon, Minus, Plus, Image as ImageIcon } from "lucide-react";
import { useCartStore } from "@/lib/store";
import { toast } from "react-toastify";
import type { CartItemType } from "@/lib/types";
export default function CartCard({ item }: { item: CartItemType }) {
  const { removeFromCart, updateQuantity } = useCartStore();
  const maxStock = item.stock ?? 99;

  return (
    <div className="flex items-center gap-3 sm:gap-5 p-3 sm:p-4 rounded-2xl border border-white/10 bg-[#13161C] hover:border-white/20 transition-all">
      <div className="relative w-24 h-24 sm:w-28 sm:h-28 shrink-0 bg-[#0B0D10] rounded-xl border border-white/5 overflow-hidden flex items-center justify-center p-2">
        {item.image ? (
          <Image
            src={item.image}
            alt={item.name || "Product image"}
            fill
            className="object-contain p-1.5"
          />
        ) : (
          <div className="flex flex-col items-center gap-1 text-white/20">
            <ImageIcon size={20} />
            <span className="font-bold uppercase tracking-widest text-[9px]">
              No Image
            </span>
          </div>
        )}
      </div>

      <div className="flex flex-col sm:flex-row flex-1 min-w-0 justify-between sm:items-center gap-2.5 sm:gap-4">
        <div className="flex flex-col gap-1 min-w-0">
          <div className="flex items-start justify-between gap-2 sm:block">
            <h3 className="text-sm sm:text-base font-black uppercase text-white tracking-wide truncate">
              {item.name || "Unknown Product"}
            </h3>
            <button
              type="button"
              onClick={() => removeFromCart(item.productVariantId)}
              className="sm:hidden text-[#8E8E93] hover:text-red-400 p-1 -mr-1 transition-colors"
              aria-label="Remove item"
            >
              <XIcon className="w-4 h-4" />
            </button>
          </div>

          {(item.variant || item.size) && (
            <div className="flex items-center gap-1.5 text-xs text-[#8E8E93] font-bold uppercase tracking-wider truncate">
              {item.variant && <span>{item.variant}</span>}
              {item.variant && item.size && (
                <span className="w-1 h-1 rounded-full bg-white/20 shrink-0" />
              )}
              {item.size && <span>{item.size}</span>}
            </div>
          )}
        </div>

        <div className="flex items-center justify-between sm:justify-end gap-3 sm:gap-6 shrink-0 pt-2 sm:pt-0 border-t border-white/5 sm:border-t-0">
          <div className="flex items-center justify-between border border-white/15 bg-[#0B0D10] rounded-xl px-1 h-8 sm:h-9 w-24 sm:w-28">
            <button
              type="button"
              onClick={() =>
                updateQuantity(
                  item.productVariantId,
                  Math.max(1, item.quantity - 1),
                )
              }
              className="w-6 h-6 sm:w-7 sm:h-7 flex items-center justify-center text-[#8E8E93] hover:text-[#CCFF00] transition-colors"
              aria-label="Decrease quantity"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>

            <span className="text-xs sm:text-sm text-white font-black">
              {item.quantity}
            </span>

            <button
              type="button"
              disabled={item.quantity >= maxStock}
              onClick={() => {
                if (item.quantity < maxStock) {
                  updateQuantity(item.productVariantId, item.quantity + 1);
                } else {
                  toast.warning(
                    item.stock !== undefined
                      ? `Maximum stock limit reached (${maxStock}).`
                      : "Maximum allowed limit reached.",
                  );
                }
              }}
              className="w-6 h-6 sm:w-7 sm:h-7 flex items-center justify-center text-[#8E8E93] hover:text-[#CCFF00] transition-colors disabled:opacity-30 disabled:hover:text-[#8E8E93]"
              aria-label="Increase quantity"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

          <span className="text-base sm:text-lg font-black text-[#CCFF00]">
            ${(item.price * (item.quantity || 1)).toFixed(2)}
          </span>

          <button
            type="button"
            onClick={() => removeFromCart(item.productVariantId)}
            className="hidden sm:flex items-center justify-center text-[#8E8E93] hover:text-red-400 p-2 rounded-xl hover:bg-red-500/10 transition-colors"
            title="Remove item"
            aria-label="Remove item"
          >
            <XIcon className="w-4.5 h-4.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
