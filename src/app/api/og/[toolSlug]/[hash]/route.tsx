import { ImageResponse } from "next/og";
import { getResult } from "@/lib/results";

export const runtime = "edge";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ toolSlug: string; hash: string }> }
) {
  const { toolSlug, hash } = await params;
  const result = await getResult(toolSlug, hash);

  if (!result) {
    return new ImageResponse(
      (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
            height: "100%",
            background: "linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 100%)",
            color: "#ffffff",
            fontFamily: "sans-serif",
          }}
        >
          <div style={{ fontSize: 48, fontWeight: 700 }}>KushSavvy</div>
          <div style={{ fontSize: 24, color: "#4ade80", marginTop: 16 }}>
            AI-Powered Cannabis Tools
          </div>
        </div>
      ),
      { width: 1200, height: 630 }
    );
  }

  const parsed = JSON.parse(result.output);

  if (toolSlug === "strain-recommender") {
    const topStrain = parsed?.recommendations?.[0]?.name || "Top Pick";
    return new ImageResponse(
      (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            width: "100%",
            height: "100%",
            background: "linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 100%)",
            color: "#ffffff",
            fontFamily: "sans-serif",
            padding: 60,
          }}
        >
          <div style={{ fontSize: 24, color: "#4ade80", fontWeight: 600 }}>
            KushSavvy Strain Recommender
          </div>
          <div style={{ fontSize: 56, fontWeight: 700, marginTop: 24 }}>
            {topStrain}
          </div>
          <div style={{ fontSize: 24, color: "#a1a1aa", marginTop: 16 }}>
            Personalized recommendation based on your preferences
          </div>
          <div
            style={{
              display: "flex",
              marginTop: "auto",
              fontSize: 20,
              color: "#71717a",
            }}
          >
            kushsavvy.com
          </div>
        </div>
      ),
      { width: 1200, height: 630 }
    );
  }

  if (toolSlug === "strain-compare") {
    const s1 = (result.input?.strain1 as string) || "Strain 1";
    const s2 = (result.input?.strain2 as string) || "Strain 2";
    return new ImageResponse(
      (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            width: "100%",
            height: "100%",
            background: "linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 100%)",
            color: "#ffffff",
            fontFamily: "sans-serif",
            padding: 60,
          }}
        >
          <div style={{ fontSize: 24, color: "#4ade80", fontWeight: 600 }}>
            KushSavvy Strain Comparison
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 24,
              marginTop: 32,
            }}
          >
            <div style={{ fontSize: 48, fontWeight: 700 }}>{s1}</div>
            <div style={{ fontSize: 36, color: "#4ade80" }}>vs</div>
            <div style={{ fontSize: 48, fontWeight: 700 }}>{s2}</div>
          </div>
          <div
            style={{
              display: "flex",
              marginTop: "auto",
              fontSize: 20,
              color: "#71717a",
            }}
          >
            kushsavvy.com
          </div>
        </div>
      ),
      { width: 1200, height: 630 }
    );
  }

  // Generic OG image for other tools
  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          height: "100%",
          background: "linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 100%)",
          color: "#ffffff",
          fontFamily: "sans-serif",
          padding: 60,
        }}
      >
        <div style={{ fontSize: 24, color: "#4ade80", fontWeight: 600 }}>
          KushSavvy
        </div>
        <div style={{ fontSize: 44, fontWeight: 700, marginTop: 24, maxWidth: "80%" }}>
          {result.meta.title.replace(" | KushSavvy", "")}
        </div>
        <div style={{ fontSize: 22, color: "#a1a1aa", marginTop: 16, maxWidth: "80%" }}>
          {result.meta.description.slice(0, 120)}
        </div>
        <div
          style={{
            display: "flex",
            marginTop: "auto",
            fontSize: 20,
            color: "#71717a",
          }}
        >
          kushsavvy.com
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
