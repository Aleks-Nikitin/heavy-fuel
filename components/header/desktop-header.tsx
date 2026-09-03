import Link from "next/link";
import { CATEGORY_DATA } from "@/lib/project-utils";
import { ShoppingCartIcon, UserIcon } from "lucide-react";
export default function DesktopHeader() {
  return (
    <div className="flex w-full items-center justify-between gap-8 font-semibold tracking-wider text-white">
      <div className="">
        <Link href="/" className="transition-colors hover:text-[#CCFF00]">
          HeavyFuel
        </Link>
      </div>
      <div className="flex items-center gap-8 font-semibold tracking-wider text-white">
        {CATEGORY_DATA.map((category) => (
          <Link
            key={category.name}
            href={category.link}
            className="transition-colors hover:text-[#CCFF00]"
          >
            {category.name}
          </Link>
        ))}
      </div>
      <div className="">
        <input
          type="text"
          placeholder="Search"
          className="rounded-md border border-white/15 bg-white/5 px-4 py-2 text-white placeholder:text-white/50 focus:border-[#CCFF00] focus:outline-none focus:ring-1 focus:ring-[#CCFF00]"
        />
      </div>
      <div className="flex items-center gap-8 font-semibold tracking-wider text-white">
        <UserIcon className="text-white transition-colors hover:text-[#CCFF00]" />
        <ShoppingCartIcon className="text-white transition-colors hover:text-[#CCFF00]" />
      </div>
    </div>
  );
}
