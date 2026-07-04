import Link from "next/link";
import { Heart, CheckCircle } from "lucide-react";

export default function ThankYouPage() {
  return (
    <div className="min-h-screen bg-zinc-50">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-3">
          <Link href="/" className="flex items-center gap-2 text-xl font-bold text-[#f4256f]">
            <Heart className="h-6 w-6 fill-current" />
            MyLinks
          </Link>
        </div>
      </header>

      <main className="mx-auto flex max-w-3xl flex-col items-center justify-center px-4 py-16 text-center sm:py-24">
        <div className="rounded-full bg-green-100 p-4">
          <CheckCircle className="h-12 w-12 text-green-600 sm:h-16 sm:w-16" />
        </div>
        <h1 className="mt-6 text-2xl font-bold text-zinc-900 sm:text-4xl">Thank you!</h1>
        <p className="mt-3 max-w-md text-sm text-zinc-600 sm:text-base">
          Your payment has been submitted. We will verify it shortly.
        </p>
        <Link
          href="/solequeenfeet"
          className="mt-8 rounded-xl bg-[#f4256f] px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-[#d91d5c] sm:text-base"
        >
          Back to profile
        </Link>
      </main>
    </div>
  );
}
