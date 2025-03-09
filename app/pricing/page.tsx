import { Button } from '@/components/ui/button';
import React from 'react';
import prisma from '@/lib/db';
import { getStripeSession, stripe } from '@/lib/stripe';
import { unstable_noStore } from 'next/cache';
import { redirect } from 'next/navigation';
import { auth, currentUser } from '@clerk/nextjs/server';
import Link from 'next/link';

async function getData(userId: string | null) {
  // do not cache data to always show the most recent subscription status
  unstable_noStore();
  if (!userId) {
    return null;
  }
  const subscription = await prisma.subscription.findUnique({
    where: { userId: userId },
    select: {
      status: true,
      user: { select: { stripeCustomerId: true } },
    },
  });

  return subscription;
}

export default async function Pricing() {
  const { userId } = await auth();
  const user = await currentUser();

  const subscription = await getData(userId);
  const isSubscribed = subscription?.status === 'active';

  async function createSubscription() {
    'use server';

    if (!userId) {
      return redirect('/sign-in?redirect_url=/pricing');
    }

    let databaseUser = await prisma.user.findUnique({
      where: { id: userId },
      select: { stripeCustomerId: true },
    });

    if (!databaseUser) {
      throw new Error('User not found');
    }

    const email = user?.primaryEmailAddress?.emailAddress;

    if (!databaseUser.stripeCustomerId) {
      const customer = await stripe.customers.create({
        email: email,
      });
      //above we ensure the user exists in db and stripe
      databaseUser = await prisma.user.update({
        where: { id: userId },
        data: { stripeCustomerId: customer.id },
        select: { stripeCustomerId: true }, //to return the stripeCustomerId
      });

      console.log('databaseUser', databaseUser);
    }

    if (!databaseUser.stripeCustomerId) {
      throw new Error('Stripe customer not found');
    }

    const subscriptionUrl = await getStripeSession({
      priceId: process.env.STRIPE_PRICE_ID as string,
      domainUrl:
        process.env.NODE_ENV === 'production'
          ? (process.env.PRODUCTION_URL as string)
          : 'http://localhost:3000',
      customerId: databaseUser.stripeCustomerId,
    });

    return redirect(subscriptionUrl);
  }

  // method to allow user to cancel subscription
  async function createCustomerPortal() {
    'use server';

    if (!userId) {
      return redirect('/sign-in?redirect_url=/pricing');
    }

    const customerPortalUrl = await stripe.billingPortal.sessions.create({
      customer: userId,
      return_url:
        process.env.NODE_ENV === 'production'
          ? (process.env.PRODUCTION_URL as string)
          : 'http://localhost:3000',
    });

    return redirect(customerPortalUrl.url);
  }

  const backLink = userId ? '/dashboard' : '/';

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
        Subscribe Plan
      </h1>
      <div className="bg-card space-y-4 rounded-lg border-2 text-card-foreground shadow-[#929394] shadow-sm p-6">
        <Link
          href={backLink}
          className="text-sm font-medium text-primary underline-offset-4 hover:underline"
        >
          &larr; Back
        </Link>
        <h2 className="border-b-1 pb-2 text-3xl font-semibold tracking-tight">
          Full Access
        </h2>
        <p className="leading-7">Access to all features</p>
        <p className="text-2xl font-bold">$9.99/month</p>
        {isSubscribed ? (
          <form action={createCustomerPortal}>
            <Button type="submit">Manage Subscription</Button>
          </form>
        ) : (
          <form action={createSubscription}>
            <Button type="submit">Subscribe</Button>
          </form>
        )}
      </div>
    </div>
  );
}
