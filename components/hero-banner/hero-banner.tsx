import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import heavyFuelBanner from "@/public/heavy-fuel-banner.jpg";
import { cn } from "@/lib/utils";
export default function HeroBanner() {
  return (
    <div className="relative w-full  overflow-hidden border border-white/10 bg-[#0B0D10] p-8 md:p-16">
      <div className="absolute inset-0 z-0 opacity-40">
        <Image
          src={heavyFuelBanner}
          alt="HeavyFuel Supplements and Gear"
          className="w-full h-full object-cover"
          fill
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0B0D10] via-[#0B0D10]/80 to-transparent" />
      </div>

      <div className="relative z-10 max-w-2xl space-y-6">
        <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tight text-white">
          Fuel the grind. <br />
          <span className="text-[#CCFF00]">Dominate the platform.</span>
        </h1>

        <p className="text-lg text-[#8E8E93] max-w-lg">
          Clinical-grade performance supplements and elite heavy-duty lifting
          gear engineered for serious strength athletes.
        </p>

        <div className="flex flex-wrap items-center gap-4 pt-2">
          <Link
            href="/shop/supplements"
            className={cn(
              buttonVariants({ variant: "default", size: "lg" }),
              "bg-[#CCFF00] text-black font-bold hover:bg-[#b3e600] transition-colors rounded-xl px-8",
            )}
          >
            <span>Shop Supplements</span>
            <ArrowRight className="w-4 h-4 ml-2" />
          </Link>

          <Link
            href="/shop/gear"
            className={cn(
              buttonVariants({ variant: "outline", size: "lg" }),
              "bg-white/5 border-white/15 text-white hover:bg-white/10 transition-colors rounded-xl px-8 backdrop-blur-md",
            )}
          >
            <span>Explore Gear</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
