"use client";
import Link from "next/link";
import { CATEGORY_DATA } from "@/lib/project-utils";
import { useSession } from "@/lib/auth-client";
import UserMenuButton from "./user-menu-button";
import { SearchIcon, ShoppingCartIcon, User, UserIcon } from "lucide-react";
import CartIcon from "./cart-icon";
import SearchModal from "./search-modal";

export default function DesktopHeader() {
  const { data: session, isPending } = useSession();
  return (
    <div className="flex w-full items-center justify-between gap-8 font-semibold tracking-wider text-white">
      <div className="">
        <Link
          href="/"
          className="text-2xl font-black uppercase text-white tracking-tighter"
        >
          Heavy<span className="text-[#CCFF00]">Fuel</span>
        </Link>
      </div>
      <div className="flex items-center gap-8 font-semibold tracking-wider text-white">
        {CATEGORY_DATA.map((category) => (
          <Link
            key={category.name}
            href={category.link}
            className="transition-colors uppercase hover:text-[#CCFF00]"
          >
            {category.name}
          </Link>
        ))}
      </div>
      <div className="flex items-center gap-8 font-semibold tracking-wider text-white">
        <SearchModal></SearchModal>
        <UserMenuButton />
        <CartIcon mobile={false} />
      </div>
    </div>
  );
}
