export default function Header(){
    return(
       <header className="sticky top-4 z-50 mx-auto max-w-5xl rounded-2xl border border-white/15 bg-white/5 p-4 backdrop-blur-xl shadow-2xl">
        <nav className="flex items-center justify-between">
            <div className="flex items-center gap-8 font-semibold tracking-wider text-white">
            <a href="#" className="transition-colors hover:text-[#CCFF00]">SUPPLEMENTS</a>
            <a href="#" className="transition-colors hover:text-[#CCFF00]">GEAR</a>
            <a href="#" className="transition-colors hover:text-[#CCFF00]">APPAREL</a>
            </div>
  </nav>
</header>
    )
}