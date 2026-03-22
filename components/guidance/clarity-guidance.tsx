"use client";

import { GuidancePage, GuidanceSection } from "@/components/guidance/guidance-page";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle, BookOpen, CheckCircle, HelpCircle, Lightbulb, Target, TrendingUp, Zap } from "lucide-react";

interface ClarityGuidancePageProps {
  productId: string;
}

export function ClarityGuidancePage({ productId }: ClarityGuidancePageProps) {
  return (
    <GuidancePage
      productId={productId}
      pillarName="Clarity Velocity"
      pillarDescription="How quickly visitors understand your value proposition"
      backToDashboard={`/dashboard/${productId}`}
    >
      {/* What is Clarity Velocity */}
      <GuidanceSection title="What is Clarity Velocity?" icon={<BookOpen className="h-5 w-5" />}>
        <div className="space-y-4">
          <p className="text-slate-700">
            <strong>Clarity Velocity</strong> measures how quickly (in seconds) a visitor can understand 
            what you offer, who it's for, and why they should care. High clarity velocity means visitors 
            "get it" almost instantly.
          </p>

          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h4 className="text-sm font-semibold text-blue-800 mb-3">Clarity Velocity Spectrum:</h4>
            <div className="space-y-3">
              <div className="p-3 bg-white rounded border border-green-200">
                <div className="flex items-center gap-2 mb-1">
                  <Badge className="bg-green-50 text-green-700 border-green-200">Instant</Badge>
                  <span className="text-sm font-semibold text-green-800">&lt;3 seconds</span>
                </div>
                <p className="text-xs text-slate-600">
                  Value proposition is immediately obvious. Zero cognitive load.
                </p>
              </div>
              <div className="p-3 bg-white rounded border border-lime-200">
                <div className="flex items-center gap-2 mb-1">
                  <Badge className="bg-lime-50 text-lime-700 border-lime-200">Clear</Badge>
                  <span className="text-sm font-semibold text-lime-800">3-7 seconds</span>
                </div>
                <p className="text-xs text-slate-600">
                  Quick to understand with minimal scanning.
                </p>
              </div>
              <div className="p-3 bg-white rounded border border-blue-200">
                <div className="flex items-center gap-2 mb-1">
                  <Badge className="bg-blue-50 text-blue-700 border-blue-200">Average</Badge>
                  <span className="text-sm font-semibold text-blue-800">7-15 seconds</span>
                </div>
                <p className="text-xs text-slate-600">
                  Requires some reading but becomes clear.
                </p>
              </div>
              <div className="p-3 bg-white rounded border border-orange-200">
                <div className="flex items-center gap-2 mb-1">
                  <Badge className="bg-orange-50 text-orange-700 border-orange-200">Confusing</Badge>
                  <span className="text-sm font-semibold text-orange-800">15-30 seconds</span>
                </div>
                <p className="text-xs text-slate-600">
                  Visitors struggle to understand the offering.
                </p>
              </div>
              <div className="p-3 bg-white rounded border border-red-200">
                <div className="flex items-center gap-2 mb-1">
                  <Badge className="bg-red-50 text-red-700 border-red-200">Opaque</Badge>
                  <span className="text-sm font-semibold text-red-800">&gt;30 seconds</span>
                </div>
                <p className="text-xs text-slate-600">
                  Visitors leave without understanding what you do.
                </p>
              </div>
            </div>
          </div>
        </div>
      </GuidanceSection>

      {/* Why Clarity Matters */}
      <GuidanceSection title="Why Does Clarity Velocity Matter?" icon={<Lightbulb className="h-5 w-5" />}>
        <div className="space-y-4">
          <p className="text-slate-700">
            In the digital age, attention is scarce. Visitors make snap judgments. If they don't 
            understand your value within seconds, they're gone—often permanently.
          </p>

          <div className="grid md:grid-cols-2 gap-4">
            <Card className="border-green-200 bg-green-50">
              <CardContent className="p-4">
                <h4 className="font-semibold text-green-800 mb-2 flex items-center gap-2">
                  <Zap className="h-4 w-4" />
                  Benefits of High Clarity
                </h4>
                <ul className="space-y-2 text-sm text-green-900">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-3 w-3 mt-0.5 flex-shrink-0" />
                    <span>Lower bounce rates (visitors stay engaged)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-3 w-3 mt-0.5 flex-shrink-0" />
                    <span>Higher conversion rates (clear path to action)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-3 w-3 mt-0.5 flex-shrink-0" />
                    <span>Better qualified leads (self-selection)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-3 w-3 mt-0.5 flex-shrink-0" />
                    <span>Reduced support burden (fewer basic questions)</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-red-200 bg-red-50">
              <CardContent className="p-4">
                <h4 className="font-semibold text-red-800 mb-2 flex items-center gap-2">
                  <AlertCircle className="h-4 w-4" />
                  Costs of Confusion
                </h4>
                <ul className="space-y-2 text-sm text-red-900">
                  <li className="flex items-start gap-2">
                    <AlertCircle className="h-3 w-3 mt-0.5 flex-shrink-0" />
                    <span>80%+ bounce rate on homepage</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <AlertCircle className="h-3 w-3 mt-0.5 flex-shrink-0" />
                    <span>Wasted ad spend (traffic doesn't convert)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <AlertCircle className="h-3 w-3 mt-0.5 flex-shrink-0" />
                    <span>Long sales cycles (constant education)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <AlertCircle className="h-3 w-3 mt-0.5 flex-shrink-0" />
                    <span>Brand damage (appears unprofessional)</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>

          <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
            <h4 className="font-semibold text-amber-800 mb-2">The 5-Second Test</h4>
            <p className="text-sm text-amber-900">
              Show your homepage to someone for exactly 5 seconds, then ask: "What do they offer?" 
              "Who is it for?" If they can't answer confidently, your clarity needs work.
            </p>
          </div>
        </div>
      </GuidanceSection>

      {/* How Clarity Score is Calculated */}
      <GuidanceSection title="How is the Clarity Score Calculated?" icon={<Target className="h-5 w-5" />}>
        <div className="space-y-4">
          <p className="text-slate-700">
            Your clarity velocity score evaluates how efficiently your content communicates value.
          </p>

          <div className="space-y-3">
            <div className="p-4 bg-white rounded-lg border">
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold">Headline Clarity</span>
                <Badge variant="outline">~35% of score</Badge>
              </div>
              <p className="text-sm text-slate-700">
                Does your H1 immediately communicate what you offer? Clear headlines use simple 
                language and specific outcomes.
              </p>
            </div>

            <div className="p-4 bg-white rounded-lg border">
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold">Subheadline Support</span>
                <Badge variant="outline">~25% of score</Badge>
              </div>
              <p className="text-sm text-slate-700">
                Does your subheadline reinforce and expand on the headline? It should add context 
                without creating confusion.
              </p>
            </div>

            <div className="p-4 bg-white rounded-lg border">
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold">Visual Hierarchy</span>
                <Badge variant="outline">~20% of score</Badge>
              </div>
              <p className="text-sm text-slate-700">
                Is the most important information visually prominent? Proper use of size, color, 
                and spacing guides attention.
              </p>
            </div>

            <div className="p-4 bg-white rounded-lg border">
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold">Jargon Density</span>
                <Badge variant="outline">~20% of score</Badge>
              </div>
              <p className="text-sm text-slate-700">
                How much industry jargon or buzzwords are used? Clear communication uses customer 
                language, not internal speak.
              </p>
            </div>
          </div>
        </div>
      </GuidanceSection>

      {/* Understanding Your Results */}
      <GuidanceSection title="Understanding Your Clarity Results" icon={<HelpCircle className="h-5 w-5" />}>
        <div className="space-y-4">
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h4 className="font-semibold text-blue-800 mb-3">Critique Interpretation</h4>
            <p className="text-sm text-blue-900 mb-3">
              Your critique highlights specific clarity issues. Look for patterns:
            </p>
            <ul className="space-y-2 text-sm text-blue-900">
              <li className="flex items-start gap-2">
                <HelpCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <span>Mentions of "unclear" or "vague" = headline/subheadline issues</span>
              </li>
              <li className="flex items-start gap-2">
                <HelpCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <span>References to "jargon" = language simplification needed</span>
              </li>
              <li className="flex items-start gap-2">
                <HelpCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <span>Notes on "structure" = visual hierarchy problems</span>
              </li>
            </ul>
          </div>
        </div>
      </GuidanceSection>

      {/* How to Improve */}
      <GuidanceSection title="How to Improve Your Clarity" icon={<CheckCircle className="h-5 w-5" />}>
        <div className="space-y-4">
          <p className="text-slate-700">
            Increase clarity velocity with these tactics:
          </p>

          <div className="space-y-3">
            <div className="p-4 bg-white rounded-lg border">
              <h4 className="font-semibold mb-2">1. Lead with Outcome, Not Features</h4>
              <div className="space-y-2 text-sm">
                <p className="text-slate-700">Instead of:</p>
                <div className="p-2 bg-red-50 rounded border border-red-200 text-red-800">
                  "AI-powered platform with advanced analytics and integrations"
                </div>
                <p className="text-slate-700">Try:</p>
                <div className="p-2 bg-green-50 rounded border border-green-200 text-green-800">
                  "Get more customers from your website in 30 days"
                </div>
              </div>
            </div>

            <div className="p-4 bg-white rounded-lg border">
              <h4 className="font-semibold mb-2">2. Use the "So What?" Test</h4>
              <p className="text-sm text-slate-700 mb-2">
                For every claim, ask "so what?" until you reach the emotional outcome:
              </p>
              <ul className="space-y-1 text-sm text-slate-700 ml-4">
                <li>• "We have AI" → So what? → "It works faster"</li>
                <li>• "It works faster" → So what? → "You save time"</li>
                <li>• "You save time" → So what? → "You can focus on growth"</li>
                <li>• Lead with the final answer, not the feature</li>
              </ul>
            </div>

            <div className="p-4 bg-white rounded-lg border">
              <h4 className="font-semibold mb-2">3. Eliminate Jargon</h4>
              <p className="text-sm text-slate-700 mb-2">
                Replace industry terms with customer language:
              </p>
              <ul className="space-y-1 text-sm text-slate-700 ml-4">
                <li>• "B2B SaaS" → "Software for businesses"</li>
                <li>• "Omnichannel" → "Everywhere your customers are"</li>
                <li>• "Synergy" → "Works together seamlessly"</li>
                <li>• "Disruptive" → "Changes how things work"</li>
              </ul>
            </div>

            <div className="p-4 bg-white rounded-lg border">
              <h4 className="font-semibold mb-2">4. Use the Inverted Pyramid</h4>
              <p className="text-sm text-slate-700">
                Put the most important information first, then supporting details. 
                Don't bury the lead—your headline should stand alone.
              </p>
            </div>
          </div>
        </div>
      </GuidanceSection>
    </GuidancePage>
  );
}
