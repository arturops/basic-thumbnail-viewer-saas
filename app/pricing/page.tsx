import { Button } from '@/components/ui/button';

const isSubscribed = true;

export default async function Pricing() {
  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
        Subscribe Plan
      </h1>
      <div className="bg-card space-y-4 rounded-lg border-2 text-card-foreground shadow-[#929394] shadow-sm p-6">
        <h2 className="border-b-1 pb-2 text-3xl font-semibold tracking-tight">
          Full Access
        </h2>
        <p className="leading-7">Access to all features</p>
        <p className="text-2xl font-bold">$9.99/month</p>
        {isSubscribed ? (
          <form>
            <Button type="submit">Manage Subscription</Button>
          </form>
        ) : (
          <form>
            <Button type="submit">Subscribe</Button>
          </form>
        )}
      </div>
    </div>
  );
}
