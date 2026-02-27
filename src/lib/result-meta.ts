/** Generate OG meta for stored results, per tool type */

export function generateRecommenderMeta(input: Record<string, unknown>, output: unknown) {
  const recs = output as { recommendations?: { name: string }[] };
  const topStrain = recs?.recommendations?.[0]?.name || "Top Pick";
  const effect = Array.isArray(input.effects) ? input.effects[0] : "your preferences";

  return {
    title: `${topStrain} — Strain Recommendation | KushSavvy`,
    description: `Personalized cannabis strain recommendation based on ${effect}. Top pick: ${topStrain}.`,
    shareText: `Just got my personalized strain recommendation from KushSavvy — my top match is ${topStrain}!`,
  };
}

export function generateComparisonMeta(input: Record<string, unknown>) {
  const s1 = (input.strain1 as string) || "Strain 1";
  const s2 = (input.strain2 as string) || "Strain 2";

  return {
    title: `${s1} vs ${s2} — Strain Comparison | KushSavvy`,
    description: `Detailed comparison of ${s1} and ${s2} including THC content, terpene profiles, effects, and best use cases.`,
    shareText: `${s1} vs ${s2} — which one wins? Check out this comparison on KushSavvy.`,
  };
}

export function generateCbdVsThcMeta(input: Record<string, unknown>, output: unknown) {
  const result = output as { recommendation?: string };
  const rec = result?.recommendation || "CBD or THC";
  const goal = (input.goal as string) || "your needs";

  return {
    title: `${rec} Recommendation for ${goal} | KushSavvy`,
    description: `Personalized CBD vs THC recommendation for ${goal}. Result: ${rec}.`,
    shareText: `Found out whether CBD or THC is better for ${goal} on KushSavvy — result: ${rec}!`,
  };
}

export function generateTolerancePlanMeta(input: Record<string, unknown>, output: unknown) {
  const plan = output as { plan_title?: string };
  const title = plan?.plan_title || "Tolerance Break Plan";

  return {
    title: `${title} | KushSavvy`,
    description: `Personalized cannabis tolerance break plan with day-by-day guidance, supplements, and expected results.`,
    shareText: `Just got my custom tolerance break plan from KushSavvy — ${title}!`,
  };
}

export function generateGrowTimelineMeta(input: Record<string, unknown>, output: unknown) {
  const plan = output as { title?: string; total_weeks?: string };
  const title = plan?.title || "Cannabis Grow Timeline";
  const weeks = plan?.total_weeks || "";

  return {
    title: `${title} | KushSavvy`,
    description: `Complete cannabis grow timeline${weeks ? ` (${weeks})` : ""} with phase-by-phase tasks, supplies, and pro tips.`,
    shareText: `Planning my cannabis grow with KushSavvy — ${title}!`,
  };
}

export function generateTerpeneGuideMeta(input: Record<string, unknown>, output: unknown) {
  const result = output as { name?: string };
  const name = result?.name || (input.terpene as string) || "Terpene";

  return {
    title: `${name} — Cannabis Terpene Guide | KushSavvy`,
    description: `Everything you need to know about ${name}: aroma, effects, medical benefits, and strains high in this terpene.`,
    shareText: `Learning about ${name} on KushSavvy — fascinating terpene!`,
  };
}
