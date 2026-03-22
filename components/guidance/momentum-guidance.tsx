"use client";

import { GuidancePage, GuidanceSection } from "@/components/guidance/guidance-page";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle, BookOpen, CheckCircle, HelpCircle, Lightbulb, Target, TrendingUp } from "lucide-react";

interface MomentumGuidancePageProps {
  productId: string;
}

export function MomentumGuidancePage({ productId }: MomentumGuidancePageProps) {
  return (
    <GuidancePage
      productId={productId}
      pillarName="Momentum Signal"
      pillarDescription="Evidence of growth, traction, and market validation"
      backToDashboard={`/dashboard/${productId}`}
    >
      {/* What is Momentum Signal */}
      <GuidanceSection title="What is Momentum Signal?" icon={<BookOpen className="h-5 w-5" />}>
        <div className="space-y-4">
          <p className="text-slate-700">
            <strong>Momentum Signal</strong> measures the visible evidence of growth, traction, and 
            market validation that your product communicates. Strong momentum signals build trust 
            and reduce perceived risk for potential customers.
          </p>

          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h4 className="text-sm font-semibold text-blue-800 mb-3">Momentum Signal Spectrum:</h4>
            <div className="space-y-3">
              <div className="p-3 bg-white rounded border border-green-200">
                <div className="flex items-center gap-2 mb-1">
                  <Badge className="bg-green-50 text-green-700 border-green-200">Viral</Badge>
                  <span className="text-sm font-semibold text-green-800">Exponential growth signals</span>
                </div>
                <p className="text-xs text-slate-600">
                  Overwhelming evidence of rapid adoption and market enthusiasm.
                </p>
              </div>
              <div className="p-3 bg-white rounded border border-lime-200">
                <div className="flex items-center gap-2 mb-1">
                  <Badge className="bg-lime-50 text-lime-700 border-lime-200">Rising</Badge>
                  <span className="text-sm font-semibold text-lime-800">Clear upward trajectory</span>
                </div>
                <p className="text-xs text-slate-600">
                  Strong growth indicators and positive market reception.
                </p>
              </div>
              <div className="p-3 bg-white rounded border border-blue-200">
                <div className="flex items-center gap-2 mb-1">
                  <Badge className="bg-blue-50 text-blue-700 border-blue-200">Stable</Badge>
                  <span className="text-sm font-semibold text-blue-800">Steady presence</span>
                </div>
                <p className="text-xs text-slate-600">
                  Consistent but not accelerating. Established but not exciting.
                </p>
              </div>
              <div className="p-3 bg-white rounded border border-orange-200">
                <div className="flex items-center gap-2 mb-1">
                  <Badge className="bg-orange-50 text-orange-700 border-orange-200">Flat</Badge>
                  <span className="text-sm font-semibold text-orange-800">Little visible activity</span>
                </div>
                <p className="text-xs text-slate-600">
                  Minimal evidence of growth or market engagement.
                </p>
              </div>
              <div className="p-3 bg-white rounded border border-red-200">
                <div className="flex items-center gap-2 mb-1">
                  <Badge className="bg-red-50 text-red-700 border-red-200">Dead</Badge>
                  <span className="text-sm font-semibold text-red-800">No momentum signals</span>
                </div>
                <p className="text-xs text-slate-600">
                  Absence of traction evidence. Appears inactive or failing.
                </p>
              </div>
            </div>
          </div>
        </div>
      </GuidanceSection>

      {/* Why Momentum Matters */}
      <GuidanceSection title="Why Does Momentum Signal Matter?" icon={<Lightbulb className="h-5 w-5" />}>
        <div className="space-y-4">
          <p className="text-slate-700">
            Customers follow crowds. Visible momentum creates a virtuous cycle: more users attract 
            more users. Without momentum signals, even great products struggle to gain trust.
          </p>

          <div className="grid md:grid-cols-2 gap-4">
            <Card className="border-green-200 bg-green-50">
              <CardContent className="p-4">
                <h4 className="font-semibold text-green-800 mb-2 flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  Benefits of Strong Momentum
                </h4>
                <ul className="space-y-2 text-sm text-green-900">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-3 w-3 mt-0.5 flex-shrink-0" />
                    <span>Higher conversion (social proof reduces risk)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-3 w-3 mt-0.5 flex-shrink-0" />
                    <span>Better pricing power (in-demand product)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-3 w-3 mt-0.5 flex-shrink-0" />
                    <span>Easier sales conversations (they come informed)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-3 w-3 mt-0.5 flex-shrink-0" />
                    <span>Media and partnership opportunities</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-3 w-3 mt-0.5 flex-shrink-0" />
                    <span>Talent attraction (people want to join winners)</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-red-200 bg-red-50">
              <CardContent className="p-4">
                <h4 className="font-semibold text-red-800 mb-2 flex items-center gap-2">
                  <AlertCircle className="h-4 w-4" />
                  Costs of Weak Momentum
                </h4>
                <ul className="space-y-2 text-sm text-red-900">
                  <li className="flex items-start gap-2">
                    <AlertCircle className="h-3 w-3 mt-0.5 flex-shrink-0" />
                    <span>Trust deficit (why isn't anyone using this?)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <AlertCircle className="h-3 w-3 mt-0.5 flex-shrink-0" />
                    <span>Longer sales cycles (more objection handling)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <AlertCircle className="h-3 w-3 mt-0.5 flex-shrink-0" />
                    <span>Price sensitivity (no perceived value)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <AlertCircle className="h-3 w-3 mt-0.5 flex-shrink-0" />
                    <span>Higher churn (question their decision)</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>

          <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
            <h4 className="font-semibold text-amber-800 mb-2">The Momentum Perception Gap</h4>
            <p className="text-sm text-amber-900">
              Even if you're growing, if you're not communicating it visibly, prospects will 
              assume you're stagnant. Perception becomes reality in the market.
            </p>
          </div>
        </div>
      </GuidanceSection>

      {/* How Momentum Score is Calculated */}
      <GuidanceSection title="How is the Momentum Score Calculated?" icon={<Target className="h-5 w-5" />}>
        <div className="space-y-4">
          <p className="text-slate-700">
            Your momentum signal score evaluates visible evidence of traction and growth.
          </p>

          <div className="space-y-3">
            <div className="p-4 bg-white rounded-lg border">
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold">User/Customer Metrics</span>
                <Badge variant="outline">~30% of score</Badge>
              </div>
              <p className="text-sm text-slate-700">
                Visible user counts, customer logos, growth percentages, or adoption rates. 
                Specific numbers beat vague claims.
              </p>
            </div>

            <div className="p-4 bg-white rounded-lg border">
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold">Social Proof</span>
                <Badge variant="outline">~25% of score</Badge>
              </div>
              <p className="text-sm text-slate-700">
                Reviews, testimonials, case studies, and user-generated content that 
                demonstrate active, satisfied users.
              </p>
            </div>

            <div className="p-4 bg-white rounded-lg border">
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold">Media & Recognition</span>
                <Badge variant="outline">~20% of score</Badge>
              </div>
              <p className="text-sm text-slate-700">
                Press coverage, awards, rankings, or industry recognition that 
                validates your market position.
              </p>
            </div>

            <div className="p-4 bg-white rounded-lg border">
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold">Activity Signals</span>
                <Badge variant="outline">~25% of score</Badge>
              </div>
              <p className="text-sm text-slate-700">
                Recent updates, product launches, hiring announcements, and other 
                indicators of an active, growing company.
              </p>
            </div>
          </div>
        </div>
      </GuidanceSection>

      {/* How to Improve */}
      <GuidanceSection title="How to Improve Your Momentum Signals" icon={<CheckCircle className="h-5 w-5" />}>
        <div className="space-y-4">
          <p className="text-slate-700">
            Build and communicate momentum with these strategies:
          </p>

          <div className="space-y-3">
            <div className="p-4 bg-white rounded-lg border">
              <h4 className="font-semibold mb-2">1. Quantify Everything</h4>
              <p className="text-sm text-slate-700 mb-2">
                Replace vague claims with specific numbers:
              </p>
              <ul className="space-y-1 text-sm text-slate-700 ml-4">
                <li>• "Many users" → "10,000+ active users"</li>
                <li>• "Growing fast" → "Tripled in 6 months"</li>
                <li>• "Trusted by companies" → "Trusted by 500+ companies"</li>
                <li>• Even small numbers are better than no numbers</li>
              </ul>
            </div>

            <div className="p-4 bg-white rounded-lg border">
              <h4 className="font-semibold mb-2">2. Showcase Customer Logos</h4>
              <p className="text-sm text-slate-700 mb-2">
                Visual proof of adoption:
              </p>
              <ul className="space-y-1 text-sm text-slate-700 ml-4">
                <li>• Display recognizable customer logos prominently</li>
                <li>• Group by category or industry for relevance</li>
                <li>• Include brief testimonials with logos</li>
                <li>• Update regularly as you add customers</li>
              </ul>
            </div>

            <div className="p-4 bg-white rounded-lg border">
              <h4 className="font-semibold mb-2">3. Create Case Studies</h4>
              <p className="text-sm text-slate-700 mb-2">
                Deep-dive success stories:
              </p>
              <ul className="space-y-1 text-sm text-slate-700 ml-4">
                <li>• Use specific metrics (before/after)</li>
                <li>• Include customer quotes and photos</li>
                <li>• Focus on transformation, not just features</li>
                <li>• Make them easy to find and scan</li>
              </ul>
            </div>

            <div className="p-4 bg-white rounded-lg border">
              <h4 className="font-semibold mb-2">4. Communicate Updates</h4>
              <p className="text-sm text-slate-700 mb-2">
                Show you're active and improving:
              </p>
              <ul className="space-y-1 text-sm text-slate-700 ml-4">
                <li>• Regular product update announcements</li>
                <li>• Milestone celebrations (funding, users, etc.)</li>
                <li>• Team growth and hiring news</li>
                <li>• Industry recognition and awards</li>
              </ul>
            </div>

            <div className="p-4 bg-white rounded-lg border">
              <h4 className="font-semibold mb-2">5. Leverage Social Proof</h4>
              <p className="text-sm text-slate-700">
                Collect and display reviews, ratings, and user-generated content. 
                Make it easy for happy customers to advocate for you.
              </p>
            </div>
          </div>
        </div>
      </GuidanceSection>
    </GuidancePage>
  );
}
