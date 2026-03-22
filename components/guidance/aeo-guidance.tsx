"use client";

import { GuidancePage, GuidanceSection } from "@/components/guidance/guidance-page";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle, BookOpen, CheckCircle, HelpCircle, Lightbulb, Target, TrendingUp } from "lucide-react";

interface AEOGuidancePageProps {
  productId: string;
}

export function AEOGuidancePage({ productId }: AEOGuidancePageProps) {
  return (
    <GuidancePage
      productId={productId}
      pillarName="AEO (Answer Engine Optimization)"
      pillarDescription="Optimize your content to be the answer AI assistants and search engines provide"
      backToDashboard={`/dashboard/${productId}`}
    >
      {/* What is AEO */}
      <GuidanceSection title="What is AEO?" icon={<BookOpen className="h-5 w-5" />}>
        <div className="space-y-4">
          <p className="text-slate-700">
            <strong>AEO (Answer Engine Optimization)</strong> is the practice of optimizing your content to be directly 
            selected and presented by AI-powered search engines and voice assistants when users ask questions.
          </p>
          
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h4 className="text-sm font-semibold text-blue-800 mb-2">Key Difference from Traditional SEO:</h4>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-3 bg-white rounded border">
                <p className="text-xs font-semibold text-slate-600 mb-1">Traditional SEO</p>
                <p className="text-sm text-slate-700">"Show me a list of relevant websites"</p>
              </div>
              <div className="p-3 bg-white rounded border">
                <p className="text-xs font-semibold text-slate-600 mb-1">AEO</p>
                <p className="text-sm text-slate-700">"Give me the direct answer to my question"</p>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="text-sm font-semibold">Core Components of AEO:</h4>
            <ul className="space-y-2">
              <li className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                <div>
                  <span className="font-medium">Schema Markup:</span>
                  <span className="text-slate-700 ml-2">
                    Structured data that helps search engines understand your content's context and meaning
                  </span>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                <div>
                  <span className="font-medium">Direct Answer Potential:</span>
                  <span className="text-slate-700 ml-2">
                    How well your content provides clear, concise answers to common questions
                  </span>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                <div>
                  <span className="font-medium">Search Visibility Risk:</span>
                  <span className="text-slate-700 ml-2">
                    Assessment of how likely your content is to be selected as an answer
                  </span>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </GuidanceSection>

      {/* Why AEO Matters */}
      <GuidanceSection title="Why Does AEO Matter?" icon={<Lightbulb className="h-5 w-5" />}>
        <div className="space-y-4">
          <p className="text-slate-700">
            With the rise of AI-powered search (ChatGPT, Google's SGE, Perplexity), users increasingly 
            expect direct answers rather than lists of links. AEO ensures your content is selected as 
            that answer.
          </p>

          <div className="grid md:grid-cols-2 gap-4">
            <Card className="border-green-200 bg-green-50">
              <CardContent className="p-4">
                <h4 className="font-semibold text-green-800 mb-2 flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  Benefits of Good AEO
                </h4>
                <ul className="space-y-2 text-sm text-green-900">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-3 w-3 mt-0.5 flex-shrink-0" />
                    <span>Increased visibility in AI-generated answers</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-3 w-3 mt-0.5 flex-shrink-0" />
                    <span>Higher quality traffic from qualified users</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-3 w-3 mt-0.5 flex-shrink-0" />
                    <span>Brand authority and trust building</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-3 w-3 mt-0.5 flex-shrink-0" />
                    <span>Competitive advantage in emerging search</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-red-200 bg-red-50">
              <CardContent className="p-4">
                <h4 className="font-semibold text-red-800 mb-2 flex items-center gap-2">
                  <AlertCircle className="h-4 w-4" />
                  Risks of Poor AEO
                </h4>
                <ul className="space-y-2 text-sm text-red-900">
                  <li className="flex items-start gap-2">
                    <AlertCircle className="h-3 w-3 mt-0.5 flex-shrink-0" />
                    <span>Invisible in AI-powered search results</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <AlertCircle className="h-3 w-3 mt-0.5 flex-shrink-0" />
                    <span>Lost traffic to competitors with better optimization</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <AlertCircle className="h-3 w-3 mt-0.5 flex-shrink-0" />
                    <span>Reduced brand authority and recognition</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <AlertCircle className="h-3 w-3 mt-0.5 flex-shrink-0" />
                    <span>Declining organic search performance</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </GuidanceSection>

      {/* How AEO Score is Calculated */}
      <GuidanceSection title="How is the AEO Score Calculated?" icon={<Target className="h-5 w-5" />}>
        <div className="space-y-4">
          <p className="text-slate-700">
            Your AEO score is calculated based on multiple factors that measure how well your content 
            is optimized for answer engines.
          </p>

          <div className="space-y-3">
            <div className="p-4 bg-white rounded-lg border">
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold">Schema Markup Quality</span>
                <Badge variant="outline">~30% of score</Badge>
              </div>
              <p className="text-sm text-slate-700">
                Measures the presence, completeness, and quality of structured data on your pages. 
                Includes Organization, Product, FAQ, and other relevant schema types.
              </p>
            </div>

            <div className="p-4 bg-white rounded-lg border">
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold">Direct Answer Potential</span>
                <Badge variant="outline">~30% of score</Badge>
              </div>
              <p className="text-sm text-slate-700">
                Evaluates how well your content provides clear, concise answers to questions your 
                target audience is asking.
              </p>
            </div>

            <div className="p-4 bg-white rounded-lg border">
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold">Content Structure</span>
                <Badge variant="outline">~25% of score</Badge>
              </div>
              <p className="text-sm text-slate-700">
                Assesses heading hierarchy, paragraph length, use of lists, and overall readability 
                for both humans and AI.
              </p>
            </div>

            <div className="p-4 bg-white rounded-lg border">
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold">Technical SEO Foundation</span>
                <Badge variant="outline">~15% of score</Badge>
              </div>
              <p className="text-sm text-slate-700">
                Basic technical requirements like page speed, mobile-friendliness, and proper 
                meta tags that enable AI crawling.
              </p>
            </div>
          </div>
        </div>
      </GuidanceSection>

      {/* Understanding Your AEO Audit Results */}
      <GuidanceSection title="Understanding Your AEO Audit Results" icon={<HelpCircle className="h-5 w-5" />}>
        <div className="space-y-4">
          <div className="space-y-3">
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h4 className="font-semibold text-blue-800 mb-2">Search Visibility Risk Levels</h4>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-3">
                  <Badge className="bg-green-50 text-green-700 border-green-200">Low Risk</Badge>
                  <span className="text-slate-700">Your content is well-optimized for answer engines</span>
                </div>
                <div className="flex items-center gap-3">
                  <Badge className="bg-orange-50 text-orange-700 border-orange-200">Medium Risk</Badge>
                  <span className="text-slate-700">Some optimization needed to compete effectively</span>
                </div>
                <div className="flex items-center gap-3">
                  <Badge className="bg-red-50 text-red-700 border-red-200">High Risk</Badge>
                  <span className="text-slate-700">Significant optimization required</span>
                </div>
              </div>
            </div>

            <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
              <h4 className="font-semibold text-amber-800 mb-2">Priority Actions</h4>
              <p className="text-sm text-amber-900 mb-3">
                Each recommended action has a priority score (0-100). Higher priority actions have 
                greater potential impact on your AEO performance.
              </p>
              <ul className="space-y-2 text-sm text-amber-900">
                <li className="flex items-start gap-2">
                  <Badge className="bg-red-100 text-red-700 border-red-200">80-100</Badge>
                  <span>Critical - Address immediately for maximum impact</span>
                </li>
                <li className="flex items-start gap-2">
                  <Badge className="bg-orange-100 text-orange-700 border-orange-200">50-79</Badge>
                  <span>High - Important improvements to make soon</span>
                </li>
                <li className="flex items-start gap-2">
                  <Badge className="bg-blue-100 text-blue-700 border-blue-200">0-49</Badge>
                  <span>Medium - Valuable but can be done later</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </GuidanceSection>

      {/* How to Improve */}
      <GuidanceSection title="How to Improve Your AEO Score" icon={<CheckCircle className="h-5 w-5" />}>
        <div className="space-y-4">
          <p className="text-slate-700">
            Follow these actionable steps to improve your AEO performance:
          </p>

          <div className="space-y-3">
            <div className="p-4 bg-white rounded-lg border">
              <h4 className="font-semibold mb-2">1. Implement Schema Markup</h4>
              <p className="text-sm text-slate-700 mb-2">
                Add structured data to help search engines understand your content:
              </p>
              <ul className="space-y-1 text-sm text-slate-700 ml-4">
                <li>• Organization schema for company information</li>
                <li>• Product/Service schema for offerings</li>
                <li>• FAQ schema for common questions</li>
                <li>• Review/Rating schema for social proof</li>
              </ul>
            </div>

            <div className="p-4 bg-white rounded-lg border">
              <h4 className="font-semibold mb-2">2. Create Direct Answer Content</h4>
              <p className="text-sm text-slate-700 mb-2">
                Structure content to directly answer questions:
              </p>
              <ul className="space-y-1 text-sm text-slate-700 ml-4">
                <li>• Start sections with direct answers (40-60 words)</li>
                <li>• Use question-based headings</li>
                <li>• Provide supporting details after the direct answer</li>
                <li>• Include relevant data and examples</li>
              </ul>
            </div>

            <div className="p-4 bg-white rounded-lg border">
              <h4 className="font-semibold mb-2">3. Optimize Content Structure</h4>
              <p className="text-sm text-slate-700 mb-2">
                Make content easy to parse for AI:
              </p>
              <ul className="space-y-1 text-sm text-slate-700 ml-4">
                <li>• Use clear heading hierarchy (H1 → H2 → H3)</li>
                <li>• Keep paragraphs short (2-4 sentences)</li>
                <li>• Use bulleted and numbered lists</li>
                <li>• Include summary boxes for key points</li>
              </ul>
            </div>

            <div className="p-4 bg-white rounded-lg border">
              <h4 className="font-semibold mb-2">4. Monitor and Iterate</h4>
              <p className="text-sm text-slate-700">
                Run regular audits to track improvements and identify new optimization opportunities. 
                AEO is an ongoing process as search algorithms evolve.
              </p>
            </div>
          </div>
        </div>
      </GuidanceSection>
    </GuidancePage>
  );
}
