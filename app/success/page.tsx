"use client";

import { Suspense, useEffect, useState } from "react";
import ConfettiExplosion from "react-confetti-explosion";
import { CheckCircle } from "lucide-react";
import { useCartStore } from "@/lib/store";

const SuccessContent = () => {
  const { clearCart } = useCartStore();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    clearCart();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center gap-6 text-center z-10 relative">
      {isMounted && (
        <ConfettiExplosion
          particleCount={100}
          force={0.6}
          duration={3000}
          colors={["#CCFF00", "#FFFFFF", "#8E8E93"]}
        />
      )}

      <CheckCircle className="w-20 h-20 text-[#CCFF00]" />

      <div className="space-y-2">
        <h1 className="text-3xl md:text-5xl font-black uppercase text-white tracking-tight">
          Payment Successful
        </h1>
        <p className="text-[#8E8E93] font-bold uppercase tracking-wider text-sm md:text-base max-w-md mx-auto">
          Your order has been placed.
        </p>
      </div>
    </div>
  );
};

export default function SuccessPage() {
  return (
    <main className="min-h-screen bg-[#0B0D10] flex items-center justify-center p-4">
      <Suspense>
        <SuccessContent />
      </Suspense>
    </main>
  );
}
