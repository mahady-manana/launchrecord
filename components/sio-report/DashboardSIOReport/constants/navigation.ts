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
      {
        id: "positioning-overview",
        label: "Market Positioning & Differentiation",
      },
      { id: "positioning-categoryOwnership", label: "Category Ownership" },
      { id: "positioning-uniqueValueProp", label: "Unique Value Proposition" },
      {
        id: "positioning-competitiveDiff",
        label: "Competitive Differentiation",
      },
      { id: "positioning-targetAudience", label: "Target Audience Clarity" },
      { id: "positioning-problemSolutionFit", label: "Problem-Solution Fit" },
      {
        id: "positioning-messagingConsistency",
        label: "Messaging Consistency",
      },
    ],
  },
  {
    id: "clarity",
    label: "Clarity Analysis",
    icon: "✨",
    children: [
      { id: "clarity-overview", label: "Messaging Clarity" },
      { id: "clarity-headlineClarity", label: "Headline Clarity" },
      { id: "clarity-valueProposition", label: "Value Proposition" },
      { id: "clarity-featureBenefitMapping", label: "Feature-Benefit Mapping" },
      { id: "clarity-visualHierarchy", label: "Visual Hierarchy" },
      { id: "clarity-ctaClarity", label: "CTA Clarity" },
      { id: "clarity-proofPlacement", label: "Proof Placement" },
    ],
  },
  { id: "aeo", label: "AEO Presence", icon: "🤖" },
  { id: "recommendations", label: "Recommendations", icon: "💡" },
];

export function getAllSectionIds(nav: NavItem[]): string[] {
  return nav.flatMap((n) => [n.id, ...(n.children?.map((c) => c.id) || [])]);
}
