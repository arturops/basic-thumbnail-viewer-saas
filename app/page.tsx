import { Button } from '@/components/ui/button';
import Image from 'next/image';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="bg-background text-foreground">
      <main className="container mx-auto px-4 pt-12 text-center">
        <h1 className="text-4xl md:test-6xl font-bold mb-4">
          Thumbnail Saas tutorial
        </h1>
        <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
          Description
        </p>
        <div className="flex justify-center space-x-4">
          <Button>
            <Link href="/dashboard">Get Started</Link>
          </Button>
          <Button variant="outline">
            <Link href="/pricing">View Pricing</Link>
          </Button>
        </div>
        <img src="" alt="" className="w-full h-auto mt-8" />
      </main>
    </div>
  );
}
