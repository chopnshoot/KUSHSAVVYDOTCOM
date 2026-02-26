"use client";

import { useState } from "react";

interface ShareBarProps {
  url: string;
  text: string;
}

export default function ShareBar({ url, text }: ShareBarProps) {
  const [copied, setCopied] = useState(false);
  const fullUrl = url.startsWith("http")
    ? url
    : `${process.env.NEXT_PUBLIC_SITE_URL || "https://kushsavvy.com"}${url}`;

  const copyLink = async () => {
    await navigator.clipboard.writeText(fullUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareTwitter = () => {
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(fullUrl)}`,
      "_blank"
    );
  };

  const shareReddit = () => {
    window.open(
      `https://reddit.com/submit?url=${encodeURIComponent(fullUrl)}&title=${encodeURIComponent(text)}`,
      "_blank"
    );
  };

  const shareNative = async () => {
    if (navigator.share) {
      await navigator.share({ title: text, url: fullUrl });
    } else {
      copyLink();
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-3 mt-6 pt-6 border-t border-border">
      <span className="text-sm text-text-tertiary">Share your results:</span>
      <button
        onClick={copyLink}
        className="text-xs px-3 py-1.5 rounded-full border border-border hover:border-accent-green hover:text-accent-green transition-colors"
      >
        {copied ? "Copied!" : "Copy Link"}
      </button>
      <button
        onClick={shareTwitter}
        className="text-xs px-3 py-1.5 rounded-full border border-border hover:border-accent-green hover:text-accent-green transition-colors"
      >
        X / Twitter
      </button>
      <button
        onClick={shareReddit}
        className="text-xs px-3 py-1.5 rounded-full border border-border hover:border-accent-green hover:text-accent-green transition-colors"
      >
        Reddit
      </button>
      <button
        onClick={shareNative}
        className="text-xs px-3 py-1.5 rounded-full border border-border hover:border-accent-green hover:text-accent-green transition-colors"
      >
        Share
      </button>
    </div>
  );
}
