"use client";

import { useState, useEffect, useRef } from "react";

interface LoadingMeterProps {
  title: string;
  messages: string[];
  icon?: string;
}

export default function LoadingMeter({
  title,
  messages,
  icon = "\u{1F33F}",
}: LoadingMeterProps) {
  const [progress, setProgress] = useState(0);
  const [msgIndex, setMsgIndex] = useState(0);
  const startTime = useRef(Date.now());

  useEffect(() => {
    const progressTimer = setInterval(() => {
      const elapsed = (Date.now() - startTime.current) / 1000;
      // Fast at first, slows down asymptotically toward 92%
      const next = Math.min(92, 30 * Math.log10(elapsed + 1) + elapsed * 2);
      setProgress(next);
    }, 80);

    const msgTimer = setInterval(() => {
      setMsgIndex((i) => (i + 1) % messages.length);
    }, 2200);

    return () => {
      clearInterval(progressTimer);
      clearInterval(msgTimer);
    };
  }, [messages.length]);

  return (
    <div className="tool-container text-center py-12 max-w-lg mx-auto">
      <div className="text-4xl mb-6" aria-hidden="true">
        <span className="inline-block animate-bounce">{icon}</span>
      </div>
      <h2 className="font-heading text-2xl md:text-3xl mb-2">{title}</h2>
      <p
        className="text-text-secondary text-sm mb-8 h-5 transition-opacity duration-300"
        key={msgIndex}
      >
        {messages[msgIndex]}
      </p>
      <div className="w-full h-3 rounded-full bg-surface border border-border overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-300 ease-out"
          style={{
            width: `${progress}%`,
            background: "linear-gradient(90deg, #2D6A4F, #7B2D8E)",
          }}
        />
      </div>
      <p className="text-text-tertiary text-xs mt-3 font-mono">
        {Math.round(progress)}%
      </p>
    </div>
  );
}
