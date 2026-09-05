import CartCard from "@/components/cart/cart-card";
import { PRODUCT_DATA } from "@/lib/project-utils";
import { Button } from "@/components/ui/button";
import { ShieldCheck } from "lucide-react";

export default function CartPage() {
  // backend: fetch user id
  // backend: fetch cart[] from db using user id

  // Mock data mapping
  const cartItems = [PRODUCT_DATA[0], PRODUCT_DATA[0], PRODUCT_DATA[0]];

  const subtotal = cartItems.reduce((total, item) => total + item.price, 0);

  return (
    <main className="min-h-screen bg-[#0B0D10] py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl md:text-5xl font-black uppercase text-white tracking-tight mb-8">
          Your Stack
        </h1>

        <div className="flex flex-col lg:flex-row gap-12 items-start">
          {/* Left Column: Cart Items */}
          <div className="w-full lg:w-2/3 flex flex-col gap-4">
            {cartItems.map((item, index) => (
              // Using index as key temporarily since we are duplicating the mock item
              <CartCard key={`${item.id}-${index}`} item={item} />
            ))}
          </div>

          {/* Right Column: Order Summary (Sticky on Desktop) */}
          <div className="w-full lg:w-1/3 bg-[#13161C] border border-white/10 rounded-3xl p-6 lg:p-8 lg:sticky lg:top-24">
            <h2 className="text-xl font-black uppercase text-white tracking-wide mb-6">
              Order Summary
            </h2>

            <div className="flex flex-col gap-4 text-sm font-bold uppercase tracking-wider text-[#8E8E93] border-b border-white/10 pb-6 mb-6">
              <div className="flex justify-between items-center">
                <span>Subtotal</span>
                <span className="text-white">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Tax</span>
                <span className="text-white">Calculated at checkout</span>
              </div>
              <div className="flex justify-between items-center text-[#CCFF00]">
                <span>Shipping</span>
                <span>FREE</span>
              </div>
            </div>

            <div className="flex justify-between items-end mb-8">
              <span className="text-white uppercase font-bold tracking-wider">
                Total
              </span>
              <span className="text-3xl font-black text-[#CCFF00]">
                ${subtotal.toFixed(2)}
              </span>
            </div>

            <Button className="w-full h-16 rounded-2xl bg-[#CCFF00] text-black font-black uppercase tracking-wider text-lg hover:bg-[#b3e600] transition-all hover:scale-[1.02]">
              Proceed to Checkout
            </Button>

            <div className="mt-6 flex items-center justify-center gap-2 text-xs text-[#8E8E93] uppercase tracking-widest">
              <ShieldCheck className="w-4 h-4" />
              Secure encrypted checkout
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
