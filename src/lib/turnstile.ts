/**
 * Server-side Cloudflare Turnstile token verification.
 * Returns true if verification succeeds or if Turnstile is not configured.
 */
export async function verifyTurnstile(token: string | undefined): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY;

  if (!secret) {
    return true; // Turnstile not configured — allow all requests
  }

  if (!token) {
    return false; // Token required when Turnstile is configured
  }

  try {
    const response = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          secret,
          response: token,
        }),
      }
    );

    const result = await response.json();
    return result.success === true;
  } catch {
    console.error("Turnstile verification failed");
    return false;
  }
}
