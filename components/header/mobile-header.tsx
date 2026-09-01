import Link from "next/link";
import { MenuIcon, ShoppingCartIcon, UserIcon, SearchIcon } from "lucide-react";
import Menu from "./menu";
export default function MobileHeader() {
  return (
    <div className="flex w-full items-center justify-between font-semibold tracking-wider text-white">
      <div className="">
        <Link href="/" className="transition-colors hover:text-[#CCFF00]">
          HeavyFuel
        </Link>
      </div>
      <div className="flex items-center gap-8">
        <UserIcon className="text-white" />
        <SearchIcon className="text-white" />
        <ShoppingCartIcon className="text-white" />
        <Menu />
      </div>
    </div>
  );
}
