export interface SurveyAnswers {
  saasName: string;
  saasUrl: string;
  tagline: string;
  description: string;
  logo?: string;
  topics: string[];
  revenue: string;
}

export interface Question {
  title: string;
  key: keyof SurveyAnswers;
  type: "text" | "url" | "textarea" | "radio" | "image" | "multiselect";
  description: string;
  placeholder?: string;
  options?: { value: string; label: string }[];
}

export const questions: Question[] = [
  {
    title: "Product Name",
    key: "saasName",
    type: "text",
    description: "What's your product called?",
    placeholder: "e.g., Acme Analytics",
  },
  {
    title: "Tagline",
    key: "tagline",
    type: "text",
    description: "One-liner that describes your product (max 80.)",
    placeholder: "e.g., Analytics that actually make sense",
  },
  {
    title: "Product Description",
    key: "description",
    type: "textarea",
    description: "What does your product do? Who is it for?",
    placeholder: "Describe your product in detail...",
  },
  {
    title: "Logo Upload",
    key: "logo",
    type: "image",
    description: "Upload your product logo (optional)",
  },
  {
    title: "Topics / Categories",
    key: "topics",
    type: "multiselect",
    description:
      "Search and select up to 3 categories that describe your product",
  },
  {
    title: "Monthly Revenue (MRR)",
    key: "revenue",
    type: "radio",
    description: "Be honest — this stays private",
    options: [
      { value: "pre-revenue", label: "💸 Pre-revenue" },
      { value: "0-5k", label: "📈 $0-$5K" },
      { value: "5k-50k", label: "📈 $5K-$50K" },
      { value: "50k-500k", label: "📈 $50K-$500K" },
      { value: "500k+", label: "📈 $500K+" },
    ],
  },
];
