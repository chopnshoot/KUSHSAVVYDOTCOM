/** Internal linking: tool relationships */
export const TOOL_RELATIONSHIPS: Record<string, string[]> = {
  "strain-recommender": ["strain-compare", "terpene-guide", "edible-dosage-calculator"],
  "edible-dosage-calculator": ["strain-recommender", "cost-calculator", "cbd-vs-thc"],
  "strain-compare": ["strain-recommender", "terpene-guide", "cbd-vs-thc"],
  "is-it-legal": ["cost-calculator", "strain-recommender", "edible-dosage-calculator"],
  "terpene-guide": ["strain-recommender", "strain-compare", "cbd-vs-thc"],
  "tolerance-break-planner": ["edible-dosage-calculator", "cost-calculator", "strain-recommender"],
  "cost-calculator": ["tolerance-break-planner", "edible-dosage-calculator", "grow-timeline"],
  "grow-timeline": ["cost-calculator", "terpene-guide", "strain-recommender"],
  "cbd-vs-thc": ["edible-dosage-calculator", "terpene-guide", "strain-recommender"],
};

/** GEO: Definitive first-paragraph answers per tool */
export const TOOL_DEFINITIVE_ANSWERS: Record<string, { question: string; answer: string }> = {
  "strain-recommender": {
    question: "What cannabis strain should I try?",
    answer: "The best cannabis strain for you depends on your desired effects, experience level, and consumption method. Indica strains are best for relaxation and sleep, sativa strains for energy and creativity, and hybrids offer a balance of both.",
  },
  "strain-compare": {
    question: "How do I compare two cannabis strains?",
    answer: "Comparing cannabis strains means looking at THC and CBD levels, terpene profiles, effects, and flavor side by side. The best strain for you depends on whether you prioritize potency, specific effects like relaxation or focus, or flavor preferences.",
  },
  "edible-dosage-calculator": {
    question: "How many milligrams of edibles should I take?",
    answer: "The recommended edible dose for beginners is 2.5 to 5mg of THC. Experienced users typically take 10 to 25mg. Always start low and wait at least 2 hours before taking more, as edibles take 30 to 90 minutes to take effect.",
  },
  "tolerance-break-planner": {
    question: "How long should a tolerance break be?",
    answer: "A cannabis tolerance break should last at least 2 days for a partial reset and 21 to 30 days for a full reset. Daily users with high tolerance should aim for 3 to 4 weeks. CB1 receptors begin recovering within 48 hours of abstinence.",
  },
  "cost-calculator": {
    question: "How much does the average person spend on cannabis?",
    answer: "The average regular cannabis user spends between $100 and $300 per month depending on consumption frequency, method, and local pricing. Daily users in legal states typically spend $150 to $250 per month.",
  },
  "is-it-legal": {
    question: "Where is cannabis legal in the United States?",
    answer: "As of 2026, recreational cannabis is legal in 24 states plus Washington D.C. Medical cannabis is legal in 38 states. Cannabis remains illegal at the federal level, classified as a Schedule I substance.",
  },
  "cbd-vs-thc": {
    question: "What is the difference between CBD and THC?",
    answer: "CBD (cannabidiol) is non-psychoactive and used for anxiety, pain, and inflammation without producing a high. THC (tetrahydrocannabinol) is psychoactive and produces euphoria, relaxation, and altered perception. Both are cannabinoids found in cannabis.",
  },
  "grow-timeline": {
    question: "How long does it take to grow cannabis?",
    answer: "Growing cannabis from seed to harvest takes 3 to 8 months depending on the strain and growing method. Autoflower strains finish in 8 to 12 weeks. Photoperiod indicas take 3 to 4 months and sativas can take 4 to 6 months.",
  },
  "terpene-guide": {
    question: "What are cannabis terpenes?",
    answer: "Terpenes are aromatic compounds in cannabis that influence smell, taste, and effects. The most common cannabis terpenes are myrcene (relaxing), limonene (uplifting), caryophyllene (pain relief), pinene (focus), and linalool (calming). Terpenes work with cannabinoids through the entourage effect.",
  },
};

/** SEO: HowTo schema steps per tool */
export const TOOL_HOWTO_SCHEMAS: Record<string, { name: string; description: string; steps: { name: string; text: string }[] }> = {
  "strain-recommender": {
    name: "How to Find Your Perfect Cannabis Strain",
    description: "Use our AI-powered quiz to get personalized strain recommendations based on your preferences.",
    steps: [
      { name: "Select desired effects", text: "Choose from Relaxation, Energy, Creativity, Pain Relief, Sleep, Social, or Focus." },
      { name: "Set your experience level", text: "Tell us if you're new to cannabis, occasional, regular, or experienced." },
      { name: "Choose consumption method", text: "Select how you plan to consume: smoke, vape, edible, tincture, or topical." },
      { name: "Get your recommendations", text: "Receive 3 personalized strain recommendations with detailed profiles." },
    ],
  },
  "edible-dosage-calculator": {
    name: "How to Calculate Your Edible Dosage",
    description: "Use our calculator to find the right edible dose based on your experience and body weight.",
    steps: [
      { name: "Select experience level", text: "Choose your cannabis experience level from beginner to high tolerance." },
      { name: "Enter your weight range", text: "Select your approximate weight range for dose calibration." },
      { name: "Choose desired intensity", text: "Pick how strong you want the experience to be." },
      { name: "Get your dosage", text: "Receive a recommended dose in milligrams with onset time and duration." },
    ],
  },
  "tolerance-break-planner": {
    name: "How to Plan a Cannabis Tolerance Break",
    description: "Get a personalized day-by-day tolerance break plan based on your usage patterns.",
    steps: [
      { name: "Enter current usage", text: "Tell us how much and how often you currently use cannabis." },
      { name: "Choose break duration", text: "Select a break length from 3 days to 30 days." },
      { name: "Set your goal", text: "Pick your main goal: lower tolerance, save money, or feel clearer." },
      { name: "Get your plan", text: "Receive a phased plan with daily guidance, supplements, and expected results." },
    ],
  },
  "grow-timeline": {
    name: "How to Plan Your Cannabis Grow",
    description: "Get a customized seed-to-harvest timeline based on your strain and growing setup.",
    steps: [
      { name: "Select strain type", text: "Choose indica, sativa, hybrid, or autoflower." },
      { name: "Choose grow method", text: "Pick soil, coco coir, hydroponics, or living soil." },
      { name: "Set your environment", text: "Select indoor tent, indoor room, outdoor, or greenhouse." },
      { name: "Get your timeline", text: "Receive a phase-by-phase grow plan with tasks, supplies, and pro tips." },
    ],
  },
  "cost-calculator": {
    name: "How to Calculate Your Cannabis Spending",
    description: "Calculate your daily, weekly, monthly, and yearly cannabis costs.",
    steps: [
      { name: "Enter amount per session", text: "Enter how many grams you use per session." },
      { name: "Enter price per gram", text: "Input the average price you pay per gram." },
      { name: "Set your frequency", text: "Tell us how many sessions per day you typically have." },
      { name: "Get your costs", text: "See a complete breakdown of your cannabis spending with money-saving tips." },
    ],
  },
};

/** SEO: Additional FAQs per tool (to supplement existing ones) */
export const TOOL_EXTRA_FAQS: Record<string, { question: string; answer: string }[]> = {
  "strain-recommender": [
    { question: "How do terpenes affect my experience?", answer: "Terpenes are aromatic compounds that work alongside cannabinoids through the entourage effect. Myrcene promotes relaxation, limonene uplifts mood, caryophyllene helps with pain, and pinene enhances focus. Different terpene profiles create different strain experiences." },
    { question: "Should I start with high or low THC?", answer: "Beginners should start with strains containing 10-15% THC. Higher THC (20%+) strains can cause anxiety or paranoia in new users. Start low, go slow, and gradually explore higher potency strains as you understand your tolerance." },
  ],
  "strain-compare": [
    { question: "Does THC percentage determine how strong a strain is?", answer: "THC percentage is one factor, but terpene profile, cannabinoid ratios, and individual biology also determine the experience. A 20% THC strain with the right terpene profile can feel stronger than a 25% THC strain without them." },
    { question: "Are strain names consistent across dispensaries?", answer: "Strain names can vary between growers and dispensaries. The same name might have different genetic backgrounds depending on the cultivator. Always check the lab-tested terpene and cannabinoid profile rather than relying solely on the name." },
  ],
  "is-it-legal": [
    { question: "Can I travel with cannabis across state lines?", answer: "No. Transporting cannabis across state lines is a federal offense, even between two legal states. Cannabis remains a Schedule I substance under federal law. Always purchase cannabis in the state where you plan to consume it." },
    { question: "What is the difference between decriminalized and legal?", answer: "Decriminalized means possession of small amounts won't result in jail time but may still carry a fine. Legal means cannabis is regulated and can be purchased from licensed dispensaries. Decriminalization does not create a legal market for sales." },
  ],
};
