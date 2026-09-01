"use client";
import { useState } from "react";
import Link from "next/link";
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
      showSwipeHandle={true}
      swipeDirection={"right"}
    >
      <DrawerTrigger>
        <MenuIcon className="text-white" />
      </DrawerTrigger>
      <DrawerContent className="max-w-[50vw]">
        <DrawerHeader className="flex items-end justify-center">
          <DrawerClose>
            <XIcon className="text-white" size={30} />
          </DrawerClose>
        </DrawerHeader>
        <div className="flex flex-col scroll-fade overflow-y-auto p-4 mt-5 gap-4 text-xl tracking-wider text-white">
          <Link
            href="/supplements"
            className="transition-colors hover:text-[#CCFF00]"
          >
            Supplements
          </Link>
          <Link href="/gear" className="transition-colors hover:text-[#CCFF00]">
            Gear
          </Link>
          <Link
            href="/apparel"
            className="transition-colors hover:text-[#CCFF00]"
          >
            Apparel
          </Link>
        </div>
        <DrawerFooter>
          <h3>Log in</h3>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
    // <div className="">
    //   <button onClick={() => setIsOpen(!isOpen)}>
    //     <MenuIcon className="text-white" />
    //   </button>
    //   {isOpen && (
    //     <>
    //       <Link href="/" className="transition-colors hover:text-[#CCFF00]">
    //         HeavyFuel
    //       </Link>
    //       <Link
    //         href="/supplements"
    //         className="transition-colors hover:text-[#CCFF00]"
    //       >
    //         SUPPLEMENTS
    //       </Link>
    //       <Link href="/gear" className="transition-colors hover:text-[#CCFF00]">
    //         GEAR
    //       </Link>
    //       <Link
    //         href="/apparel"
    //         className="transition-colors hover:text-[#CCFF00]"
    //       >
    //         APPAREL
    //       </Link>
    //     </>
    //   )}
    // </div>
  );
}
