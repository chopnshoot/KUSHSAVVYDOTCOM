"use client";

import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <>
      <Header />
      <main className="max-w-2xl mx-auto px-4 py-20 md:py-32 text-center">
        <p className="text-5xl mb-6">Oops</p>
        <h1 className="font-heading text-3xl md:text-4xl mb-4">
          Something Went Wrong
        </h1>
        <p className="text-text-secondary mb-8 leading-relaxed">
          An unexpected error occurred. Try again or head back home.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button onClick={() => reset()} className="btn-primary">
            Try Again
          </button>
          <Link href="/" className="btn-secondary">
            Go Home
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
