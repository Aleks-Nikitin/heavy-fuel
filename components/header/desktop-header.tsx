import Link from "next/link";
import {ShoppingCartIcon,UserIcon} from "lucide-react"
export default function DesktopHeader(){
    return(

            <div className="flex items-center gap-8 font-semibold tracking-wider text-white">
            <Link href="/" className="transition-colors hover:text-[#CCFF00]">HeavyFuel</Link>
            <Link href="/supplements" className="transition-colors hover:text-[#CCFF00]">SUPPLEMENTS</Link>
            <Link href="/gear" className="transition-colors hover:text-[#CCFF00]">GEAR</Link>
            <Link href="/apparel" className="transition-colors hover:text-[#CCFF00]">APPAREL</Link>
            <UserIcon className="text-white transition-colors hover:text-[#CCFF00]" />
            <ShoppingCartIcon className="text-white transition-colors hover:text-[#CCFF00]" />
            </div>
         
    )
}