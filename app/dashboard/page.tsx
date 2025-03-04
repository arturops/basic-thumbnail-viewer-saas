import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default async function Dashboard() {
  return (
    <div className="flex flex-col items-center justify-center p-8 rounded-lg shadow-md">
      <p className="text-xl  mb-6">You are not subcribed</p>
      <Button>
        <Link href="/pricing">Subscribe</Link>
      </Button>
    </div>
  );
}
