'use client';

import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function Cancelled() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen space-y-6 text-center">
      <h1 className="font-bold text-2xl">Payment Cancelled</h1>
      <div className="w-[300px] h-[3px] bg-red-500"></div>
      <p className="text-xl">
        Your payment was cancelled. No charges were made.
      </p>
      <Button>
        <Link href="/pricing"> Return to Pricing</Link>
      </Button>
    </div>
  );
}
