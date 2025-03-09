import { stripe } from '@/lib/stripe';
import Stripe from 'stripe';
import prisma from '@/lib/db';
import { headers } from 'next/headers';

// async request handler
export async function POST(req: Request) {
  const body = await req.text();
  const headersList = await headers();
  const signature = headersList.get('Stripe-Signature') as string;

  let event: Stripe.Event;

  // verify and construct the event
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET as string
    );
    console.log(`Event ${event.type}:`, event);
  } catch {
    return new Response('Payment Error: Invalid payload', {
      status: 400,
    });
  }

  const session = event.data.object as Stripe.Checkout.Session;

  if (event.type === 'checkout.session.completed') {
    const subscription = await stripe.subscriptions.retrieve(
      session.subscription as string
    );
    const user = await prisma.user.findUnique({
      where: { stripeCustomerId: session.customer as string },
    });
    if (!user) {
      return new Response('Payment Error: User not found', {
        status: 404,
      });
    }

    await prisma.subscription.create({
      data: {
        userId: user.id,
        stripeSubscriptionId: subscription.id,
        currentPeriodEnd: new Date(subscription.current_period_end * 1000),
        currentPeriodStart: new Date(subscription.current_period_start * 1000),
        interval: subscription.items.data[0].plan.interval,
        planId: subscription.items.data[0].plan.id,
        status: subscription.status,
      },
    });
  }

  if (event.type === 'invoice.payment_succeeded') {
    const subscription = await stripe.subscriptions.retrieve(
      session.subscription as string
    );

    await prisma.subscription.update({
      where: { stripeSubscriptionId: subscription.id },
      data: {
        status: subscription.status,
        currentPeriodEnd: new Date(subscription.current_period_end * 1000),
      },
    });
  }

  if (event.type === 'customer.subscription.updated') {
    const subscription = await stripe.subscriptions.retrieve(
      session.subscription as string
    );

    await prisma.subscription.update({
      where: { stripeSubscriptionId: subscription.id },
      data: {
        currentPeriodEnd: new Date(subscription.current_period_end * 1000),
        currentPeriodStart: new Date(subscription.current_period_start * 1000),
        interval: subscription.items.data[0].plan.interval,
        planId: subscription.items.data[0].plan.id,
        // this next line shuts down the user access right away if the user cancels subscription
        status: subscription.cancel_at_period_end
          ? 'cancelling'
          : subscription.status,
      },
    });
  }

  if (event.type === 'customer.subscription.deleted') {
    const subscription = await stripe.subscriptions.retrieve(
      session.subscription as string
    );

    await prisma.subscription.update({
      where: { stripeSubscriptionId: subscription.id },
      data: {
        status: subscription.status,
      },
    });
  }

  return new Response(null, { status: 200 });
}
