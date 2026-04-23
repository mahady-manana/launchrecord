export const METRIC_LABELS: Record<string, string> = {
  headline: "Main Headline",
  subheadline: "Subheadline",
  cta: "Call to Action (Hero)",
  category_ownership: "Category Identification",
  unique_value_proposition: "Unique Value Prop",
  competitive_differentiation: "Competitive Edge",
  target_audience: "Ideal Customer Profile",
  problem_solution_fit: "Problem-Solution Fit",
  messaging_consistency: "Messaging Alignment",
  headline_clarity: "Headline Clarity",
  value_proposition: "Value Proposition",
  feature_benefit_mapping: "Benefits vs Features",
  visual_hierarchy: "Visual Hierarchy",
  cta_clarity: "Call to Action Clarity",
  proof_placement: "Social Proof Placement",
  unclear_sentences: "Readability & Flow",
  one_line_definition: "One-Line Definition",
  audience_specificity: "Audience Specificity",
  problem_solution_mapping: "Problem-Solution Mapping",
  outcome_translation: "Outcome Translation",
  use_case_intent: "Use-Case Alignment",
  category_anchoring: "Category Anchoring",
  intent_driven_qa: "Intent-Driven Q&A",
  terminology_consistency: "Terminology Consistency",
  quantifiable_signals: "Quantifiable Data",
  parsing_structure: "Semantic Structure",
};

export const getMetricLabel = (key: string): string => {
  return METRIC_LABELS[key] || key.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
};
