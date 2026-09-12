"use client";
import Link from "next/link";
import { CATEGORY_DATA } from "@/lib/project-utils";
import { useSession } from "@/lib/auth-client";
import UserMenuButton from "./user-menu-button";
import { ShoppingCartIcon, User, UserIcon } from "lucide-react";

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
      <div className="">
        <input
          type="text"
          placeholder="Search"
          className="rounded-md border border-white/15 bg-white/5 px-4 py-2 text-white placeholder:text-white/50 focus:border-[#CCFF00] focus:outline-none focus:ring-1 focus:ring-[#CCFF00]"
        />
      </div>
      <div className="flex items-center gap-8 font-semibold tracking-wider text-white">
        {/* <Link href={session?.user ? "/profile" : "/auth"}>
          <UserIcon className="text-white transition-colors hover:text-[#CCFF00]" />
          
        </Link> */}
        <UserMenuButton />
        <Link href="/cart">
          <ShoppingCartIcon className="text-white transition-colors hover:text-[#CCFF00]" />
        </Link>
      </div>
    </div>
  );
}
