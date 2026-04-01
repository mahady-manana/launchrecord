import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Brain,
  CheckCircle,
  HelpCircle,
  Search,
  Shield,
  ShieldAlert,
  Target,
  TrendingUp,
  Users,
  XCircle,
} from "lucide-react";
import Link from "next/link";

export default function HowScoreWorksPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white py-12 px-4 pt-20">
      <div className="max-w-4xl mx-auto space-y-12">
        {/* Header */}
        <div className="text-center space-y-4">
          <Badge variant="secondary" className="mb-2">
            📊 Transparency First
          </Badge>
          <h1 className="text-4xl font-bold">How Does the SIO Score Work?</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Our AI analyzes your product across multiple dimensions to give you
            a single, actionable score. Here&apos;s what goes into it — and what
            doesn&apos;t.
          </p>
          <div className="pt-4">
            <Link href="/sio-audit">
              <Button
                size="lg"
                className="gap-2 bg-orange-600 hover:bg-orange-700"
              >
                <Brain className="h-5 w-5" />
                Get Your Free Audit
              </Button>
            </Link>
          </div>
        </div>

        {/* What We Measure */}
        <section className="space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-bold">What We Measure</h2>
            <p className="text-muted-foreground">
              Five key areas that determine your visibility in the AI era
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <Target className="h-8 w-8 text-orange-600 mb-2" />
                <CardTitle>Positioning</CardTitle>
                <CardDescription>
                  How clearly you stand out from competitors
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-muted-foreground">
                <p>We analyze:</p>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li>How unique your message is</li>
                  <li>Whether you sound like everyone else</li>
                  <li>Clarity of your value proposition</li>
                  <li>How well you explain what you do</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Search className="h-8 w-8 text-orange-600 mb-2" />
                <CardTitle>AEO Visibility</CardTitle>
                <CardDescription>
                  How often AI chatbots mention your product
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-muted-foreground">
                <p>We check:</p>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li>Presence in ChatGPT responses</li>
                  <li>Mentions in Claude answers</li>
                  <li>Visibility in Perplexity results</li>
                  <li>Overall AI recommendation rate</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Users className="h-8 w-8 text-orange-600 mb-2" />
                <CardTitle>Clarity</CardTitle>
                <CardDescription>
                  How fast visitors understand your product
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-muted-foreground">
                <p>We measure:</p>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li>Time to understand your homepage</li>
                  <li>Message consistency across pages</li>
                  <li>How well you explain the problem you solve</li>
                  <li>Strength of your call-to-action</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <TrendingUp className="h-8 w-8 text-orange-600 mb-2" />
                <CardTitle>Momentum</CardTitle>
                <CardDescription>
                  Signs that your product is gaining traction
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-muted-foreground">
                <p>We look at:</p>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li>Customer reviews and ratings</li>
                  <li>Social proof and testimonials</li>
                  <li>Media mentions and coverage</li>
                  <li>Community engagement signals</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="md:col-span-2">
              <CardHeader>
                <Shield className="h-8 w-8 text-orange-600 mb-2" />
                <CardTitle>Founder Proof Vault</CardTitle>
                <CardDescription>
                  Evidence that you&apos;re building something real
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-muted-foreground">
                <p>We verify:</p>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li>Founder background and credibility</li>
                  <li>Team composition and expertise</li>
                  <li>Funding and investment signals</li>
                  <li>Product development milestones</li>
                  <li>Customer validation and case studies</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* What We Don't Measure */}
        <section className="space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-bold">What We Don&apos;t Measure</h2>
            <p className="text-muted-foreground">
              These factors don&apos;t affect your score
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <Card className="border-red-200 bg-red-50">
              <CardHeader>
                <XCircle className="h-8 w-8 text-red-600 mb-2" />
                <CardTitle>Your Budget</CardTitle>
                <CardDescription>
                  How much you spend on marketing doesn&apos;t matter
                </CardDescription>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                A small startup with clear messaging can outscore a well-funded
                competitor with confusing positioning.
              </CardContent>
            </Card>

            <Card className="border-red-200 bg-red-50">
              <CardHeader>
                <XCircle className="h-8 w-8 text-red-600 mb-2" />
                <CardTitle>Your Age or Size</CardTitle>
                <CardDescription>
                  How long you&apos;ve been around doesn&apos;t affect the score
                </CardDescription>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                We judge your product on its current positioning, not how long
                you&apos;ve been working on it.
              </CardContent>
            </Card>

            <Card className="border-red-200 bg-red-50">
              <CardHeader>
                <XCircle className="h-8 w-8 text-red-600 mb-2" />
                <CardTitle>Your Tech Stack</CardTitle>
                <CardDescription>
                  What technologies you use is irrelevant
                </CardDescription>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                Whether you use React, Vue, or plain HTML — we only care about
                what your customers see.
              </CardContent>
            </Card>

            <Card className="border-red-200 bg-red-50">
              <CardHeader>
                <XCircle className="h-8 w-8 text-red-600 mb-2" />
                <CardTitle>Your Revenue</CardTitle>
                <CardDescription>
                  How much money you make doesn&apos;t influence the score
                </CardDescription>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                A pre-revenue startup can have a better score than a profitable
                company with weak positioning.
              </CardContent>
            </Card>
          </div>
        </section>

        {/* How It Works */}
        <section className="space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-bold">The Process</h2>
            <p className="text-muted-foreground">
              Three simple steps to your score
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex gap-4 items-start">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-orange-600 text-white flex items-center justify-center font-bold">
                1
              </div>
              <div className="flex-1 space-y-2">
                <h3 className="font-semibold text-lg">
                  Enter Your Product URL
                </h3>
                <p className="text-muted-foreground">
                  We&apos;ll analyze your public website — no login required.
                  Our AI scans your landing page, messaging, and positioning.
                </p>
              </div>
            </div>

            <div className="flex gap-4 items-start">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-orange-600 text-white flex items-center justify-center font-bold">
                2
              </div>
              <div className="flex-1 space-y-2">
                <h3 className="font-semibold text-lg">
                  Answer 10 Quick Questions
                </h3>
                <p className="text-muted-foreground">
                  Tell us about your challenges, team, and goals. This helps us
                  contextualize your score and provide relevant recommendations.
                </p>
              </div>
            </div>

            <div className="flex gap-4 items-start">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-orange-600 text-white flex items-center justify-center font-bold">
                3
              </div>
              <div className="flex-1 space-y-2">
                <h3 className="font-semibold text-lg">
                  Get Your Score + Action Plan
                </h3>
                <p className="text-muted-foreground">
                  Receive your SIO score (0-100) with specific, prioritized
                  recommendations to improve your AI visibility and positioning.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Understanding Your Score */}
        <section className="space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-bold">Understanding Your Score</h2>
            <p className="text-muted-foreground">What your number means</p>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-4">
              <div className="w-32 font-semibold text-red-600">0-30</div>
              <div className="flex-1 h-3 bg-red-100 rounded-full overflow-hidden">
                <div className="h-full bg-red-600 w-1/4" />
              </div>
              <div className="w-40 text-sm text-muted-foreground">
                Needs Work
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-32 font-semibold text-orange-600">31-50</div>
              <div className="flex-1 h-3 bg-orange-100 rounded-full overflow-hidden">
                <div className="h-full bg-orange-600 w-2/4" />
              </div>
              <div className="w-40 text-sm text-muted-foreground">
                Getting There
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-32 font-semibold text-yellow-600">51-70</div>
              <div className="flex-1 h-3 bg-yellow-100 rounded-full overflow-hidden">
                <div className="h-full bg-yellow-600 w-3/4" />
              </div>
              <div className="w-40 text-sm text-muted-foreground">
                Solid Foundation
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-32 font-semibold text-green-600">71-85</div>
              <div className="flex-1 h-3 bg-green-100 rounded-full overflow-hidden">
                <div className="h-full bg-green-600 w-4/5" />
              </div>
              <div className="w-40 text-sm text-muted-foreground">
                Strong Position
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-32 font-semibold text-green-700">86-100</div>
              <div className="flex-1 h-3 bg-green-100 rounded-full overflow-hidden">
                <div className="h-full bg-green-700" />
              </div>
              <div className="w-40 text-sm text-muted-foreground">
                Industry Leader
              </div>
            </div>
          </div>
        </section>

        {/* Important Disclaimer */}
        <section className="space-y-6">
          <Card className="border-2 border-blue-200 bg-blue-50">
            <CardHeader>
              <ShieldAlert className="h-8 w-8 text-blue-600 mb-2" />
              <CardTitle>Important: This Is an AI-Powered Estimate</CardTitle>
              <CardDescription>
                Here&apos;s what you need to know
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-3 items-start">
                <HelpCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-blue-900">
                  <strong>The score is an estimate, not a guarantee.</strong>{" "}
                  Our AI analyzes patterns across thousands of products, but
                  it&apos;s not perfect. It might score you higher or lower than
                  a human expert would.
                </p>
              </div>
              <div className="flex gap-3 items-start">
                <HelpCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-blue-900">
                  <strong>We analyze what&apos;s public.</strong> If your best
                  content is behind a login or in a demo, we can&apos;t see it.
                  Your score reflects your public-facing presence only.
                </p>
              </div>
              <div className="flex gap-3 items-start">
                <HelpCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-blue-900">
                  <strong>AI models change.</strong> As AI chatbots update their
                  algorithms, your visibility may change. We update our scoring
                  regularly to reflect these changes.
                </p>
              </div>
              <div className="flex gap-3 items-start">
                <HelpCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-blue-900">
                  <strong>
                    The score is a starting point, not the final word.
                  </strong>{" "}
                  Use it to identify weaknesses and track improvement — but
                  don&apos;t treat it as absolute truth.
                </p>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Why Trust Us */}
        <section className="space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-bold">Why Trust This Score?</h2>
            <p className="text-muted-foreground">
              We&apos;re transparent about our limitations
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <Card>
              <CardContent className="pt-6">
                <CheckCircle className="h-8 w-8 text-green-600 mb-3" />
                <h3 className="font-semibold mb-2">No Pay-to-Play</h3>
                <p className="text-sm text-muted-foreground">
                  Your score can&apos;t be bought. We don&apos;t offer
                  &quot;score improvement&quot; services that would create a
                  conflict of interest.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <CheckCircle className="h-8 w-8 text-green-600 mb-3" />
                <h3 className="font-semibold mb-2">
                  Same Algorithm for Everyone
                </h3>
                <p className="text-sm text-muted-foreground">
                  Every product is scored using the same criteria. No special
                  treatment, no hidden factors.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <CheckCircle className="h-8 w-8 text-green-600 mb-3" />
                <h3 className="font-semibold mb-2">
                  We Admit When We&apos;re Wrong
                </h3>
                <p className="text-sm text-muted-foreground">
                  If our AI makes a mistake, we&apos;ll tell you. Transparency
                  builds trust — perfect scores don&apos;t.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* CTA */}
        <section className="text-center space-y-6 pt-8">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold">Ready to See Your Score?</h2>
            <p className="text-xl text-muted-foreground">
              Get your free audit in 2-4 minutes
            </p>
          </div>
          <Link href="/sio-audit">
            <Button
              size="lg"
              className="gap-2 bg-orange-600 hover:bg-orange-700"
            >
              <Brain className="h-5 w-5" />
              Start Your Free Audit
            </Button>
          </Link>
          <p className="text-sm text-muted-foreground pt-4">
            No credit card required • Results in 2-4 minutes • 100% free
          </p>
        </section>
      </div>
    </div>
  );
}
