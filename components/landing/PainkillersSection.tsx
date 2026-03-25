import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  AlertCircle,
  Award,
  LucideIcon,
  Shield,
  Target,
  Zap,
} from "lucide-react";

interface Painkiller {
  pain: string;
  killer: string;
  solution: string;
  icon: LucideIcon;
}

const painkillers: Painkiller[] = [
  {
    pain: "Your positioning is too feature-heavy. LLMs are categorizing you as a utility, not a leader.",
    killer: "AEO Pulse Diagnostic",
    solution:
      "Discover why you're invisible in 942 of 1,000 buyer intent simulations—and fix it.",
    icon: AlertCircle,
  },
  {
    pain: "You're converging toward commodity territory. Your Differentiation Delta shrinks every week.",
    killer: "Market Position Vector",
    solution:
      "See your Genericity Score and exactly where you overlap with competitors.",
    icon: Target,
  },
  {
    pain: "Momentum is the only thing separating a founder from a dreamer—but you're flying blind.",
    killer: "Founder Proof Vault",
    solution:
      "Track Shipping Consistency, Revenue Velocity, and Social Proof in one dashboard.",
    icon: Award,
  },
  {
    pain: "OpenAI's latest leak overlaps 40% of your roadmap. You didn't see it coming.",
    killer: "AI Threat Radar",
    solution:
      "Get weekly threat alerts with strategic pivots before your moat becomes a commodity.",
    icon: Shield,
  },
  {
    pain: "I have $50,000 to spend, and I spent 20 seconds on your site. I still don't know what you do.",
    killer: "Product Clarity Index",
    solution: "See your Time-to-Aha and why CFOs rate your clarity 2/10.",
    icon: Zap,
  },
];

export function PainkillersSection() {
  return (
    <section className="max-w-6xl mx-auto space-y-12 py-10  md:px-0 px-4">
      <div className="text-center space-y-4">
        <h2 className="text-4xl font-bold text-foreground">
          What Founders Don't Know (But Should)
        </h2>
        <p className="text-lg text-muted-foreground">
          Five blind spots. Five diagnostics. One dashboard.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {painkillers.map((item, idx) => {
          const Icon = item.icon;
          return (
            <Card
              key={idx}
              className="border border-border hover:border-orange-300 transition-colors"
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-2">
                      <Icon className="h-5 w-5 text-orange-600" />
                      <CardTitle className="text-lg text-orange-700">
                        {item.killer}
                      </CardTitle>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div>
                    <p className="text-sm font-medium text-red-600 mb-1">
                      The problem:
                    </p>
                    <p className="text-sm text-muted-foreground italic">
                      "{item.pain}"
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-green-700 mb-1">
                      Your solution:
                    </p>
                    <p className="text-sm text-foreground">{item.solution}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </section>
  );
}
