"use client";

import { useState, type FormEvent } from "react";

type SubmitStatus = "idle" | "loading" | "success" | "error";

export default function NewsletterSignup() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<SubmitStatus>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!email.trim()) return;

    setStatus("loading");
    setErrorMessage("");

    try {
      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(
          data.message || "Something went wrong. Please try again."
        );
      }

      setStatus("success");
      setEmail("");
    } catch (err) {
      setStatus("error");
      setErrorMessage(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again."
      );
    }
  }

  if (status === "success") {
    return (
      <div className="text-center">
        <p className="font-heading text-lg font-semibold text-accent-green-light">
          You&apos;re in!
        </p>
        <p className="mt-1 font-body text-sm text-gray-400">
          Check your inbox for a confirmation email.
        </p>
      </div>
    );
  }

  return (
    <div className="text-center">
      <h3 className="font-heading text-xl font-semibold text-white sm:text-2xl">
        Get weekly strain recommendations and cannabis insights
      </h3>
      <p className="mt-2 font-body text-sm text-gray-400">
        Join thousands of informed consumers. No spam, unsubscribe anytime.
      </p>

      <form
        onSubmit={handleSubmit}
        className="mx-auto mt-8 flex max-w-md flex-col gap-3 sm:flex-row"
      >
        <label htmlFor="newsletter-email" className="sr-only">
          Email address
        </label>
        <input
          id="newsletter-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          required
          disabled={status === "loading"}
          className="flex-1 rounded-xl border border-white/10 bg-white/5 px-4 py-3 font-body text-sm text-white placeholder:text-gray-500 focus:border-accent-green focus:outline-none focus:ring-1 focus:ring-accent-green disabled:opacity-60 backdrop-blur-sm"
        />
        <button
          type="submit"
          disabled={status === "loading"}
          className="inline-flex items-center justify-center whitespace-nowrap rounded-xl bg-accent-green px-6 py-3 font-body text-sm font-semibold text-white transition-all hover:bg-accent-green-light hover:shadow-lg hover:shadow-accent-green/25 focus:outline-none focus:ring-2 focus:ring-accent-green focus:ring-offset-2 focus:ring-offset-[#0F1A14] disabled:opacity-60"
        >
          {status === "loading" ? "Subscribing..." : "Subscribe"}
        </button>
      </form>

      {status === "error" && (
        <p className="mt-3 font-body text-sm text-red-400" role="alert">
          {errorMessage}
        </p>
      )}
    </div>
  );
}
