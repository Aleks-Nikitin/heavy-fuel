import Link from "next/link";
import { FlaskConical, ShieldCheck, Truck } from "lucide-react";
export default function Footer() {
  return (
    <footer className="w-full bg-[#0B0D10] border-t border-white/10 pt-12 pb-6 mt-20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-12 border-b border-white/5">
          <div className="flex flex-col items-center md:items-start text-center md:text-left gap-3">
            <div className="p-3 rounded-full bg-[#13161C] border border-white/5">
              <FlaskConical className="w-6 h-6 text-[#CCFF00]" />
            </div>
            <div>
              <h4 className="text-white font-bold uppercase tracking-wide">
                Lab Tested
              </h4>
              <p className="text-[#8E8E93] text-sm mt-1">
                100% pure, clinical-dose ingredients.
              </p>
            </div>
          </div>

          <div className="flex flex-col items-center md:items-start text-center md:text-left gap-3">
            <div className="p-3 rounded-full bg-[#13161C] border border-white/5">
              <ShieldCheck className="w-6 h-6 text-[#CCFF00]" />
            </div>
            <div>
              <h4 className="text-white font-bold uppercase tracking-wide">
                Heavy Duty
              </h4>
              <p className="text-[#8E8E93] text-sm mt-1">
                Reinforced gear built for the platform.
              </p>
            </div>
          </div>

          <div className="flex flex-col items-center md:items-start text-center md:text-left gap-3">
            <div className="p-3 rounded-full bg-[#13161C] border border-white/5">
              <Truck className="w-6 h-6 text-[#CCFF00]" />
            </div>
            <div>
              <h4 className="text-white font-bold uppercase tracking-wide">
                Fast Shipping
              </h4>
              <p className="text-[#8E8E93] text-sm mt-1">
                Orders ship within 24 hours.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 py-12">
          <div className="md:col-span-1 flex flex-col items-center md:items-start text-center md:text-left">
            <Link
              href="/"
              className="text-2xl font-black uppercase text-white tracking-tighter"
            >
              Heavy<span className="text-[#CCFF00]">Fuel</span>
            </Link>
            <p className="text-[#8E8E93] text-sm mt-4 max-w-[250px]">
              Clinical-grade performance supplements and elite heavy-duty
              lifting gear.
            </p>
          </div>
          <div className="flex flex-col items-center md:items-start">
            <h4 className="text-white font-bold uppercase tracking-wider mb-4">
              Shop
            </h4>
            <ul className="flex flex-col gap-3 text-sm text-[#8E8E93] text-center md:text-left">
              <li>
                <Link
                  href="/shop/supplements"
                  className="hover:text-[#CCFF00] transition-colors"
                >
                  Supplements
                </Link>
              </li>
              <li>
                <Link
                  href="/shop/gear"
                  className="hover:text-[#CCFF00] transition-colors"
                >
                  Lifting Gear
                </Link>
              </li>
              <li>
                <Link
                  href="/shop/apparel"
                  className="hover:text-[#CCFF00] transition-colors"
                >
                  Apparel
                </Link>
              </li>
              <li>
                <Link
                  href="/shop/bundles"
                  className="hover:text-[#CCFF00] transition-colors"
                >
                  Stacks & Bundles
                </Link>
              </li>
            </ul>
          </div>
          <div className="flex flex-col items-center md:items-start">
            <h4 className="text-white font-bold uppercase tracking-wider mb-4">
              Support
            </h4>
            <ul className="flex flex-col gap-3 text-sm text-[#8E8E93] text-center md:text-left">
              <li>
                <Link href="#" className="hover:text-white transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white transition-colors">
                  Shipping & Returns
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white transition-colors">
                  Track Order
                </Link>
              </li>
            </ul>
          </div>
          <div className="flex flex-col items-center md:items-start">
            <h4 className="text-white font-bold uppercase tracking-wider mb-4">
              Headquarters
            </h4>
            <address className="text-[#8E8E93] text-sm not-italic text-center md:text-left leading-relaxed">
              Designed & Engineered in
              <br />
              Oxford, MS 38655
              <br />
              United States
            </address>
          </div>
        </div>

        <div className="border-t border-white/5 pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-[#8E8E93] text-xs">
            &copy; {new Date().getFullYear()} HeavyFuel. All rights reserved.
          </p>
          <div className="flex gap-4 text-xs text-[#8E8E93]">
            <Link href="#" className="hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <Link href="#" className="hover:text-white transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
