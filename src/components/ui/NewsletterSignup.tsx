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
        <p className="font-heading text-lg font-semibold text-accent-green">
          You&apos;re in!
        </p>
        <p className="mt-1 font-body text-sm text-text-secondary">
          Check your inbox for a confirmation email.
        </p>
      </div>
    );
  }

  return (
    <div className="text-center">
      <h3 className="font-heading text-xl font-semibold text-text-primary sm:text-2xl">
        Get weekly strain recommendations and cannabis insights
      </h3>
      <p className="mt-2 font-body text-sm text-text-secondary">
        Join thousands of informed consumers. No spam, unsubscribe anytime.
      </p>

      <form
        onSubmit={handleSubmit}
        className="mx-auto mt-6 flex max-w-md flex-col gap-3 sm:flex-row"
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
          className="flex-1 rounded-lg border border-border bg-surface px-4 py-2.5 font-body text-sm text-text-primary placeholder:text-text-tertiary focus:border-accent-green focus:outline-none focus:ring-1 focus:ring-accent-green disabled:opacity-60"
        />
        <button
          type="submit"
          disabled={status === "loading"}
          className="inline-flex items-center justify-center whitespace-nowrap rounded-lg bg-warm px-6 py-2.5 font-body text-sm font-semibold text-white transition-colors hover:bg-warm/90 focus:outline-none focus:ring-2 focus:ring-warm focus:ring-offset-2 disabled:opacity-60"
        >
          {status === "loading" ? "Subscribing..." : "Subscribe"}
        </button>
      </form>

      {status === "error" && (
        <p className="mt-3 font-body text-sm text-red-600" role="alert">
          {errorMessage}
        </p>
      )}
    </div>
  );
}
