export interface NavItem {
  id: string;
  label: string;
  icon?: string;
  children?: NavItem[];
}

export const reportNavigation: NavItem[] = [
  { id: "overview", label: "Overview", icon: "📊" },
  { id: "website-summary", label: "Website Summary", icon: "🌐" },
  { id: "first-impression", label: "First Impression", icon: "👁️" },
  {
    id: "positioning",
    label: "Positioning Analysis",
    icon: "🎯",
    children: [
      { id: "positioning-overview", label: "Market Positioning & Differentiation" },
      { id: "category-ownership", label: "Category Ownership" },
      { id: "unique-value-prop", label: "Unique Value Proposition" },
      { id: "competitive-diff", label: "Competitive Differentiation" },
      { id: "target-audience", label: "Target Audience Clarity" },
      { id: "problem-solution", label: "Problem-Solution Fit" },
      { id: "messaging-consistency", label: "Messaging Consistency" },
    ],
  },
  {
    id: "clarity",
    label: "Clarity Analysis",
    icon: "✨",
    children: [
      { id: "clarity-overview", label: "Messaging Clarity" },
      { id: "headline-clarity", label: "Headline Clarity" },
      { id: "value-proposition", label: "Value Proposition" },
      { id: "feature-benefit", label: "Feature-Benefit Mapping" },
      { id: "visual-hierarchy", label: "Visual Hierarchy" },
      { id: "cta-clarity", label: "CTA Clarity" },
      { id: "proof-placement", label: "Proof Placement" },
    ],
  },
  { id: "aeo", label: "AEO Presence", icon: "🤖" },
];

export function getAllSectionIds(nav: NavItem[]): string[] {
  return nav.flatMap((n) => [n.id, ...(n.children?.map((c) => c.id) || [])]);
}
