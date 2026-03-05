export interface SurveyAnswers {
  founderName: string;
  saasName: string;
  saasUrl: string;
  role: string;
  teamSize: string;
  revenue: string;
  biggestChallenge: string;
  aeoAwareness: string;
  description: string;
  willingToInvest: string;
}

export interface Question {
  title: string;
  key: keyof SurveyAnswers;
  type: "text" | "url" | "textarea" | "radio";
  description: string;
  placeholder?: string;
  options?: { value: string; label: string }[];
}

export const questions: Question[] = [
  {
    title: "Who are you ?",
    key: "founderName",
    type: "text",
    description: "Your name for the War Briefing",
    placeholder: "e.g., John Smith",
  },
  {
    title: "Startup / SaaS Name",
    key: "saasName",
    type: "text",
    description: "The product we'll analyze for insights",
    placeholder: "e.g., Acme Analytics",
  },
  {
    title: "Product Description",
    key: "description",
    type: "textarea",
    description: "What does your product do?",
    placeholder: "Describe your product...",
  },
  {
    title: "Your Role",
    key: "role",
    type: "radio",
    description: "Where do you sit in the company?",
    options: [
      { value: "solo-founder", label: "👤 Solo Founder" },
      { value: "co-founder-ceo", label: "👔 CEO" },
      { value: "co-founder-cto", label: "⚙️ CTO" },
      { value: "co-founder-product", label: "📦 Product" },
      { value: "founder-other", label: "🎯 Other" },
    ],
  },
  {
    title: "Team Size",
    key: "teamSize",
    type: "radio",
    description: "Full-time employees (including founders)",
    options: [
      { value: "just-me", label: "👤 Just me" },
      { value: "2-5", label: "👥 2-5 people" },
      { value: "6-15", label: "🏢 6-15 people" },
      { value: "16-50", label: "🏭 16-50 people" },
      { value: "50+", label: "🏢 50+ people" },
    ],
  },
  {
    title: "Monthly Revenue (MRR)",
    key: "revenue",
    type: "radio",
    description: "Be honest — this stays private",
    options: [
      { value: "pre-revenue", label: "💸 Pre-revenue" },
      { value: "0-5k", label: "📈 $0-$5K" },
      { value: "5k-20k", label: "📈 $5K-$20K" },
      { value: "20k-50k", label: "📈 $20K-$50K" },
      { value: "50k+", label: "📈 $50K+" },
    ],
  },
  {
    title: "Biggest Challenge",
    key: "biggestChallenge",
    type: "radio",
    description: "What keeps you up at night?",
    options: [
      { value: "visibility", label: "🔍 Hard to get noticed" },
      { value: "positioning", label: "⚠️ Positioning / messaging" },
      { value: "competition", label: "🎯 Competitors copying" },
      { value: "ai-risk", label: "😰 AI could replace me" },
    ],
  },
  {
    title: "AEO Awareness",
    key: "aeoAwareness",
    type: "radio",
    description: "Have you heard of Answer Engine Optimization?",
    options: [
      { value: "never-heard", label: "❌ Never heard of it" },
      {
        value: "heard-but-not-tracking",
        label: "🤔 Heard of it, not tracking",
      },
      { value: "tracking-manually", label: "📊 Tracking manually" },
      { value: "using-tools", label: "🛠️ Using tools" },
    ],
  },
  {
    title: "Investment Willingness",
    key: "willingToInvest",
    type: "radio",
    description: "What would you invest to become irreplaceable?",
    options: [
      { value: "49-tier", label: "💰 $49/mo (AEO Tracker + War Briefing)" },
      { value: "99-tier", label: "💰💰 $99/mo (+ Founder Proof Vault)" },
      { value: "299-tier", label: "💰💰💰 $299/mo (+ Strategy Calls)" },
      { value: "need-more-info", label: "🤔 Need to see more" },
    ],
  },
];
