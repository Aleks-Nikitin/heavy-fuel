import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import heroBanner from "@/public/hero-banner.jpg";
import { cn } from "@/lib/utils";

export default function HeroBanner() {
  return (
    <section className="relative w-full min-h-[620px] md:min-h-[650px] lg:min-h-[680px] overflow-hidden border-y border-white/10 bg-[#0B0D10]">
      <div className="absolute inset-0 z-0">
        <Image
          src={heroBanner}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-[68%_center] md:object-[70%_center]"
        />
        <div className="absolute inset-0 hidden md:block bg-gradient-to-r from-[#0B0D10] from-0% via-[#0B0D10]/80 via-42% to-transparent to-72%" />
        <div className="absolute inset-0 md:hidden bg-gradient-to-r from-[#0B0D10]/95 via-[#0B0D10]/80 to-[#0B0D10]/25" />
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#0B0D10]/60 to-transparent" />
      </div>

      <div className="relative z-10 flex min-h-[620px] md:min-h-[650px] lg:min-h-[680px] items-center px-6 sm:px-10 md:px-14 lg:px-20 xl:px-24">
        <div className="w-full max-w-[680px]">
          <p className="mb-4 text-xs sm:text-sm font-black uppercase tracking-[0.25em] text-[#CCFF00]">
            Built for serious strength
          </p>

          <h1 className="text-[2.75rem] leading-[0.95] sm:text-5xl md:text-6xl lg:text-7xl font-black uppercase tracking-[-0.04em] text-white">
            Fuel the grind.
            <br />
            <span className="text-[#CCFF00]">Dominate the platform.</span>
          </h1>

          <p className="mt-6 max-w-xl text-base sm:text-lg md:text-xl leading-relaxed text-[#A1A1A6]">
            Clinical-grade performance supplements and elite heavy-duty lifting
            gear engineered for serious strength athletes.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
            <Link
              href="/shop/supplements"
              className={cn(
                buttonVariants({
                  variant: "default",
                  size: "lg",
                }),
                "h-13 sm:h-14 w-full sm:w-auto bg-[#CCFF00] px-7 sm:px-8 text-black font-black uppercase tracking-wide hover:bg-[#b3e600] transition-all rounded-xl hover:scale-[1.02]",
              )}
            >
              Shop Supplements
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>

            <Link
              href="/shop/gear"
              className={cn(
                buttonVariants({
                  variant: "outline",
                  size: "lg",
                }),
                "h-13 sm:h-14 w-full sm:w-auto border-white/20 bg-black/20 px-7 sm:px-8 text-white font-bold uppercase tracking-wide hover:bg-white/10 hover:text-white transition-all rounded-xl backdrop-blur-sm",
              )}
            >
              Explore Gear
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
