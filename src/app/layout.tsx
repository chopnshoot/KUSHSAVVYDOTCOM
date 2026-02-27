import type { Metadata } from "next";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import CookieConsent from "@/components/CookieConsent";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "KushSavvy — AI-Powered Cannabis Tools & Strain Guide",
    template: "%s | KushSavvy",
  },
  description:
    "Find your perfect strain with AI-powered tools. Strain recommendations, dosage calculators, legality checker, and comprehensive cannabis education.",
  keywords: [
    "cannabis strains",
    "strain recommender",
    "edible dosage calculator",
    "cannabis legal states",
    "weed strains",
    "marijuana guide",
    "terpenes",
  ],
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://kushsavvy.com"
  ),
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "48x48" },
      { url: "/icon-32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
  },
  manifest: "/site.webmanifest",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: "KushSavvy",
    title: "KushSavvy — AI-Powered Cannabis Tools & Strain Guide",
    description:
      "Find your perfect strain with AI-powered tools. Strain recommendations, dosage calculators, legality checker, and comprehensive cannabis education.",
    images: [
      {
        url: "/og-default.png",
        width: 1200,
        height: 630,
        alt: "KushSavvy — AI-Powered Cannabis Tools",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "KushSavvy — AI-Powered Cannabis Tools & Strain Guide",
    description:
      "Find your perfect strain with AI-powered tools.",
    images: ["/og-default.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,100..900;1,9..144,100..900&family=JetBrains+Mono:wght@400;500;600;700&family=Outfit:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-body antialiased bg-background text-text-primary">
        <GoogleAnalytics />
        {children}
        <CookieConsent />
        {/* Sitewide Organization + WebSite schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify([
              {
                "@context": "https://schema.org",
                "@type": "Organization",
                name: "KushSavvy",
                url: "https://kushsavvy.com",
                logo: "https://kushsavvy.com/logo.png",
                description: "AI-powered cannabis tools and educational guides.",
                sameAs: [
                  "https://twitter.com/kushsavvy",
                  "https://instagram.com/kushsavvy",
                ],
              },
              {
                "@context": "https://schema.org",
                "@type": "WebSite",
                name: "KushSavvy",
                url: "https://kushsavvy.com",
              },
            ]),
          }}
        />
      </body>
    </html>
  );
}
