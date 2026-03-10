import {
  AlertCircle,
  Brain,
  Layers,
  FileText,
  Shield,
  CheckCircle,
  TrendingUp,
  LucideIcon,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface FAQ {
  question: string;
  answer: string;
  icon: LucideIcon;
}

const faqs: FAQ[] = [
  {
    question: "What does LaunchRecord do?",
    answer:
      "LaunchRecord is the Strategic Architect's weapon against AI-driven commoditization. We audit your SaaS product using our proprietary SIO-V5 Engine to measure your AEO presence, positioning, clarity, momentum, and proof density. The result? A brutal, data-driven War Briefing that tells you exactly where you're vulnerable and what to fix before competitors or LLMs erase you from the market.",
    icon: FileText,
  },
  {
    question: "What is SIO-V5?",
    answer:
      "SIO-V5 (Sovereign Intelligence Officer, Version 5) is our proprietary multi-agent auditing protocol. It analyzes your product across five clinical pillars and compares it against thousands of other startups. The output is a structured report with your Global Score, a brutal truth summary, and Survival Probability—no fluff, no marketing speak, just cold data.",
    icon: Brain,
  },
  {
    question: "What is SIDL (Sovereign Intelligence Defensibility Ledger)?",
    answer:
      "SIDL is our proprietary framework for measuring startup defensibility in the age of AI. It's the methodology behind every audit we run. SIDL evaluates five pillars: AEO Engine (will LLMs cite you?), Positioning Engine (how different are you from competitors?), Clarity Engine (can we understand you instantly?), Momentum Engine (social proof density), and Proof Engine (hard evidence vs. empty claims). Your SIDL score determines your rank on the Sovereign Leaderboard.",
    icon: Layers,
  },
  {
    question: "Why do I need this?",
    answer:
      "Because 94.2% of founders are invisible to LLMs. Your positioning is probably converging toward commodity territory every week. OpenAI's latest leak might overlap 40% of your roadmap and you didn't see it coming. Growth hacking won't save you. SIO-V5 detects Commodity Risk and Positioning Debt before it's too late. Either you're compounding defensibility, or you're quietly eroding. Which one is on your record?",
    icon: AlertCircle,
  },
  {
    question: "How does the audit work?",
    answer:
      "Submit your URL. Our SIO-V5 Engine scrapes your site and cross-references your positioning against 1,400+ competitors to detect 'Commodity Convergence.' We simulate AEO visibility and run a clarity scan. You receive your War Briefing with a status: JUNK, VULNERABLE, or SOVEREIGN. Then you complete weekly missions to fix your record, upload proof, and climb the Sovereign 100.",
    icon: CheckCircle,
  },
  {
    question: "Who is this for?",
    answer:
      "Sovereign Founders who refuse to be commoditized. If you're building a SaaS and you care about being irreplaceable in the age of AI, this is your weapon. Limited to 100 founding members for March 2026. No brand sponsorships. No generic advice. Just proprietary logic and human-led Proof-of-Work.",
    icon: Shield,
  },
  {
    question: "What happens after I get my War Briefing?",
    answer:
      "You get access to your Sovereign Dashboard where you can track your scores across all five SIDL pillars. Complete weekly Moat Missions to improve your record. Upload proof of shipping, revenue velocity, and social proof. Climb the Sovereign Leaderboard. If you drop out of the Top 20, Tier 3 members get an Emergency Pivot Call. This isn't a one-time audit—it's ongoing defensibility tracking.",
    icon: TrendingUp,
  },
];

export function FAQSection() {
  return (
    <section className="max-w-6xl mx-auto space-y-12 py-16">
      <div className="text-center space-y-4">
        <Badge
          variant="outline"
          className="font-mono text-xs tracking-[0.2em] uppercase py-1.5 px-6 border-primary/50 text-primary bg-primary/5"
        >
          KNOWLEDGE BASE
        </Badge>
        <h2 className="text-4xl font-bold text-foreground">
          Frequently Asked Questions
        </h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Everything you need to know about LaunchRecord, SIO-V5, and the SIDL
          framework.
        </p>
      </div>

      <div className="grid gap-4 max-w-4xl mx-auto">
        {faqs.map((faq, idx) => {
          const Icon = faq.icon;
          return (
            <Card
              key={idx}
              className="border-border hover:border-primary/50 transition-colors"
            >
              <CardHeader>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1 space-y-2">
                    <CardTitle className="text-lg text-foreground">
                      {faq.question}
                    </CardTitle>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  {faq.answer}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </section>
  );
}
