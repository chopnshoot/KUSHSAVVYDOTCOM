import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export default function NotFound() {
  return (
    <>
      <Header />
      <main className="max-w-2xl mx-auto px-4 py-20 md:py-32 text-center">
        <p className="text-6xl mb-6">404</p>
        <h1 className="font-heading text-3xl md:text-4xl mb-4">
          Page Not Found
        </h1>
        <p className="text-text-secondary mb-8 leading-relaxed">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/" className="btn-primary">
            Go Home
          </Link>
          <Link href="/tools" className="btn-secondary">
            Browse Tools
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
