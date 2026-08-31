import MobileHeader from "./mobile-header";
import DesktopHeader from "./desktop-header";
export default function Header(){
    return(
       <header className="sticky top-2 z-50 mx-auto max-w-5xl rounded-2xl border border-white/15 bg-white/5 p-4 backdrop-blur-xl shadow-2xl">
        <nav className="flex items-center justify-between">
           <div className="block md:hidden">
               <MobileHeader />
           </div>
           <div className="hidden md:block">
               <DesktopHeader />
           </div>
         
        </nav>
</header>
    )
}