import { Metadata } from "next";
import { notFound } from "next/navigation";
import StrainRecommender from "@/components/tools/StrainRecommender";
import EdibleDosageCalculator from "@/components/tools/EdibleDosageCalculator";
import StrainCompare from "@/components/tools/StrainCompare";

interface PageProps {
  params: Promise<{ toolSlug: string }>;
}

const EMBEDDABLE_TOOLS: Record<
  string,
  { title: string; component: React.ComponentType }
> = {
  "strain-recommender": { title: "Strain Recommender", component: StrainRecommender },
  "edible-dosage-calculator": { title: "Edible Dosage Calculator", component: EdibleDosageCalculator },
  "strain-compare": { title: "Strain Comparison", component: StrainCompare },
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { toolSlug } = await params;
  const tool = EMBEDDABLE_TOOLS[toolSlug];
  if (!tool) return { title: "Not Found" };

  return {
    title: `${tool.title} — KushSavvy`,
    description: `Embedded ${tool.title} widget by KushSavvy`,
    robots: { index: false, follow: false },
  };
}

export default async function EmbedPage({ params }: PageProps) {
  const { toolSlug } = await params;
  const tool = EMBEDDABLE_TOOLS[toolSlug];

  if (!tool) {
    notFound();
  }

  const ToolComponent = tool.component;

  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-body antialiased bg-background text-text-primary p-4">
        <div className="max-w-2xl mx-auto">
          <ToolComponent />
          <div className="mt-6 pt-4 border-t border-border text-center">
            <a
              href="https://kushsavvy.com"
              target="_blank"
              rel="noopener"
              className="text-xs text-text-tertiary hover:text-accent-green transition-colors"
            >
              Powered by KushSavvy
            </a>
          </div>
        </div>
        <EmbedResizer />
      </body>
    </html>
  );
}

function EmbedResizer() {
  return (
    <script
      dangerouslySetInnerHTML={{
        __html: `
          (function() {
            function sendHeight() {
              var height = document.documentElement.scrollHeight;
              window.parent.postMessage({ type: 'kushsavvy-resize', height: height }, '*');
            }
            sendHeight();
            new MutationObserver(sendHeight).observe(document.body, { childList: true, subtree: true, attributes: true });
            window.addEventListener('resize', sendHeight);
          })();
        `,
      }}
    />
  );
}
