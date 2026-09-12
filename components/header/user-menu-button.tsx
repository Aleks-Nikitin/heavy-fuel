"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { User, Package, LogOut, LogIn } from "lucide-react";
import { useSession, signOut } from "@/lib/auth-client";

export default function UserMenuButton() {
  const { data: session, isPending } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  if (isPending) {
    return <div className="w-6 h-6 animate-pulse bg-white/10 rounded-full" />;
  }

  if (!session) {
    return (
      <Link
        href="/auth"
        className="text-white hover:text-[#CCFF00] transition-colors"
      >
        <User size={28} />
      </Link>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="text-white hover:text-[#CCFF00] transition-colors focus:outline-none flex items-center gap-1"
      >
        <User size={28} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-3 w-48 bg-[#13161C] border border-white/10 rounded-2xl shadow-2xl py-2 z-50 overflow-hidden">
          <div className="px-4 py-2 border-b border-white/10 mb-1">
            <p className="text-xs font-bold text-white truncate">
              {session.user.name}
            </p>
            <p className="text-[10px] text-[#8E8E93] truncate">
              {session.user.email}
            </p>
          </div>

          <Link
            href="/profile"
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-3 px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-white hover:bg-white/5 hover:text-[#CCFF00] transition-colors"
          >
            <User size={16} />
            Profile
          </Link>

          <Link
            href="/orders"
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-3 px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-white hover:bg-white/5 hover:text-[#CCFF00] transition-colors"
          >
            <Package size={16} />
            Orders
          </Link>

          <button
            onClick={async () => {
              setIsOpen(false);
              await signOut({
                fetchOptions: {
                  onSuccess: () => {
                    router.push("/auth");
                    router.refresh();
                  },
                },
              });
            }}
            className="w-full flex items-center gap-3 px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-red-400 hover:bg-red-500/10 transition-colors border-t border-white/10 mt-1"
          >
            <LogOut size={16} />
            Log Out
          </button>
        </div>
      )}
    </div>
  );
}
