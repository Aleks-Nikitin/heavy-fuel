import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export default function CategoryCard({
  name,
  image,
  link,
}: {
  name: string;
  image: string;
  link: string;
}) {
  return (
    <Link
      href={link}
      className="group w-[78vw] max-w-[300px] sm:w-[300px] md:w-full md:max-w-none shrink-0 md:shrink snap-center"
    >
      <div className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl bg-[#13161C] border border-white/[0.08]">
        <Image
          src={image}
          alt={`Shop HeavyFuel ${name}`}
          fill
          sizes="(max-width: 768px) 78vw, 33vw"
          className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
        />
        <div className="absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-black/20 to-transparent" />
      </div>
      <div className="flex items-center justify-between gap-3 pt-3">
        <h3 className="text-base sm:text-lg font-black uppercase tracking-wide text-white transition-colors group-hover:text-[#CCFF00]">
          {name}
        </h3>
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-white/10 text-[#8E8E93] transition-all duration-300 group-hover:border-[#CCFF00]/40 group-hover:bg-[#CCFF00] group-hover:text-black">
          <ArrowUpRight className="h-4 w-4" />
        </div>
      </div>
    </Link>
  );
}
