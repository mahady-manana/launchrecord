"use client";

import { JSONLD } from "@/components/JsonLd";
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
import { useEffect, useState } from "react";

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

interface ProductCardProps {
  product: {
    _id: string;
    id: string;
    name: string;
    tagline?: string | null;
    logo?: string | null;
    website?: string | null;
    score: number;
    slug: string;
  };
}

interface ProductPageClientProps {
  initialData: ProductData;
  jsonLd?: Record<string, any> | null;
}

function ProductCard({ product }: ProductCardProps) {
  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-green-600";
    if (score >= 70) return "text-blue-600";
    if (score >= 40) return "text-orange-600";
    return "text-red-600";
  };

  const productUrl = product.slug;

  return (
    <Link href={`/products/${productUrl}`}>
      <Card className="hover:shadow-md transition-shadow py-0 h-full">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div className="relative h-8 w-8 rounded-lg overflow-hidden border bg-white flex-shrink-0">
              {product.logo ? (
                <Image
                  src={product.logo}
                  alt={product.name}
                  height={32}
                  width={32}
                  className="object-cover p-1"
                />
              ) : (
                <div className="h-full w-full flex items-center justify-center bg-slate-100">
                  <Crown className="h-6 w-6 text-slate-400" />
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-sm truncate">{product.name}</h3>
              {product.tagline && (
                <p className="text-xs text-muted-foreground mt-1">
                  {product.tagline}
                </p>
              )}
              <div className="flex items-center gap-2 mt-2">
                <span
                  className={`text-sm font-black ${getScoreColor(product.score)}`}
                >
                  {product.score}
                </span>
                <Badge variant="outline" className="text-[10px] h-5 px-1.5">
                  Score
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

export default function ProductPageClient({
  initialData,
  jsonLd,
}: ProductPageClientProps) {
  const product = initialData;
  const [similarProducts, setSimilarProducts] = useState<any[]>([]);
  const [newProducts, setNewProducts] = useState<any[]>([]);
  const [topProducts, setTopProducts] = useState<any[]>([]);

  useEffect(() => {
    async function fetchRecommendations() {
      try {
        const currentSlug = product.id;

        const [similarRes, newRes, topRes] = await Promise.all([
          fetch(
            `/api/products/recommendations?type=similar&slug=${currentSlug}`,
          ),
          fetch(`/api/products/recommendations?type=new&slug=${currentSlug}`),
          fetch(`/api/products/recommendations?type=top&slug=${currentSlug}`),
        ]);

        const similarData = await similarRes.json();
        const newData = await newRes.json();
        const topData = await topRes.json();

        // Shuffle and take 10
        const shuffle = (arr: any[]) => arr.sort(() => Math.random() - 0.5);

        setSimilarProducts(shuffle(similarData.products || []).slice(0, 10));
        setNewProducts(shuffle(newData.products || []).slice(0, 10));
        setTopProducts(shuffle(topData.products || []).slice(0, 10));
      } catch (error) {
        console.error("Error fetching recommendations:", error);
      }
    }

    fetchRecommendations();
  }, [product.id, product.website]);

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
    <>
      {jsonLd && <JSONLD data={jsonLd} />}
      <div className="min-h-screen bg-gradient-to-br pt-6 from-slate-50 via-white to-primary/5">
        {/* Header */}
        <div className="relative bg-slate-100 max-w-6xl mx-auto rounded-xl">
          <div className="max-w-6xl mx-auto px-4 py-8">
            <div className="flex items-center gap-4 mb-6">
              <Link href="/leaderboard">
                <Button variant="ghost" size="sm" className="hover:bg-white/20">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back
                </Button>
              </Link>
            </div>

            <div className="md:flex items-start justify-between gap-8">
              <div className="flex-1">
                <div className="flex items-start gap-4">
                  {/* Logo */}
                  <div className="relative flex items-center justify-center md:h-18 md:w-18 w-12 h-12 rounded-2xl overflow-hidden border-4 border-white/20 bg-white flex-shrink-0">
                    {product.logo ? (
                      <Image
                        src={product.logo}
                        alt={product.name}
                        width={40}
                        height={40}
                        className="object-cover  h-8 w-8 p-2"
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
                        <div className="flex md:flex-row flex-col gap-2">
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
              <div className="text-center md:relative absolute md:top-[unset] md:right-[unset] top-5 right-5">
                <div
                  className={`md:w-32 md:h-32 w-20 h-20 rounded-full flex items-center justify-center border-4 bg-white ${getScoreColor(
                    product.score,
                  )}`}
                >
                  <div>
                    <div className="md:text-5xl text-2xl font-black">
                      {product.score || "X"}
                    </div>
                    <div className="text-xs font-bold uppercase tracking-wider mt-1">
                      {product.score ? "Score" : "No score"}
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
                <CardContent className="">
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

          {/* Similar Products */}
          {similarProducts.length > 0 && (
            <section>
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <Target className="h-6 w-6" />
                Similar Products
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                {similarProducts.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            </section>
          )}

          {/* New Products */}
          {newProducts.length > 0 && (
            <section>
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <Zap className="h-6 w-6" />
                New Products
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                {newProducts.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            </section>
          )}

          {/* Top Products */}
          {topProducts.length > 0 && (
            <section>
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <Crown className="h-6 w-6" />
                Top Products
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                {topProducts.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </>
  );
}
