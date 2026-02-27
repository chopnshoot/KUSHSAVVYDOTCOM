"use client";

import Script from "next/script";
import { useEffect, useState } from "react";

export default function GoogleAnalytics() {
  const gaId = process.env.NEXT_PUBLIC_GA_ID;
  const [consent, setConsent] = useState<string | null>(null);

  useEffect(() => {
    setConsent(localStorage.getItem("cookie-consent"));

    // Re-check when CookieConsent writes to localStorage
    const check = () => setConsent(localStorage.getItem("cookie-consent"));
    window.addEventListener("storage", check);
    // Also poll once after a short delay for same-tab changes
    const timer = setTimeout(check, 1000);
    return () => {
      window.removeEventListener("storage", check);
      clearTimeout(timer);
    };
  }, []);

  // Only load GA after explicit consent
  if (!gaId || consent !== "accepted") return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${gaId}', { anonymize_ip: true });
        `}
      </Script>
    </>
  );
}
