import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  AlertCircle,
  BarChart3,
  Clock,
  FileText,
  Globe,
  Zap,
} from "lucide-react";

interface AuditStartCardProps {
  onStartAudit: () => void;
}

export function AuditStartCard({ onStartAudit }: AuditStartCardProps) {
  return (
    <Card className="border-2 border-orange-200 shadow-xl">
      <CardHeader className="text-center pb-8">
        <CardTitle className="text-3xl">
          Ready to Analyze Your SaaS?
        </CardTitle>
        <CardDescription className="text-lg max-w-2xl mx-auto">
          Get a comprehensive SIO-V5 defensibility audit covering AEO
          visibility, positioning sharpness, clarity velocity, momentum signals,
          and founder proof.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        {/* What You'll Get */}
        <div className="text-center">
          <h3 className="font-semibold text-orange-800 mb-4">
            What Your Audit Includes
          </h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="flex items-start gap-4 p-4 rounded-lg bg-orange-50 text-left">
              <Globe className="h-6 w-6 text-orange-600 mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-orange-800">AEO Index</h3>
                <p className="text-sm text-orange-700">
                  Visibility across ChatGPT, Claude, Perplexity and AI
                  assistants
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-4 rounded-lg bg-orange-50 text-left">
              <BarChart3 className="h-6 w-6 text-orange-600 mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-orange-800">
                  Positioning Sharpness
                </h3>
                <p className="text-sm text-orange-700">
                  Category definition and competitive differentiation analysis
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-4 rounded-lg bg-orange-50 text-left">
              <Clock className="h-6 w-6 text-orange-600 mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-orange-800">
                  Clarity Velocity
                </h3>
                <p className="text-sm text-orange-700">
                  Message clarity and time-to-value communication
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-4 rounded-lg bg-orange-50 text-left">
              <FileText className="h-6 w-6 text-orange-600 mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-orange-800">
                  Founder Proof Vault
                </h3>
                <p className="text-sm text-orange-700">
                  Why you&apos;re the one to solve this problem
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Why This Matters */}
        <div className="bg-gradient-to-r from-orange-100 to-amber-100 rounded-lg p-6 border border-orange-200">
          <h3 className="font-semibold text-orange-800 mb-2 flex items-center gap-2">
            <AlertCircle className="h-5 w-5" />
            Why This Audit Matters
          </h3>
          <p className="text-sm text-orange-700 leading-relaxed">
            In today&apos;s AI-driven market, 73% of B2B buyers use AI
            assistants to research solutions. If your SaaS isn&apos;t visible in
            AI recommendations, you&apos;re losing customers before they even
            reach your website. This audit identifies exactly where you stand
            and what to fix.
          </p>
        </div>

        {/* Start Button */}
        <div className="flex justify-center pt-4">
          <Button
            onClick={onStartAudit}
            size="lg"
            className="bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-lg px-12 py-6"
          >
            <Zap className="h-5 w-5 mr-2" />
            Start Audit
          </Button>
        </div>

        {/* Info */}
        <div className="text-center text-sm text-muted-foreground">
          <p className="flex items-center justify-center gap-2">
            <Clock className="h-4 w-4" />
            Audit takes approximately 30-60 seconds
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
