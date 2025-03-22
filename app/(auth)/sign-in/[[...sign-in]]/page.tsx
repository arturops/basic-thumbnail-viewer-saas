'use client';

import { SignIn } from '@clerk/nextjs';
import { dark } from '@clerk/themes';
import { useTheme } from 'next-themes';
import Link from 'next/link';

export default function Page() {
  //resolves the theme from the system
  const { resolvedTheme } = useTheme();

  return (
    // space-y-xx is the one setting the space between all divs (main components inside the first div)
    <div className="mt-24 flex flex-col items-center space-y-12">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-foreground">Welcome back!</h2>
        <p className="mt-2 text-lg text-muted-foreground">
          Sign in to your account
        </p>
      </div>
      <SignIn
        forceRedirectUrl="/dashboard"
        appearance={{
          baseTheme: resolvedTheme === 'dark' ? dark : undefined,
          elements: {
            headerTitle: 'hidden',
            socialButtons:
              'bg-white hover:bg-white/80 border border-border rounded-lg',
            socialButtonsBlockButtonText__google: { color: 'black' },
            footer: { display: 'none' },
          },
        }}
      />
      <div>
        <p className="text-lg text-muted-foreground">
          Don&apos;t have an account?{' '}
          <Link
            href="/sign-up"
            className="underline font-bold text-foreground hover:text-primary/60"
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
