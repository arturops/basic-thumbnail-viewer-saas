import { Button } from '@/components/ui/button';
import Link from 'next/link';
import prisma from '@/lib/db';
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import ThumbnailPreviewer from './_components/thumbnail-previewer';

export default async function Dashboard() {
  const { userId } = await auth();

  if (!userId) {
    return redirect('/sign-in');
  }

  const subscription = await prisma.subscription.findUnique({
    where: { userId: userId },
    select: { status: true },
  });

  if (subscription?.status === 'active') {
    return (
      <div className="flex flex-col items-center justify-center p-8 rounded-lg shadow-md">
        <p className="text-xl  mb-6">You are subscribed!</p>
        <ThumbnailPreviewer channelNameSaved="test" />
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center p-8 rounded-lg shadow-md">
      <p className="text-xl  mb-6">You are not subcribed</p>
      <Button>
        <Link href="/pricing">Subscribe</Link>
      </Button>
    </div>
  );
}
