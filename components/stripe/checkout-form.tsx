"use client";

import {
  LinkAuthenticationElement,
  PaymentElement,
  AddressElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { useEffect, useState } from "react";

const CheckoutForm = () => {
  const stripe = useStripe();
  const elements = useElements();

  const [message, setMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!stripe) return;

    const clientSecret = new URLSearchParams(window.location.search).get(
      "payment_intent_client_secret",
    );

    if (!clientSecret) return;

    stripe.retrievePaymentIntent(clientSecret).then(({ paymentIntent }) => {
      switch (paymentIntent?.status) {
        case "succeeded":
          setMessage("Payment succeeded!");
          break;
        case "processing":
          setMessage("Your payment is processing.");
          break;
        case "requires_payment_method":
          setMessage("Your payment was not successful, please try again.");
          break;
        default:
          setMessage("Something went wrong.");
          break;
      }
    });
  }, [stripe]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!stripe || !elements) return;

    setIsLoading(true);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/success`,
      },
    });

    if (error.type === "card_error" || error.type === "validation_error") {
      setMessage(error.message || "Something went wrong!");
    } else {
      setMessage("An unexpected error occurred.");
    }

    setIsLoading(false);
  };

  return (
    <form
      id="payment-form"
      onSubmit={handleSubmit}
      className="flex flex-col gap-6"
    >
      <div className="flex flex-col gap-4">
        <LinkAuthenticationElement id="link-authentication-element" />

        <h3 className="text-white font-bold uppercase tracking-wide mt-4">
          Shipping Information
        </h3>
        <AddressElement options={{ mode: "shipping" }} />
        <h3 className="text-white font-bold uppercase tracking-wide mt-4">
          Payment Details
        </h3>
        <PaymentElement id="payment-element" options={{ layout: "tabs" }} />
      </div>

      <button
        disabled={isLoading || !stripe || !elements}
        id="submit"
        className="w-full h-14 rounded-xl bg-[#CCFF00] text-black font-black uppercase tracking-widest hover:bg-[#b3e600] transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-4"
      >
        <span id="button-text">{isLoading ? "Processing..." : "Pay Now"}</span>
      </button>

      {message && (
        <div
          id="payment-message"
          className="text-red-400 text-sm font-bold text-center mt-2"
        >
          {message}
        </div>
      )}
    </form>
  );
};

export default CheckoutForm;
