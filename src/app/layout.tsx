import type { Metadata } from "next";
import GoogleAnalytics from "@/components/GoogleAnalytics";
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
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: "KushSavvy",
    title: "KushSavvy — AI-Powered Cannabis Tools & Strain Guide",
    description:
      "Find your perfect strain with AI-powered tools. Strain recommendations, dosage calculators, legality checker, and comprehensive cannabis education.",
  },
  twitter: {
    card: "summary_large_image",
    title: "KushSavvy — AI-Powered Cannabis Tools & Strain Guide",
    description:
      "Find your perfect strain with AI-powered tools.",
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
        <link
          href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,100..900;1,9..144,100..900&family=JetBrains+Mono:wght@400;500;600;700&family=Outfit:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-body antialiased bg-background text-text-primary">
        <GoogleAnalytics />
        {children}
      </body>
    </html>
  );
}
