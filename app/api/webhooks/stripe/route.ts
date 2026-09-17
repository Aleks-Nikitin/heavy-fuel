import { headers } from "next/headers";
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { prisma } from "@/lib/prisma";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: Request) {
  const body = await req.text();

  const signature = (await headers()).get("Stripe-Signature");

  if (!signature) {
    return NextResponse.json({ error: "No signature found" }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!,
    );
  } catch (error: any) {
    console.error(`Webhook Error: ${error.message}`);
    return NextResponse.json(
      { error: `Webhook Error: ${error.message}` },
      { status: 400 },
    );
  }

  if (event.type === "payment_intent.succeeded") {
    const paymentIntent = event.data.object as Stripe.PaymentIntent;
    const shipping = paymentIntent.shipping;
    const orderId = paymentIntent.metadata.orderId;

    if (!orderId) {
      console.error("Webhook Error: No orderId in metadata");
      return NextResponse.json(
        { error: "Missing orderId in metadata" },
        { status: 400 },
      );
    }

    try {
      await prisma.order.update({
        where: {
          id: orderId,
        },
        data: {
          status: "PROCESSING",
          stripeIntentId: paymentIntent.id,

          shippingName: shipping?.name ?? null,
          addressLine1: shipping?.address?.line1 ?? null,
          addressLine2: shipping?.address?.line2 ?? null,
          city: shipping?.address?.city ?? null,
          state: shipping?.address?.state ?? null,
          zipCode: shipping?.address?.postal_code ?? null,
          country: shipping?.address?.country ?? null,
        },
      });

      console.log(
        `Order ${orderId} updated successfully for intent: ${paymentIntent.id}`,
      );
    } catch (error) {
      console.error("Failed to update order status in database", error);
      return NextResponse.json(
        { error: "Database update failed" },
        { status: 500 },
      );
    }
  }
  return NextResponse.json({ received: true }, { status: 200 });
}
