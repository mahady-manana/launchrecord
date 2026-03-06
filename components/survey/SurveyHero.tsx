import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Globe, Loader2, CheckCircle } from "lucide-react";

interface ExistingProduct {
  id: string;
  name: string;
  website: string;
  addedByAdmin: boolean;
}

interface SurveyHeroProps {
  saasUrl: string;
  onUrlChange: (url: string) => void;
  onSubmit: () => void;
  isLoading: boolean;
  checkingProduct: boolean;
}

export function SurveyHero({
  saasUrl,
  onUrlChange,
  onSubmit,
  isLoading,
  checkingProduct,
}: SurveyHeroProps) {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && saasUrl) {
      onSubmit();
    }
  };

  const isDisabled = !saasUrl || isLoading || checkingProduct;

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white py-12 px-4">
      <div className="max-w-2xl mx-auto text-center space-y-8">

        <div className="space-y-4">
          <h1 className="text-4xl font-bold text-foreground">
            Get your SIO-V5 Audit Report
          </h1>
          <p className="text-xl text-muted-foreground">
            Discover your positioning weaknesses, AEO visibility, Product
            Clarity and how to become irreplaceable
          </p>
        </div>

        <Card className="border-2 border-orange-200 shadow-xl">
          <CardHeader>
            <CardTitle className="text-2xl">Start with your product URL</CardTitle>
            <CardDescription className="text-base">
              We&apos;ll analyze your website and generate a comprehensive audit
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="saasUrl" className="text-base text-left">
                Product Website
              </Label>
              <div className="relative">
                <Globe className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                <Input
                  id="saasUrl"
                  type="url"
                  placeholder="https://yourproduct.com"
                  value={saasUrl}
                  onChange={(e) => onUrlChange(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="pl-10 h-12 text-base"
                  autoFocus
                />
              </div>
            </div>

            <Button
              onClick={onSubmit}
              disabled={isDisabled}
              className="w-full h-12 text-lg bg-orange-600 hover:bg-orange-700"
            >
              {checkingProduct ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Checking...
                </>
              ) : isLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Starting...
                </>
              ) : (
                <>
                  <CheckCircle className="mr-2 h-5 w-5" />
                  Start SIO-V5 Audit
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-3 gap-6 pt-8">
          <Card>
            <CardContent className="pt-6 text-center">
              <div className="text-3xl mb-2">🎯</div>
              <div className="font-semibold">Positioning Score</div>
              <div className="text-sm text-muted-foreground">
                See how you compare
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <div className="text-3xl mb-2">🤖</div>
              <div className="font-semibold">AEO Visibility</div>
              <div className="text-sm text-muted-foreground">
                AI chatbot presence
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <div className="text-3xl mb-2">📊</div>
              <div className="font-semibold">Action Plan</div>
              <div className="text-sm text-muted-foreground">
                3 priority missions
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
