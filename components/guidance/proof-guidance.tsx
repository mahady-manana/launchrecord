"use client";

import { GuidancePage, GuidanceSection } from "@/components/guidance/guidance-page";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle, BookOpen, CheckCircle, HelpCircle, Lightbulb, Target, Award } from "lucide-react";

interface ProofGuidancePageProps {
  productId: string;
}

export function ProofGuidancePage({ productId }: ProofGuidancePageProps) {
  return (
    <GuidancePage
      productId={productId}
      pillarName="Founder Proof Vault"
      pillarDescription="Evidence and authority that validates your claims and builds trust"
      backToDashboard={`/dashboard/${productId}`}
    >
      {/* What is Founder Proof Vault */}
      <GuidanceSection title="What is the Founder Proof Vault?" icon={<BookOpen className="h-5 w-5" />}>
        <div className="space-y-4">
          <p className="text-slate-700">
            <strong>Founder Proof Vault</strong> measures the collection of evidence, credentials, 
            and authority signals that validate your product's claims and build trust with potential 
            customers. It answers the critical question: "Why should I believe you?"
          </p>

          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h4 className="text-sm font-semibold text-blue-800 mb-3">Types of Proof Evidence:</h4>
            <div className="grid md:grid-cols-2 gap-3">
              <div className="p-3 bg-white rounded border">
                <div className="flex items-center gap-2 mb-2">
                  <Award className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-semibold">Testimonials</span>
                </div>
                <p className="text-xs text-slate-600">
                  Direct quotes from satisfied customers about their results
                </p>
              </div>
              <div className="p-3 bg-white rounded border">
                <div className="flex items-center gap-2 mb-2">
                  <Award className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-semibold">Case Studies</span>
                </div>
                <p className="text-xs text-slate-600">
                  Detailed success stories with specific metrics and outcomes
                </p>
              </div>
              <div className="p-3 bg-white rounded border">
                <div className="flex items-center gap-2 mb-2">
                  <Award className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-semibold">Metrics</span>
                </div>
                <p className="text-xs text-slate-600">
                  Quantifiable results, statistics, and performance data
                </p>
              </div>
              <div className="p-3 bg-white rounded border">
                <div className="flex items-center gap-2 mb-2">
                  <Award className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-semibold">Logos</span>
                </div>
                <p className="text-xs text-slate-600">
                  Recognizable customer or partner company logos
                </p>
              </div>
              <div className="p-3 bg-white rounded border">
                <div className="flex items-center gap-2 mb-2">
                  <Award className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-semibold">Press</span>
                </div>
                <p className="text-xs text-slate-600">
                  Media coverage, features, and industry recognition
                </p>
              </div>
              <div className="p-3 bg-white rounded border">
                <div className="flex items-center gap-2 mb-2">
                  <Award className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-semibold">Founder Authority</span>
                </div>
                <p className="text-xs text-slate-600">
                  Your expertise, background, and credibility signals
                </p>
              </div>
            </div>
          </div>
        </div>
      </GuidanceSection>

      {/* Why Proof Matters */}
      <GuidanceSection title="Why Does the Proof Vault Matter?" icon={<Lightbulb className="h-5 w-5" />}>
        <div className="space-y-4">
          <p className="text-slate-700">
            In an era of skepticism and information overload, claims alone don't convince. 
            Proof transforms skepticism into trust and interest into action.
          </p>

          <div className="grid md:grid-cols-2 gap-4">
            <Card className="border-green-200 bg-green-50">
              <CardContent className="p-4">
                <h4 className="font-semibold text-green-800 mb-2 flex items-center gap-2">
                  <CheckCircle className="h-4 w-4" />
                  Benefits of Strong Proof
                </h4>
                <ul className="space-y-2 text-sm text-green-900">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-3 w-3 mt-0.5 flex-shrink-0" />
                    <span>Higher conversion rates (trust reduces friction)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-3 w-3 mt-0.5 flex-shrink-0" />
                    <span>Shorter sales cycles (fewer objections)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-3 w-3 mt-0.5 flex-shrink-0" />
                    <span>Premium pricing (proven value justifies cost)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-3 w-3 mt-0.5 flex-shrink-0" />
                    <span>Better lead quality (self-selection)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-3 w-3 mt-0.5 flex-shrink-0" />
                    <span>Reduced refunds/churn (realistic expectations)</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-red-200 bg-red-50">
              <CardContent className="p-4">
                <h4 className="font-semibold text-red-800 mb-2 flex items-center gap-2">
                  <AlertCircle className="h-4 w-4" />
                  Costs of Weak Proof
                </h4>
                <ul className="space-y-2 text-sm text-red-900">
                  <li className="flex items-start gap-2">
                    <AlertCircle className="h-3 w-3 mt-0.5 flex-shrink-0" />
                    <span>Trust deficit ("prove it" objections)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <AlertCircle className="h-3 w-3 mt-0.5 flex-shrink-0" />
                    <span>Price resistance (unproven = risky)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <AlertCircle className="h-3 w-3 mt-0.5 flex-shrink-0" />
                    <span>Extended evaluation periods (hesitation)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <AlertCircle className="h-3 w-3 mt-0.5 flex-shrink-0" />
                    <span>Lost deals to established competitors</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>

          <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
            <h4 className="font-semibold text-amber-800 mb-2">The Trust Equation</h4>
            <p className="text-sm text-amber-900">
              Trust = (Credibility + Reliability + Intimacy) / Self-Orientation. Your proof vault 
              directly builds credibility and reliability while reducing perceived self-interest.
            </p>
          </div>
        </div>
      </GuidanceSection>

      {/* How Proof Score is Calculated */}
      <GuidanceSection title="How is the Proof Score Calculated?" icon={<Target className="h-5 w-5" />}>
        <div className="space-y-4">
          <p className="text-slate-700">
            Your founder proof vault score evaluates the breadth, depth, and visibility of 
            trust-building evidence.
          </p>

          <div className="space-y-3">
            <div className="p-4 bg-white rounded-lg border">
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold">Evidence Diversity</span>
                <Badge variant="outline">~30% of score</Badge>
              </div>
              <p className="text-sm text-slate-700">
                How many different types of proof do you display? Multiple evidence types 
                (testimonials, case studies, metrics, logos) create compound trust.
              </p>
            </div>

            <div className="p-4 bg-white rounded-lg border">
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold">Evidence Quality</span>
                <Badge variant="outline">~30% of score</Badge>
              </div>
              <p className="text-sm text-slate-700">
                How specific, credible, and relevant is your proof? Detailed case studies 
                with metrics outperform vague testimonials.
              </p>
            </div>

            <div className="p-4 bg-white rounded-lg border">
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold">Evidence Visibility</span>
                <Badge variant="outline">~25% of score</Badge>
              </div>
              <p className="text-sm text-slate-700">
                How prominently is proof displayed? Proof buried on separate pages has 
                less impact than proof integrated into key decision points.
              </p>
            </div>

            <div className="p-4 bg-white rounded-lg border">
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold">Founder Authority</span>
                <Badge variant="outline">~15% of score</Badge>
              </div>
              <p className="text-sm text-slate-700">
                Does the founder's background, expertise, and story support the product's 
                credibility? Personal authority transfers to product trust.
              </p>
            </div>
          </div>
        </div>
      </GuidanceSection>

      {/* Understanding Your Results */}
      <GuidanceSection title="Understanding Your Proof Results" icon={<HelpCircle className="h-5 w-5" />}>
        <div className="space-y-4">
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h4 className="font-semibold text-blue-800 mb-3">Evidence Types Analysis</h4>
            <p className="text-sm text-blue-900 mb-3">
              Your audit shows which evidence types you currently have. Gaps indicate 
              opportunities to build a more complete proof vault:
            </p>
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between p-2 bg-white rounded border">
                <span className="text-slate-700">Testimonials</span>
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">High Impact</Badge>
              </div>
              <div className="flex items-center justify-between p-2 bg-white rounded border">
                <span className="text-slate-700">Case Studies</span>
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">High Impact</Badge>
              </div>
              <div className="flex items-center justify-between p-2 bg-white rounded border">
                <span className="text-slate-700">Metrics/Data</span>
                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Medium Impact</Badge>
              </div>
              <div className="flex items-center justify-between p-2 bg-white rounded border">
                <span className="text-slate-700">Press/Media</span>
                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Medium Impact</Badge>
              </div>
            </div>
          </div>
        </div>
      </GuidanceSection>

      {/* How to Improve */}
      <GuidanceSection title="How to Build Your Proof Vault" icon={<CheckCircle className="h-5 w-5" />}>
        <div className="space-y-4">
          <p className="text-slate-700">
            Systematically build and display proof with these strategies:
          </p>

          <div className="space-y-3">
            <div className="p-4 bg-white rounded-lg border">
              <h4 className="font-semibold mb-2">1. Collect Testimonials Systematically</h4>
              <p className="text-sm text-slate-700 mb-2">
                Make it easy for happy customers to provide proof:
              </p>
              <ul className="space-y-1 text-sm text-slate-700 ml-4">
                <li>• Ask immediately after positive feedback or results</li>
                <li>• Provide a simple form or template</li>
                <li>• Request specific outcomes, not just "great product"</li>
                <li>• Get permission to use full name and company</li>
                <li>• Offer to write a draft they can approve</li>
              </ul>
            </div>

            <div className="p-4 bg-white rounded-lg border">
              <h4 className="font-semibold mb-2">2. Create Detailed Case Studies</h4>
              <p className="text-sm text-slate-700 mb-2">
                Structure success stories for maximum impact:
              </p>
              <ul className="space-y-1 text-sm text-slate-700 ml-4">
                <li>• Use the Problem → Solution → Results framework</li>
                <li>• Include specific before/after metrics</li>
                <li>• Add customer quotes throughout</li>
                <li>• Make it scannable with headers and bullets</li>
                <li>• Include a clear CTA at the end</li>
              </ul>
            </div>

            <div className="p-4 bg-white rounded-lg border">
              <h4 className="font-semibold mb-2">3. Quantify Your Impact</h4>
              <p className="text-sm text-slate-700 mb-2">
                Turn customer success into compelling statistics:
              </p>
              <ul className="space-y-1 text-sm text-slate-700 ml-4">
                <li>• Aggregate results across customers</li>
                <li>• Calculate average improvements</li>
                <li>• Track and display cumulative impact</li>
                <li>• Update metrics regularly</li>
              </ul>
            </div>

            <div className="p-4 bg-white rounded-lg border">
              <h4 className="font-semibold mb-2">4. Build Founder Authority</h4>
              <p className="text-sm text-slate-700 mb-2">
                Establish your expertise and credibility:
              </p>
              <ul className="space-y-1 text-sm text-slate-700 ml-4">
                <li>• Share your relevant background and experience</li>
                <li>• Publish thought leadership content</li>
                <li>• Speak at industry events</li>
                <li>• Get quoted in media publications</li>
                <li>• Build a visible personal brand</li>
              </ul>
            </div>

            <div className="p-4 bg-white rounded-lg border">
              <h4 className="font-semibold mb-2">5. Display Proof Strategically</h4>
              <p className="text-sm text-slate-700">
                Put proof at every decision point: homepage, pricing page, checkout, 
                and sales materials. Make it impossible to miss.
              </p>
            </div>
          </div>
        </div>
      </GuidanceSection>
    </GuidancePage>
  );
}
