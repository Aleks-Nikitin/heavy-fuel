"use client";
import { useSession } from "@/lib/auth-client";
import Link from "next/link";
import { MenuIcon, ShoppingCartIcon, UserIcon, SearchIcon } from "lucide-react";
import Menu from "./menu";
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
        <Link href={session?.user ? "/profile" : "/auth"}>
          <UserIcon className="text-white" />
        </Link>
        <SearchIcon className="text-white" />
        <Link href="/cart">
          <ShoppingCartIcon className="text-white" />
        </Link>
        <Menu />
      </div>
    </div>
  );
}
