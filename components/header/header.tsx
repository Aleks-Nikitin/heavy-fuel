import MobileHeader from "./mobile-header";
import DesktopHeader from "./desktop-header";
export default function Header() {
  return (
    <header className="sticky z-50 border border-white/15 bg-white/5 p-4 backdrop-blur-xl shadow-2xl">
      <nav className="flex w-full items-center">
        <div className="flex w-full md:hidden">
          <MobileHeader />
        </div>
        <div className="hidden md:flex w-full">
          <DesktopHeader />
        </div>
      </nav>
    </header>
  );
}
