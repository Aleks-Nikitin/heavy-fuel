"use client";

import CartCard from "@/components/cart/cart-card";
import { Button } from "@/components/ui/button";
import { useSession } from "@/lib/auth-client";
import { useCartStore } from "@/lib/store";
import { ShieldCheck, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { createOrder } from "@/lib/actions/order-actions";

export default function CartPage() {
  const { data: session, isPending: isSessionPending } = useSession();
  const router = useRouter();
  const { products, totalItems, totalPrice, clearCart } = useCartStore();

  const { mutate: handleCheckout, isPending: isCheckoutPending } = useMutation({
    mutationFn: async () => {
      if (!session && !isSessionPending) {
        router.push("/auth");
        return;
      }
      const payload = products.map((item) => ({
        productVariantId: item.productVariantId,
        quantity: item.quantity,
      }));

      return await createOrder(payload);
    },
    onSuccess: (orderId) => {
      if (orderId) router.push(`/pay/${orderId}`);
    },
    onError: (error) => {
      console.error("Error during checkout:", error);
    },
  });

  return (
    <main className="min-h-screen bg-[#0B0D10] py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl md:text-5xl font-black uppercase text-white tracking-tight mb-8">
          Your Stack {totalItems > 0 ? `(${totalItems})` : ""}
        </h1>
        {products.length > 0 && (
          <button
            type="button"
            onClick={clearCart}
            className="flex items-center gap-2 px-3 sm:px-4 py-3 text-xs font-bold uppercase tracking-wider text-[#8E8E93] hover:text-red-400 border border-white/10 hover:border-red-500/30 bg-[#13161C] hover:bg-red-500/10 rounded-xl transition-all shrink-0"
          >
            <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span>Clear Cart</span>
          </button>
        )}
        {products.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 px-4 bg-[#13161C] border border-white/10 rounded-3xl text-center">
            <p className="text-[#8E8E93] font-bold uppercase tracking-wider">
              Your cart is currently empty
            </p>
          </div>
        ) : (
          <div className="flex flex-col mt-6 lg:flex-row gap-8 lg:gap-12 items-start">
            <div className="w-full lg:w-2/3 flex flex-col gap-3 sm:gap-4">
              {products.map((item) => (
                <CartCard key={item.productVariantId} item={item} />
              ))}
            </div>
            <div className="w-full lg:w-1/3 bg-[#13161C] border border-white/10 rounded-3xl p-6 lg:p-8 lg:sticky lg:top-24">
              <h2 className="text-xl font-black uppercase text-white tracking-wide mb-6">
                Order Summary
              </h2>

              <div className="flex flex-col gap-4 text-sm font-bold uppercase tracking-wider text-[#8E8E93] border-b border-white/10 pb-6 mb-6">
                <div className="flex justify-between items-center">
                  <span>Subtotal</span>
                  <span className="text-white">${totalPrice.toFixed(2)}</span>
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
                  ${totalPrice.toFixed(2)}
                </span>
              </div>

              <Button
                onClick={() => handleCheckout()}
                disabled={isCheckoutPending || isSessionPending}
                className="w-full h-16 rounded-2xl bg-[#CCFF00] text-black font-black uppercase tracking-wider text-lg hover:bg-[#b3e600] transition-all hover:scale-[1.02]"
              >
                {isCheckoutPending
                  ? "Generating Order..."
                  : "Proceed to Checkout"}
              </Button>

              <div className="mt-6 flex items-center justify-center gap-2 text-xs text-[#8E8E93] uppercase tracking-widest">
                <ShieldCheck className="w-4 h-4" />
                Secure encrypted checkout
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
