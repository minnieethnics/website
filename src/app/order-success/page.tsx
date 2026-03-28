import Link from 'next/link';

export default function OrderSuccessPage({
  searchParams,
}: {
  searchParams: { id?: string };
}) {
  return (
    <main className="relative z-[5] min-h-screen bg-ivory flex items-center justify-center px-6">
      <div className="text-center max-w-lg space-y-6">
        <div className="text-gold text-5xl">✦</div>

        <h1 className="font-display text-5xl font-light text-charcoal leading-tight">
          Thank you for your{' '}
          <em className="italic text-gold">order.</em>
        </h1>

        <p className="text-sm text-muted leading-relaxed">
          Your little one is about to look absolutely beautiful. We&apos;ll
          confirm your order shortly and get it packed with love.
        </p>

        {searchParams.id && (
          <p className="label-xs text-faint">
            Order ID: {searchParams.id}
          </p>
        )}

        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
          <Link href="/shop" className="btn-charcoal">
            Continue Shopping
          </Link>
          <Link href="/" className="btn-ghost">
            Back to Home
          </Link>
        </div>

        <p className="text-xs text-faint">
          Questions? WhatsApp us at{' '}
          <a href="https://wa.me/91XXXXXXXXXX" className="text-gold hover:underline">
            +91 XXXXXXXXXX
          </a>
        </p>
      </div>
    </main>
  );
}
