import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id: orderId } = await params;

    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },

        { status: 401 },
      );
    }

    const order = await prisma.order.findUnique({
      where: { id: orderId },
    });

    if (!order) {
      return NextResponse.json(
        { error: "Order not found" },

        { status: 404 },
      );
    }

    if (order.userId !== session.user.id) {
      return NextResponse.json(
        { error: "Forbidden" },

        { status: 403 },
      );
    }
    if (order.stripeIntentId) {
      const existingIntent = await stripe.paymentIntents.retrieve(
        order.stripeIntentId,
      );

      if (
        existingIntent.status !== "succeeded" &&
        existingIntent.status !== "canceled"
      ) {
        return NextResponse.json({
          clientSecret: existingIntent.client_secret,
        });
      }
    }
    const amountInCents = Math.round(Number(order.totalAmount) * 100);

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInCents,
      currency: "usd",
      automatic_payment_methods: { enabled: true },
      metadata: { orderId: order.id },
    });

    if (paymentIntent) {
      await prisma.order.update({
        where: { id: order.id },
        data: { stripeIntentId: paymentIntent.id },
      });

      return NextResponse.json({ clientSecret: paymentIntent.client_secret });
    }
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred",
      },
      { status: 500 },
    );
  }
}
