import Image from "next/image";
import proteinTub from "@/public/protein-tub.jpg";

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
    <div className="w-[85vw] sm:w-[280px] md:w-full md:max-w-[340px] h-[340px] md:h-[380px] shrink-0 md:shrink snap-center flex flex-col items-center justify-between p-6 rounded-3xl border border-white/10 bg-[#16171b] hover:border-[#CCFF00]/50 hover:bg-[#181c24] transition-all duration-300 cursor-pointer">
      <div className="relative w-full h-[220px] md:h-[250px] flex items-center justify-center">
        <Image
          src={proteinTub}
          alt={name}
          fill
          className="object-contain p-2"
        />
      </div>
      <div className="text-center pt-2">
        <span className="text-white font-bold tracking-wider text-lg uppercase">
          {name}
        </span>
      </div>
    </div>
  );
}
