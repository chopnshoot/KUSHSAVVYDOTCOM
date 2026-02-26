import { NextRequest, NextResponse } from "next/server";

async function sha256(message: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(message);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email || !email.includes("@")) {
      return NextResponse.json(
        { error: "Please provide a valid email address" },
        { status: 400 }
      );
    }

    // Subscribe to newsletter via Resend (same as regular newsletter signup)
    if (process.env.RESEND_API_KEY) {
      try {
        const { Resend } = await import("resend");
        const resend = new Resend(process.env.RESEND_API_KEY);

        await resend.emails.send({
          from: "KushSavvy <newsletter@kushsavvy.com>",
          to: email,
          subject: "Welcome to KushSavvy — Your access has been upgraded!",
          html: `
            <h2>Your KushSavvy access has been upgraded!</h2>
            <p>Thanks for subscribing. You now have 3x more AI-powered searches per day.</p>
            <p>Plus, you'll get weekly strain recommendations and cannabis insights delivered to your inbox.</p>
            <p>Check out our tools:</p>
            <ul>
              <li><a href="https://kushsavvy.com/tools/strain-recommender">Strain Recommender</a></li>
              <li><a href="https://kushsavvy.com/tools/strain-compare">Strain Comparison</a></li>
              <li><a href="https://kushsavvy.com/tools/edible-dosage-calculator">Edible Dosage Calculator</a></li>
            </ul>
            <p>— The KushSavvy Team</p>
          `,
        });
      } catch (emailError) {
        console.error("Failed to send welcome email:", emailError);
        // Don't block the upgrade if email sending fails
      }
    }

    // Generate subscriber hash for the cookie
    const emailHash = await sha256(email.toLowerCase().trim());

    // Set the subscriber cookie
    const response = NextResponse.json({
      success: true,
      message: "Subscribed! Your daily limit has been upgraded to 30 searches.",
    });

    response.cookies.set("ks_subscriber", emailHash, {
      httpOnly: false, // Needs to be readable by API routes via request headers
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 31536000, // 1 year
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Subscribe upgrade error:", error);
    return NextResponse.json(
      { error: "Failed to subscribe. Please try again." },
      { status: 500 }
    );
  }
}
