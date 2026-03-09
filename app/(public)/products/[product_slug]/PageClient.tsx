"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ArrowLeft,
  BarChart3,
  Calendar,
  Crown,
  ExternalLink,
  Globe,
  Layers,
  Shield,
  Target,
  TrendingUp,
  Zap,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface Report {
  id: string;
  score: number;
  createdAt: string;
}

interface ProductData {
  id: string;
  name: string;
  tagline?: string | null;
  description?: string | null;
  logo?: string | null;
  website?: string | null;
  score: number;
  topics: Array<{ _id: string; name: string }>;
  createdAt: string;
  updatedAt: string;
  latestReport: any | null;
  historicalReports: Report[];
  rank: number;
}

interface ProductPageClientProps {
  initialData: ProductData;
}

export default function ProductPageClient({
  initialData,
}: ProductPageClientProps) {
  const product = initialData;

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-green-600 bg-green-50 border-green-200";
    if (score >= 70) return "text-blue-600 bg-blue-50 border-blue-200";
    if (score >= 40) return "text-orange-600 bg-orange-50 border-orange-200";
    return "text-red-600 bg-red-50 border-red-200";
  };

  const getStatusLabel = (score: number) => {
    if (score >= 90) return "UNTOUCHABLE";
    if (score >= 70) return "LETHAL";
    if (score >= 40) return "PLASTIC";
    if (score >= 20) return "ZOMBIE";
    return "GHOST";
  };

  const pillarIcons: Record<string, any> = {
    aeo_index: Globe,
    positioning_sharpness: Target,
    clarity_velocity: Zap,
    momentum_signal: TrendingUp,
    founder_proof_vault: Shield,
  };

  const pillarLabels: Record<string, string> = {
    aeo_index: "AEO Presence",
    positioning_sharpness: "Positioning",
    clarity_velocity: "Product Clarity",
    momentum_signal: "Momentum",
    founder_proof_vault: "Proof Vault",
  };

  return (
    <div className="min-h-screen bg-gradient-to-br pt-6 from-slate-50 via-white to-primary/5">
      {/* Header */}
      <div className="bg-slate-100 max-w-6xl mx-auto rounded-xl">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="flex items-center gap-4 mb-6">
            <Link href="/leaderboard">
              <Button variant="ghost" size="sm" className="hover:bg-white/20">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
            </Link>
          </div>

          <div className="flex items-start justify-between gap-8">
            <div className="flex-1">
              <div className="flex items-start gap-4">
                {/* Logo */}
                <div className="relative h-24 w-24 rounded-2xl overflow-hidden border-4 border-white/20 bg-white flex-shrink-0">
                  {product.logo ? (
                    <Image
                      src={product.logo}
                      alt={product.name}
                      fill
                      className="object-cover p-2"
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-white/20 to-white/10">
                      <Crown className="h-12 w-12 text-white" />
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1">
                  <h1 className="text-4xl font-black tracking-tight mb-2">
                    {product.name}
                  </h1>
                  {product.tagline && (
                    <p className="text-xl  mb-4">{product.tagline}</p>
                  )}
                  <div className="flex items-center gap-4 flex-wrap">
                    {product.website && (
                      <a
                        href={product.website + "?ref=launchrecord.com"}
                        target="_blank"
                        rel="noopener"
                        className="flex items-center bg-secondary p-2 px-4 rounded-full text-white gap-2 text-sm hover:text-white transition-colors"
                      >
                        <ExternalLink className="h-4 w-4" />
                        <span>Visit Website</span>
                      </a>
                    )}
                    {product.topics && product.topics.length > 0 && (
                      <div className="flex gap-2">
                        {product.topics.slice(0, 5).map((topic) => (
                          <Link
                            key={topic._id}
                            href={`/categories/${topic.name.toLowerCase().replace(/\s+/g, "-")}`}
                          >
                            <Badge className="bg-slate-200 text-slate-600 hover:bg-slate-300">
                              {topic.name}
                            </Badge>
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Score Display */}
            <div className="text-center">
              <div
                className={`w-32 h-32 rounded-full flex items-center justify-center border-4 bg-white ${getScoreColor(
                  product.score,
                )}`}
              >
                <div>
                  <div className="text-5xl font-black">{product.score}</div>
                  <div className="text-xs font-bold uppercase tracking-wider mt-1">
                    Score
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
        {/* Pillars Grid */}
        {product.latestReport && (
          <section>
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <BarChart3 className="h-6 w-6" />
              SIO-V5 Analysis
            </h2>
            <div className="grid md:grid-cols-5 gap-4">
              {Object.entries(product.latestReport)
                .filter(([key]) =>
                  [
                    "aeo_index",
                    "positioning_sharpness",
                    "clarity_velocity",
                    "momentum_signal",
                    "founder_proof_vault",
                  ].includes(key),
                )
                .map(([key, pillar]: [string, any]) => {
                  const Icon = pillarIcons[key] || BarChart3;
                  const label = pillarLabels[key] || key;
                  const score = pillar.score || 0;

                  return (
                    <Card
                      key={key}
                      className="hover:shadow-md transition-shadow"
                    >
                      <CardHeader className="pb-3">
                        <div className="flex items-center gap-2 mb-2">
                          <Icon className="h-5 w-5 text-primary" />
                          <CardTitle className="text-sm font-semibold">
                            {label}
                          </CardTitle>
                        </div>
                        <div
                          className={`text-3xl font-black ${getScoreColor(score).split(" ")[0]}`}
                        >
                          {score}
                        </div>
                      </CardHeader>
                      <CardContent>
                        {pillar.critique && (
                          <p className="text-xs text-muted-foreground line-clamp-3">
                            {pillar.critique}
                          </p>
                        )}
                      </CardContent>
                    </Card>
                  );
                })}
            </div>
          </section>
        )}

        {/* Historical Performance */}
        {product.historicalReports.length > 1 && (
          <section>
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <Calendar className="h-6 w-6" />
              Historical Performance
            </h2>
            <Card>
              <CardContent className="p-0">
                <div className="divide-y">
                  {product.historicalReports.map((report, index) => (
                    <div
                      key={report.id}
                      className="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          {index === 0 ? (
                            <Badge className="bg-green-100 text-green-700">
                              Latest
                            </Badge>
                          ) : (
                            <span className="text-sm text-muted-foreground">
                              {index + 1} audits ago
                            </span>
                          )}
                        </div>
                        <span className="text-sm text-muted-foreground">
                          {new Date(report.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <div
                        className={`font-bold ${getScoreColor(report.score).split(" ")[0]}`}
                      >
                        Score: {report.score}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </section>
        )}

        {/* Product Details */}
        {product.description && (
          <section>
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <Layers className="h-6 w-6" />
              About
            </h2>
            <Card>
              <CardContent className="pt-6">
                <p className="text-muted-foreground leading-relaxed">
                  {product.description}
                </p>
              </CardContent>
            </Card>
          </section>
        )}

        {/* Actions */}
        <section className="flex gap-4">
          {product.website && (
            <Link
              href={product.website + "?ref=launchrecord.com"}
              target="_blank"
              rel="noopener"
            >
              <Button variant="outline" size="lg" className="gap-2">
                <Globe className="h-5 w-5" />
                Visit Website
              </Button>
            </Link>
          )}
        </section>
      </div>
    </div>
  );
}
