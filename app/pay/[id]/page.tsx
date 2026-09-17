"use client";

import CheckoutForm from "@/components/stripe/checkout-form";
import { Elements } from "@stripe/react-stripe-js";
import { StripeElementsOptions, loadStripe } from "@stripe/stripe-js";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!,
);

export default function PayPage() {
  const [clientSecret, setClientSecret] = useState("");
  const params = useParams();
  const id = params?.id as string;

  useEffect(() => {
    if (!id) return;

    const makeRequest = async () => {
      try {
        const res = await fetch(`/api/create-intent/${id}`, {
          method: "POST",
        });

        if (!res.ok) throw new Error("Failed to create intent");

        const data = await res.json();
        setClientSecret(data.clientSecret);
      } catch (err) {
        console.error("Error creating payment intent:", err);
      }
    };

    makeRequest();
  }, [id]);

  if (!clientSecret) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white bg-[#0B0D10]">
        <p className="uppercase tracking-widest font-bold text-[#8E8E93] animate-pulse">
          Loading secure checkout...
        </p>
      </div>
    );
  }

  const options: StripeElementsOptions = {
    clientSecret,
    appearance: {
      theme: "night",
      variables: {
        colorPrimary: "#CCFF00",
        colorBackground: "#13161C",
        colorText: "#ffffff",
        colorDanger: "#ef4444",
        fontFamily: "ui-sans-serif, system-ui, sans-serif",
        spacingUnit: "4px",
        borderRadius: "8px",
      },
      rules: {
        ".Input": {
          backgroundColor: "#0B0D10",
          border: "1px solid rgba(255, 255, 255, 0.1)",
          boxShadow: "none",
        },
        ".Input:focus": {
          border: "1px solid #CCFF00",
        },
      },
    },
  };

  return (
    <div className="min-h-screen bg-[#0B0D10] py-12 px-4 flex items-center justify-center">
      <div className="w-full max-w-xl p-8 bg-[#13161C] border border-white/5 rounded-3xl shadow-2xl">
        <Elements options={options} stripe={stripePromise}>
          <CheckoutForm />
        </Elements>
      </div>
    </div>
  );
}
