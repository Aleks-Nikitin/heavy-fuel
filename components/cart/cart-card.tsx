"use client";

import Image from "next/image";
import { XIcon } from "lucide-react";
import { Product } from "@/lib/project-utils";

export default function CartCard({ item }: { item: Product }) {
  return (
    <div className="flex flex-col sm:flex-row items-center gap-6 p-4 rounded-3xl border border-white/10 bg-[#13161C] hover:border-white/20 transition-all">
      <div className="relative w-full sm:w-32 h-32 shrink-0 bg-[#0B0D10] rounded-2xl flex items-center justify-center overflow-hidden border border-white/5">
        <Image
          src={item.image}
          alt={item.name}
          fill
          className="object-contain p-2"
        />
      </div>

      <div className="flex flex-col flex-1 w-full text-center sm:text-left gap-1">
        <h3 className="text-xl font-black uppercase text-white tracking-wide">
          {item.name}
        </h3>
        <div className="flex items-center justify-center sm:justify-start gap-2 text-sm text-[#8E8E93] uppercase font-bold tracking-wider">
          <span>{item.options.variant[0]}</span>
          <span className="w-1 h-1 rounded-full bg-white/20" />
          <span>{item.options.size[0]}</span>
        </div>
      </div>

      <div className="flex items-center md:gap-8 justify-between w-full sm:w-auto gap-8 sm:gap-2">
        <span className="text-2xl font-black text-[#CCFF00]">
          ${item.price.toFixed(2)}
        </span>
        <button className="flex items-center gap-2 text-xs uppercase font-bold tracking-widest text-[#8E8E93] hover:text-red-500 transition-colors">
          <XIcon className="" size={24} />
          <span className="sm:hidden">Remove</span>
        </button>
      </div>
    </div>
  );
}
