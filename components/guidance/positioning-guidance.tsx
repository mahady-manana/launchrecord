"use client";

import { GuidancePage, GuidanceSection } from "@/components/guidance/guidance-page";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle, BookOpen, CheckCircle, HelpCircle, Lightbulb, Target, TrendingUp } from "lucide-react";

interface PositioningGuidancePageProps {
  productId: string;
}

export function PositioningGuidancePage({ productId }: PositioningGuidancePageProps) {
  return (
    <GuidancePage
      productId={productId}
      pillarName="Positioning Sharpness"
      pillarDescription="How clearly and distinctly your product stands out in the market"
      backToDashboard={`/dashboard/${productId}`}
    >
      {/* What is Positioning Sharpness */}
      <GuidanceSection title="What is Positioning Sharpness?" icon={<BookOpen className="h-5 w-5" />}>
        <div className="space-y-4">
          <p className="text-slate-700">
            <strong>Positioning Sharpness</strong> measures how clearly your product distinguishes itself 
            from competitors in the minds of your target customers. Sharp positioning makes it immediately 
            obvious what you offer, who it's for, and why you're different.
          </p>

          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h4 className="text-sm font-semibold text-blue-800 mb-3">Positioning Sharpness Spectrum:</h4>
            <div className="space-y-3">
              <div className="p-3 bg-white rounded border border-green-200">
                <div className="flex items-center gap-2 mb-1">
                  <Badge className="bg-green-50 text-green-700 border-green-200">Dominant</Badge>
                  <span className="text-sm font-semibold text-green-800">Clear category leader</span>
                </div>
                <p className="text-xs text-slate-600">
                  Instantly recognizable as the go-to solution. Owns a specific position in customers' minds.
                </p>
              </div>
              <div className="p-3 bg-white rounded border border-lime-200">
                <div className="flex items-center gap-2 mb-1">
                  <Badge className="bg-lime-50 text-lime-700 border-lime-200">Strong</Badge>
                  <span className="text-sm font-semibold text-lime-800">Clear differentiator</span>
                </div>
                <p className="text-xs text-slate-600">
                  Well-defined unique value proposition. Stands out from most competitors.
                </p>
              </div>
              <div className="p-3 bg-white rounded border border-blue-200">
                <div className="flex items-center gap-2 mb-1">
                  <Badge className="bg-blue-50 text-blue-700 border-blue-200">Blended</Badge>
                  <span className="text-sm font-semibold text-blue-800">Some differentiation</span>
                </div>
                <p className="text-xs text-slate-600">
                  Has unique elements but shares similarities with competitors. Room to sharpen.
                </p>
              </div>
              <div className="p-3 bg-white rounded border border-orange-200">
                <div className="flex items-center gap-2 mb-1">
                  <Badge className="bg-orange-50 text-orange-700 border-orange-200">Weak</Badge>
                  <span className="text-sm font-semibold text-orange-800">Unclear differentiation</span>
                </div>
                <p className="text-xs text-slate-600">
                  Hard to distinguish from competitors. Value proposition is vague or generic.
                </p>
              </div>
              <div className="p-3 bg-white rounded border border-red-200">
                <div className="flex items-center gap-2 mb-1">
                  <Badge className="bg-red-50 text-red-700 border-red-200">Ghost</Badge>
                  <span className="text-sm font-semibold text-red-800">No clear position</span>
                </div>
                <p className="text-xs text-slate-600">
                  Essentially invisible in the market. No discernible unique value.
                </p>
              </div>
            </div>
          </div>
        </div>
      </GuidanceSection>

      {/* Why Positioning Matters */}
      <GuidanceSection title="Why Does Positioning Sharpness Matter?" icon={<Lightbulb className="h-5 w-5" />}>
        <div className="space-y-4">
          <p className="text-slate-700">
            Sharp positioning is the foundation of all marketing effectiveness. It determines whether 
            potential customers immediately understand your value or move on to competitors.
          </p>

          <div className="grid md:grid-cols-2 gap-4">
            <Card className="border-green-200 bg-green-50">
              <CardContent className="p-4">
                <h4 className="font-semibold text-green-800 mb-2 flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  Benefits of Sharp Positioning
                </h4>
                <ul className="space-y-2 text-sm text-green-900">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-3 w-3 mt-0.5 flex-shrink-0" />
                    <span>Higher conversion rates (visitors immediately "get it")</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-3 w-3 mt-0.5 flex-shrink-0" />
                    <span>Premium pricing power (clear differentiation)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-3 w-3 mt-0.5 flex-shrink-0" />
                    <span>More effective marketing spend (targeted messaging)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-3 w-3 mt-0.5 flex-shrink-0" />
                    <span>Word-of-mouth growth (easy to describe)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-3 w-3 mt-0.5 flex-shrink-0" />
                    <span>Customer loyalty (clear expectation setting)</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-red-200 bg-red-50">
              <CardContent className="p-4">
                <h4 className="font-semibold text-red-800 mb-2 flex items-center gap-2">
                  <AlertCircle className="h-4 w-4" />
                  Costs of Weak Positioning
                </h4>
                <ul className="space-y-2 text-sm text-red-900">
                  <li className="flex items-start gap-2">
                    <AlertCircle className="h-3 w-3 mt-0.5 flex-shrink-0" />
                    <span>High bounce rates (confused visitors leave)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <AlertCircle className="h-3 w-3 mt-0.5 flex-shrink-0" />
                    <span>Price competition (seen as commodity)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <AlertCircle className="h-3 w-3 mt-0.5 flex-shrink-0" />
                    <span>Wasted ad spend (unclear messaging)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <AlertCircle className="h-3 w-3 mt-0.5 flex-shrink-0" />
                    <span>Long sales cycles (constant education needed)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <AlertCircle className="h-3 w-3 mt-0.5 flex-shrink-0" />
                    <span>Low referral rates (hard to recommend)</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>

          <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
            <h4 className="font-semibold text-amber-800 mb-2">The Positioning Test</h4>
            <p className="text-sm text-amber-900 mb-3">
              Ask yourself: Can a stranger understand what you offer, who it's for, and why you're 
              different in under 10 seconds? If not, your positioning needs sharpening.
            </p>
          </div>
        </div>
      </GuidanceSection>

      {/* How Positioning Score is Calculated */}
      <GuidanceSection title="How is the Positioning Score Calculated?" icon={<Target className="h-5 w-5" />}>
        <div className="space-y-4">
          <p className="text-slate-700">
            Your positioning sharpness score evaluates multiple dimensions of how clearly you 
            communicate your unique value.
          </p>

          <div className="space-y-3">
            <div className="p-4 bg-white rounded-lg border">
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold">Category Clarity</span>
                <Badge variant="outline">~25% of score</Badge>
              </div>
              <p className="text-sm text-slate-700">
                How immediately visitors understand what category you compete in and what you offer. 
                Clear category framing reduces cognitive load.
              </p>
            </div>

            <div className="p-4 bg-white rounded-lg border">
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold">Differentiation</span>
                <Badge variant="outline">~30% of score</Badge>
              </div>
              <p className="text-sm text-slate-700">
                How distinctly you communicate what makes you different from alternatives. 
                Unique mechanisms, approaches, or outcomes.
              </p>
            </div>

            <div className="p-4 bg-white rounded-lg border">
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold">Target Audience Specificity</span>
                <Badge variant="outline">~25% of score</Badge>
              </div>
              <p className="text-sm text-slate-700">
                How clearly you identify and speak to your ideal customer. Specific personas 
                resonate more than "everyone."
              </p>
            </div>

            <div className="p-4 bg-white rounded-lg border">
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold">Value Proposition Clarity</span>
                <Badge variant="outline">~20% of score</Badge>
              </div>
              <p className="text-sm text-slate-700">
                How clearly you articulate the specific outcome or transformation customers 
                can expect from your product.
              </p>
            </div>
          </div>
        </div>
      </GuidanceSection>

      {/* Understanding Your Results */}
      <GuidanceSection title="Understanding Your Positioning Results" icon={<HelpCircle className="h-5 w-5" />}>
        <div className="space-y-4">
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h4 className="font-semibold text-blue-800 mb-3">Category Position</h4>
            <p className="text-sm text-blue-900 mb-3">
              Your category position reflects how you're likely perceived in the market:
            </p>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-3">
                <Badge className="bg-green-50 text-green-700 border-green-200">Leader</Badge>
                <span className="text-slate-700">Perceived as the category standard or innovator</span>
              </div>
              <div className="flex items-center gap-3">
                <Badge className="bg-blue-50 text-blue-700 border-blue-200">Challenger</Badge>
                <span className="text-slate-700">Strong alternative with clear differentiators</span>
              </div>
              <div className="flex items-center gap-3">
                <Badge className="bg-orange-50 text-orange-700 border-orange-200">Replicable</Badge>
                <span className="text-slate-700">Could be easily replaced by competitors</span>
              </div>
              <div className="flex items-center gap-3">
                <Badge className="bg-red-50 text-red-700 border-red-200">Invisible</Badge>
                <span className="text-slate-700">No clear market presence or differentiation</span>
              </div>
            </div>
          </div>

          <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
            <h4 className="font-semibold text-amber-800 mb-2">Primary Constraint</h4>
            <p className="text-sm text-amber-900">
              This identifies the biggest factor limiting your positioning effectiveness. 
              Focus your efforts here first for maximum improvement.
            </p>
          </div>
        </div>
      </GuidanceSection>

      {/* How to Improve */}
      <GuidanceSection title="How to Improve Your Positioning" icon={<CheckCircle className="h-5 w-5" />}>
        <div className="space-y-4">
          <p className="text-slate-700">
            Sharpen your positioning with these strategic actions:
          </p>

          <div className="space-y-3">
            <div className="p-4 bg-white rounded-lg border">
              <h4 className="font-semibold mb-2">1. Define Your Category</h4>
              <p className="text-sm text-slate-700 mb-2">
                Be specific about what you are (and aren't):
              </p>
              <ul className="space-y-1 text-sm text-slate-700 ml-4">
                <li>• Use clear category language ("CRM for consultants" not "business software")</li>
                <li>• Consider creating a new category if existing ones don't fit</li>
                <li>• Make the category benefit obvious</li>
              </ul>
            </div>

            <div className="p-4 bg-white rounded-lg border">
              <h4 className="font-semibold mb-2">2. Identify Your Unique Mechanism</h4>
              <p className="text-sm text-slate-700 mb-2">
                What do you do differently that others don't?
              </p>
              <ul className="space-y-1 text-sm text-slate-700 ml-4">
                <li>• Proprietary process or methodology</li>
                <li>• Unique technology or approach</li>
                <li>• Different business model</li>
                <li>• Give it a memorable name</li>
              </ul>
            </div>

            <div className="p-4 bg-white rounded-lg border">
              <h4 className="font-semibold mb-2">3. Specify Your Audience</h4>
              <p className="text-sm text-slate-700 mb-2">
                Narrow is better than broad:
              </p>
              <ul className="space-y-1 text-sm text-slate-700 ml-4">
                <li>• Name specific roles, industries, or company sizes</li>
                <li>• Use their language and address their specific pains</li>
                <li>• Show you understand their unique situation</li>
              </ul>
            </div>

            <div className="p-4 bg-white rounded-lg border">
              <h4 className="font-semibold mb-2">4. Craft Your Value Proposition</h4>
              <p className="text-sm text-slate-700 mb-2">
                Complete this sentence clearly:
              </p>
              <div className="p-3 bg-slate-50 rounded border text-sm text-slate-700">
                "We help [specific audience] achieve [specific outcome] by [unique mechanism], 
                unlike [alternative] which [limitation]."
              </div>
            </div>

            <div className="p-4 bg-white rounded-lg border">
              <h4 className="font-semibold mb-2">5. Test and Refine</h4>
              <p className="text-sm text-slate-700">
                Run your positioning by target customers. If they can't repeat it back in their 
                own words within 10 seconds, simplify further.
              </p>
            </div>
          </div>
        </div>
      </GuidanceSection>
    </GuidancePage>
  );
}
