import { SignUp } from '@clerk/nextjs';
import Link from 'next/link';

export default function Page() {
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
          elements: {
            card: 'bg-card border border-border shadow-lg rounded-xl p-6',
            footer: { display: 'none' },
            headerTitle: 'hidden',
            headerSubtitle: 'text-muted-foreground',
            socialButtonsBlockButton__google: 'bg-white hoever:bg-white/60',
            dividerText: 'text-muted-foreground',
            dividerLine: 'border-border',
            formFieldLabel: 'text-foreground',
          },
        }}
        forceRedirectUrl="/dashboard"
      />
      <p className="mt-2 text-lg text-muted-foreground">
        Already have an account?{' '}
        <Link href="/sign-in" className="underline font-bold">
          Sign in
        </Link>
      </p>
    </div>
  );
}
