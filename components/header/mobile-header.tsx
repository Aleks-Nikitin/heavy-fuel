import Link from "next/link";
import {MenuIcon,ShoppingCartIcon,UserIcon,SearchIcon} from "lucide-react"
export default function MobileHeader(){
    return(
       
            <div className="flex items-center gap-8 font-semibold tracking-wider text-white">
      
            <Link href="/" className="transition-colors hover:text-[#CCFF00]">HeavyFuel</Link>
            <UserIcon className="text-white" />
            <SearchIcon className="text-white" />
            <ShoppingCartIcon className="text-white" />
            <MenuIcon className="text-white" />
            </div>
    )
}