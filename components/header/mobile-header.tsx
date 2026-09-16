"use client";
import { useSession } from "@/lib/auth-client";
import SearchModal from "./search-modal";
import Link from "next/link";
import Menu from "./menu";
import UserMenuButton from "./user-menu-button";
import CartIcon from "./cart-icon";
export default function MobileHeader() {
  const { data: session, isPending } = useSession();
  return (
    <div className="flex w-full items-center justify-between font-semibold tracking-wider text-white">
      <div className="">
        <Link
          href="/"
          className="text-2xl font-black uppercase text-white tracking-tighter"
        >
          Heavy<span className="text-[#CCFF00]">Fuel</span>
        </Link>
      </div>
      <div className="flex items-center gap-8">
        <UserMenuButton />
        <SearchModal></SearchModal>
        <CartIcon mobile={true} />
        <Menu />
      </div>
    </div>
  );
}
