import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email || !email.includes("@")) {
      return NextResponse.json(
        { error: "Please provide a valid email address" },
        { status: 400 }
      );
    }

    if (process.env.RESEND_API_KEY) {
      const { Resend } = await import("resend");
      const resend = new Resend(process.env.RESEND_API_KEY);

      await resend.emails.send({
        from: "KushSavvy <newsletter@kushsavvy.com>",
        to: email,
        subject: "Welcome to KushSavvy!",
        html: `
          <h2>Welcome to KushSavvy!</h2>
          <p>Thanks for subscribing. You'll get weekly strain recommendations and cannabis insights delivered to your inbox.</p>
          <p>In the meantime, check out our <a href="https://kushsavvy.com/tools/strain-recommender">Strain Recommender</a> to find your perfect strain.</p>
          <p>— The KushSavvy Team</p>
        `,
      });
    }

    return NextResponse.json({ success: true, message: "Successfully subscribed!" });
  } catch (error) {
    console.error("Newsletter signup error:", error);
    return NextResponse.json(
      { error: "Failed to subscribe. Please try again." },
      { status: 500 }
    );
  }
}
