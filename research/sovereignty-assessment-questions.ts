/**
 * SIO-V5 Sovereignty Assessment Questions
 *
 * Top 5 most critical questions per category
 * Simple format: Question + Impact only
 */

// ============================================================================
// SOVEREIGNTY QUESTIONS (Top 5)
// ============================================================================

export const sovereigntyQuestions = [
  {
    question:
      "Do you own a defined category that you can be the default choice for?",
    impact:
      "Without category ownership, you compete in crowded markets where buyers can't distinguish you from incumbents",
  },
  {
    question: "Are you visible in AI-generated responses for your category?",
    impact:
      "By 2026, 50%+ of searches will be zero-click AI answers. Invisible to AI = invisible to half your market",
  },
  {
    question:
      "Can customers describe what makes you different in one sentence?",
    impact:
      "If customers can't articulate your differentiation, word-of-mouth growth is impossible",
  },
  {
    question: "Do you have documented proof of outcomes (not just features)?",
    impact:
      "Features tell, proof sells. Without quantified outcomes, visitors can't justify the purchase",
  },
  {
    question: "Do you have a clear ICP that you can say 'no' to?",
    impact:
      "Trying to serve everyone dilutes your positioning and makes you irrelevant to everyone",
  },
];

// ============================================================================
// POSITIONING QUESTIONS (Top 5)
// ============================================================================

export const positioningQuestions = [
  {
    question:
      "Does your headline lead with the visitor's problem (not your company name)?",
    impact:
      "Headlines starting with brand name lose 80% of visitors before they understand what you do",
  },
  {
    question:
      "Do you use generic marketing jargon that any competitor could claim?",
    impact:
      "Generic language ('streamline workflows', 'boost productivity') makes you invisible in a sea of sameness",
  },
  {
    question:
      "Can you state your unique value proposition in one quantified sentence?",
    impact:
      "Unquantified value props ('better collaboration') don't give visitors a reason to change",
  },
  {
    question:
      "Do you explicitly name your competitors and explain why you win?",
    impact:
      "Without competitor contrasts, visitors can't evaluate you against alternatives they're considering",
  },
  {
    question: "Do you lead with outcomes (transformation) instead of features?",
    impact:
      "Features are what it does. Outcomes are what visitors buy. Leading with features loses conversions",
  },
];

// ============================================================================
// CLARITY QUESTIONS (Top 5)
// ============================================================================

export const clarityQuestions = [
  {
    question: "Can visitors understand what you do in 5 seconds or less?",
    impact:
      "Every second of confusion increases bounce rate by 10%. 8-second comprehension = 40% bounce rate",
  },
  {
    question:
      "Does your hero section show problem/outcome before product screenshots?",
    impact:
      "Dashboard screenshots before problem explanation confuse visitors. They need to know WHY before HOW",
  },
  {
    question:
      "Is your value proposition in the headline (not buried in body copy)?",
    impact:
      "Buried value props are missed value props. 80% of visitors never scroll past the hero",
  },
  {
    question: "Do you quantify benefits with specific numbers?",
    impact:
      "'Save time' is forgettable. 'Save 10 hours/week' is memorable and actionable",
  },
  {
    question: "Do you have social proof above your first CTA?",
    impact:
      "Asking for conversion before building trust reduces conversion rates by 30-50%",
  },
];

// ============================================================================
// SEO/AEO QUESTIONS (Top 5)
// ============================================================================

export const seoAeoQuestions = [
  {
    question:
      "Do you appear in AI-generated responses for your category keywords?",
    impact:
      "Not appearing in AI responses means losing 50%+ of future search traffic to competitors",
  },
  {
    question: "Do you rank on page 1 for your primary category keyword?",
    impact:
      "Page 2 is the best place to hide a dead body. 95% of clicks go to page 1 results",
  },
  {
    question:
      "Do you have proper schema markup (Organization, Product, SoftwareApplication)?",
    impact:
      "Missing schema markup means search engines and AI can't properly understand and categorize your site",
  },
  {
    question:
      "Do you have a topic cluster with 10+ articles on your core category?",
    impact:
      "Without topical authority, you rank for nothing. Google rewards depth, not breadth",
  },
  {
    question: "Do you have comparison pages ('Us vs Competitor')?",
    impact:
      "No comparison pages means losing high-intent '[Competitor] alternative' search traffic",
  },
];

// ============================================================================
// TOTAL: 20 questions (5 per category)
// ============================================================================

/**
 * Use these 20 questions to:
 * 1. Audit startups in under 10 minutes
 * 2. Identify the most critical gaps
 * 3. Map "No" answers to follow-up actions from sio-v5-report-schema.ts
 * 4. Generate prioritized action plans
 *
 * Scoring:
 * - Count "No" answers per category
 * - Each "No" = one follow-up action needed
 * - Priority based on category (Sovereignty > Positioning > Clarity > SEO)
 */
