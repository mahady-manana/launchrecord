"use client";

import { GuidancePage, GuidanceSection } from "@/components/guidance/guidance-page";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { BookOpen, CheckCircle, HelpCircle, Lightbulb, Target, TrendingUp, Award, Zap, Globe } from "lucide-react";

interface AuditGuidancePageProps {
  productId: string;
}

export function AuditGuidancePage({ productId }: AuditGuidancePageProps) {
  return (
    <GuidancePage
      productId={productId}
      pillarName="SIO-V5 Audit Guide"
      pillarDescription="Understanding your complete Search Intelligence Optimization analysis"
      backToDashboard={`/dashboard/${productId}`}
    >
      {/* What is SIO-V5 */}
      <GuidanceSection title="What is SIO-V5?" icon={<BookOpen className="h-5 w-5" />}>
        <div className="space-y-4">
          <p className="text-slate-700">
            <strong>SIO-V5 (Search Intelligence Optimization - Version 5)</strong> is a comprehensive 
            audit framework that evaluates your product's digital presence across five critical pillars 
            that determine online visibility, conversion, and growth potential.
          </p>

          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h4 className="text-sm font-semibold text-blue-800 mb-3">The Five Pillars of SIO:</h4>
            <div className="space-y-3">
              <div className="p-3 bg-white rounded border flex items-start gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Globe className="h-4 w-4 text-blue-600" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold">AEO (Answer Engine Optimization)</span>
                    <Badge variant="outline" className="text-xs">20% weight</Badge>
                  </div>
                  <p className="text-xs text-slate-600">
                    Optimizes your content to be selected by AI-powered search engines and voice 
                    assistants as the direct answer to user queries.
                  </p>
                </div>
              </div>

              <div className="p-3 bg-white rounded border flex items-start gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Target className="h-4 w-4 text-green-600" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold">Positioning Sharpness</span>
                    <Badge variant="outline" className="text-xs">20% weight</Badge>
                  </div>
                  <p className="text-xs text-slate-600">
                    Measures how clearly your product distinguishes itself from competitors in 
                    the minds of target customers.
                  </p>
                </div>
              </div>

              <div className="p-3 bg-white rounded border flex items-start gap-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Zap className="h-4 w-4 text-purple-600" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold">Clarity Velocity</span>
                    <Badge variant="outline" className="text-xs">20% weight</Badge>
                  </div>
                  <p className="text-xs text-slate-600">
                    Evaluates how quickly (in seconds) visitors understand your value proposition 
                    and what you offer.
                  </p>
                </div>
              </div>

              <div className="p-3 bg-white rounded border flex items-start gap-3">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <TrendingUp className="h-4 w-4 text-orange-600" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold">Momentum Signal</span>
                    <Badge variant="outline" className="text-xs">20% weight</Badge>
                  </div>
                  <p className="text-xs text-slate-600">
                    Assesses visible evidence of growth, traction, and market validation that 
                    builds trust with prospects.
                  </p>
                </div>
              </div>

              <div className="p-3 bg-white rounded border flex items-start gap-3">
                <div className="p-2 bg-red-100 rounded-lg">
                  <Award className="h-4 w-4 text-red-600" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold">Founder Proof Vault</span>
                    <Badge variant="outline" className="text-xs">20% weight</Badge>
                  </div>
                  <p className="text-xs text-slate-600">
                    Measures the collection of evidence, credentials, and authority signals that 
                    validate your claims.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </GuidanceSection>

      {/* Understanding Your Composite Score */}
      <GuidanceSection title="Understanding Your Composite Score" icon={<HelpCircle className="h-5 w-5" />}>
        <div className="space-y-4">
          <p className="text-slate-700">
            Your overall SIO score is a weighted composite of all five pillars. This single number 
            represents your overall digital optimization level.
          </p>

          <div className="grid md:grid-cols-2 gap-4">
            <Card className="border-green-200 bg-green-50">
              <CardContent className="p-4">
                <h4 className="font-semibold text-green-800 mb-3">Score Ranges</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between p-2 bg-white rounded border">
                    <span className="text-slate-700">90-100</span>
                    <Badge className="bg-green-50 text-green-700 border-green-200">Excellent</Badge>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-white rounded border">
                    <span className="text-slate-700">70-89</span>
                    <Badge className="bg-lime-50 text-lime-700 border-lime-200">Good</Badge>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-white rounded border">
                    <span className="text-slate-700">40-69</span>
                    <Badge className="bg-orange-50 text-orange-700 border-orange-200">Needs Work</Badge>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-white rounded border">
                    <span className="text-slate-700">0-39</span>
                    <Badge className="bg-red-50 text-red-700 border-red-200">Critical</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-amber-200 bg-amber-50">
              <CardContent className="p-4">
                <h4 className="font-semibold text-amber-800 mb-3">Category Position</h4>
                <p className="text-sm text-amber-900 mb-3">
                  This reflects how you're likely perceived in the market:
                </p>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Badge className="bg-green-50 text-green-700 border-green-200">Leader</Badge>
                    <span className="text-slate-700">Category standard or innovator</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-blue-50 text-blue-700 border-blue-200">Challenger</Badge>
                    <span className="text-slate-700">Strong alternative</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-orange-50 text-orange-700 border-orange-200">Replicable</Badge>
                    <span className="text-slate-700">Easily replaceable</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-red-50 text-red-700 border-red-200">Invisible</Badge>
                    <span className="text-slate-700">No clear presence</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
            <h4 className="font-semibold text-amber-800 mb-2">Primary Constraint</h4>
            <p className="text-sm text-amber-900">
              This identifies the single biggest factor limiting your overall performance. 
              Improving this constraint will have the highest impact on your composite score.
            </p>
          </div>
        </div>
      </GuidanceSection>

      {/* The Ego Stab */}
      <GuidanceSection title="Understanding 'The Ego Stab'" icon={<Lightbulb className="h-5 w-5" />}>
        <div className="space-y-4">
          <p className="text-slate-700">
            <strong>The Ego Stab</strong> is a brutally honest assessment designed to cut through 
            founder bias and highlight uncomfortable truths about your positioning and presentation.
          </p>

          <div className="space-y-3">
            <div className="p-4 bg-white rounded-lg border">
              <h4 className="font-semibold mb-2">Key Components:</h4>
              <div className="space-y-2 text-sm">
                <div className="p-3 bg-slate-50 rounded border">
                  <span className="font-semibold">Brutal Summary:</span>
                  <p className="text-slate-700 mt-1">
                    A one-sentence honest assessment of your current state. It may feel harsh, 
                    but it's designed to prompt action.
                  </p>
                </div>
                <div className="p-3 bg-slate-50 rounded border">
                  <span className="font-semibold">Severity Score:</span>
                  <p className="text-slate-700 mt-1">
                    Rates how critical your positioning issues are (1-100). Higher scores indicate 
                    more urgent need for improvement.
                  </p>
                </div>
                <div className="p-3 bg-slate-50 rounded border">
                  <span className="font-semibold">Cliché Density:</span>
                  <p className="text-slate-700 mt-1">
                    Measures how much generic buzzword language vs. specific, differentiated 
                    messaging you use.
                  </p>
                </div>
                <div className="p-3 bg-slate-50 rounded border">
                  <span className="font-semibold">Founder Bias Risk:</span>
                  <p className="text-slate-700 mt-1">
                    Assesses how much your personal attachment to the product may be clouding 
                    objective positioning decisions.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h4 className="font-semibold text-blue-800 mb-2">Why This Matters</h4>
              <p className="text-sm text-blue-900">
                Founders often overestimate their clarity and differentiation. The Ego Stab 
                provides an external, unbiased perspective to counter this natural bias.
              </p>
            </div>
          </div>
        </div>
      </GuidanceSection>

      {/* How to Use Your Audit */}
      <GuidanceSection title="How to Use Your Audit Results" icon={<Target className="h-5 w-5" />}>
        <div className="space-y-4">
          <p className="text-slate-700">
            Get maximum value from your SIO-V5 audit with this systematic approach:
          </p>

          <div className="space-y-3">
            <div className="p-4 bg-white rounded-lg border">
              <h4 className="font-semibold mb-2">Step 1: Review the Composite Score</h4>
              <p className="text-sm text-slate-700">
                Start with your overall score to understand your general optimization level. 
                Don't get discouraged by low scores—this is your baseline for improvement.
              </p>
            </div>

            <div className="p-4 bg-white rounded-lg border">
              <h4 className="font-semibold mb-2">Step 2: Identify Your Primary Constraint</h4>
              <p className="text-sm text-slate-700">
                This is your highest-leverage improvement area. Focus here first before 
                addressing other pillars.
              </p>
            </div>

            <div className="p-4 bg-white rounded-lg border">
              <h4 className="font-semibold mb-2">Step 3: Review Individual Pillar Scores</h4>
              <p className="text-sm text-slate-700">
                Understand your strengths and weaknesses across all five pillars. Look for 
                patterns and interconnections.
              </p>
            </div>

            <div className="p-4 bg-white rounded-lg border">
              <h4 className="font-semibold mb-2">Step 4: Read the Priority Actions</h4>
              <p className="text-sm text-slate-700">
                Each pillar provides specific, actionable recommendations. Start with the 
                highest priority items (P80-100).
              </p>
            </div>

            <div className="p-4 bg-white rounded-lg border">
              <h4 className="font-semibold mb-2">Step 5: Use the Guidance Pages</h4>
              <p className="text-sm text-slate-700">
                Click on any pillar to access detailed guidance explaining what it means, 
                why it matters, and how to improve.
              </p>
            </div>

            <div className="p-4 bg-white rounded-lg border">
              <h4 className="font-semibold mb-2">Step 6: Implement and Re-audit</h4>
              <p className="text-sm text-slate-700">
                Make improvements systematically, then run a new audit to measure progress. 
                SIO optimization is iterative.
              </p>
            </div>
          </div>
        </div>
      </GuidanceSection>

      {/* Marketing Terms Glossary */}
      <GuidanceSection title="Marketing Terms Glossary" icon={<BookOpen className="h-5 w-5" />}>
        <div className="space-y-3">
          <div className="p-4 bg-white rounded-lg border">
            <h4 className="font-semibold mb-2">Answer Engine Optimization (AEO)</h4>
            <p className="text-sm text-slate-700">
              The practice of optimizing content to be selected by AI-powered search engines 
              (like ChatGPT, Google SGE) as the direct answer to user queries, rather than 
              just ranking in search results.
            </p>
          </div>

          <div className="p-4 bg-white rounded-lg border">
            <h4 className="font-semibold mb-2">Positioning</h4>
            <p className="text-sm text-slate-700">
              How your product is perceived relative to competitors in the minds of target 
              customers. Good positioning makes you the obvious choice for a specific type 
              of customer.
            </p>
          </div>

          <div className="p-4 bg-white rounded-lg border">
            <h4 className="font-semibold mb-2">Value Proposition</h4>
            <p className="text-sm text-slate-700">
              A clear statement of the specific benefit you provide, who you provide it for, 
              and why you're the best choice. It answers "Why should I buy from you?"
            </p>
          </div>

          <div className="p-4 bg-white rounded-lg border">
            <h4 className="font-semibold mb-2">Social Proof</h4>
            <p className="text-sm text-slate-700">
              Evidence that other people (especially similar to your prospects) have used 
              and benefited from your product. Includes testimonials, case studies, reviews, 
              and user counts.
            </p>
          </div>

          <div className="p-4 bg-white rounded-lg border">
            <h4 className="font-semibold mb-2">Conversion Rate</h4>
            <p className="text-sm text-slate-700">
              The percentage of visitors who take a desired action (sign up, purchase, etc.). 
              Higher conversion rates indicate more effective messaging and user experience.
            </p>
          </div>

          <div className="p-4 bg-white rounded-lg border">
            <h4 className="font-semibold mb-2">Bounce Rate</h4>
            <p className="text-sm text-slate-700">
              The percentage of visitors who leave your site after viewing only one page. 
              High bounce rates often indicate clarity or relevance problems.
            </p>
          </div>

          <div className="p-4 bg-white rounded-lg border">
            <h4 className="font-semibold mb-2">Schema Markup</h4>
            <p className="text-sm text-slate-700">
              Structured data code added to webpages that helps search engines understand 
              the content's context and meaning, improving chances of being featured in 
              rich results and AI answers.
            </p>
          </div>

          <div className="p-4 bg-white rounded-lg border">
            <h4 className="font-semibold mb-2">Category Position</h4>
            <p className="text-sm text-slate-700">
              How you're perceived within your market category: Leader (dominant), 
              Challenger (strong alternative), Replicable (commoditized), or Invisible 
              (no clear presence).
            </p>
          </div>
        </div>
      </GuidanceSection>
    </GuidancePage>
  );
}
