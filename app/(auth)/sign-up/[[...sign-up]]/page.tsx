'use client';

import { SignUp } from '@clerk/nextjs';
import Link from 'next/link';
import { dark } from '@clerk/themes';
import { useTheme } from 'next-themes';

export default function Page() {
  // returns the system resolved theme
  const { resolvedTheme } = useTheme();

  return (
    <div className="mt-24 flex items-center justify-center flex-col space-y-12">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-foreground">
          Create an account
        </h2>
        <p className="mt-2 text-lg text-muted-foreground">
          Sign up to get started!
        </p>
      </div>
      <SignUp
        appearance={{
          baseTheme: resolvedTheme === 'dark' ? dark : undefined,
          elements: {
            headerTitle: 'hidden',
            headerSubtitle: 'text-muted-foreground',
            socialButtons:
              'bg-white hover:bg-white/80 border border-border rounded-lg',
            socialButtonsBlockButtonText__google: { color: 'black' },

            footer: { display: 'none' },
          },
        }}
        forceRedirectUrl="/dashboard"
      />
      <p className="mt-2 text-lg text-muted-foreground">
        Already have an account?{' '}
        <Link
          href="/sign-in"
          className="underline font-bold text-foreground hover:text-primary/60"
        >
          Sign in
        </Link>
      </p>
    </div>
  );
}
