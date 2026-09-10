"use client";
import { useState } from "react";
import { CATEGORY_DATA } from "@/lib/project-utils";
import Link from "next/link";
import {signOut} from "@/actions/auth-actions";
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
        <div className="flex flex-col scroll-fade overflow-y-auto p-4 mt-5 gap-4 text-xl tracking-wider text-white">
          <Link href="/signup">
            Sign up
          </Link>
          <Link href="/login" onClick={() => signOut()}>
            Sign out
          </Link>
        </div>
        <DrawerFooter>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
