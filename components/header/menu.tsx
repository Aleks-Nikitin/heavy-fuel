"use client";
import { useState } from "react";
import { CATEGORY_DATA } from "@/lib/project-utils";
import Link from "next/link";
import {signOut} from "@/actions/auth-actions";
import { ChevronRight } from "lucide-react";
import { MenuIcon, XIcon } from "lucide-react";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

export default function Menu() {
  const [open, setOpen] = useState<boolean>(false);
  return (
    <Drawer
      open={open}
      onOpenChange={setOpen}
      swipeDirection={"right"}
    >
      <DrawerTrigger>
          <MenuIcon className="text-white" />
      </DrawerTrigger>
      <DrawerContent className="max-w-[50vw] bg-[#0B0D10]/70">
    <DrawerHeader className="flex flex-row justify-between items-center px-6 py-6 border-b border-white/10 text-left"> 
  <DrawerTitle className="text-2xl font-black uppercase tracking-tighter text-white"> 
    menu 
  </DrawerTitle> 
  <DrawerClose className="flex items-center justify-center"> 
    <XIcon className="text-white" size={30} /> 
  </DrawerClose> 
</DrawerHeader>

        <div className="flex flex-col scroll-fade overflow-y-auto px-6 py-8 gap-8 text-xl tracking-wider text-white">
          {CATEGORY_DATA.map((category) => (
            <Link
              key={category.name}
              href={category.link}
              onClick={() => setOpen(false)}
              className="group flex items-center justify-between text-xl font-black uppercase tracking-wider text-white transition-all hover:text-[#CCFF00]"
            >
              <span className="transform transition-transform group-hover:translate-x-2">
                {category.name}
              </span>
              <ChevronRight className="w-5 h-5 opacity-0 -translate-x-4 transition-all group-hover:opacity-100 group-hover:translate-x-0" />
            </Link>
          ))}
        </div>
    <DrawerFooter className="px-6 py-6 border-t border-white/10 mt-auto">
          <div className="text-[10px] text-center text-[#8E8E93] uppercase tracking-widest font-bold">
            HeavyFuel © {new Date().getFullYear()}
          </div>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
