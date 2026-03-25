import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function SocialProofSection() {
  return (
    <section className="max-w-6xl  md:px-0 px-4 mx-auto text-center space-y-8 py-12 border-t border-border">
      <h3 className="text-2xl font-semibold text-foreground">
        For Founders Who Refuse to Be Commoditized
      </h3>
      <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
        LaunchRecord is the Strategic Architect's weapon against AI-driven
        commoditization. Join founding members before the leaderboard fills.
      </p>
      <div className="flex flex-col items-center gap-6">
        <Link href="/survey">
          <Button className="h-14 px-10 bg-orange-600 hover:bg-orange-700 rounded-none font-bold uppercase tracking-wide text-lg">
            Get Started Now
          </Button>
        </Link>
        <div className="flex flex-wrap justify-center gap-4">
          <Badge variant="outline" className="px-4 py-2">
            🔒 No brand sponsorships
          </Badge>
          <Badge variant="outline" className="px-4 py-2">
            🎯 Proprietary logic only
          </Badge>
          <Badge variant="outline" className="px-4 py-2">
            📊 Human-led Proof-of-Work
          </Badge>
        </div>
      </div>
    </section>
  );
}
