"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface CategoryInsights {
  positioning: { statement: string; summary: string };
  clarity: { statement: string; summary: string };
  first_impression: { statement: string; summary: string };
  aeo: { statement: string; summary: string };
}

interface CategoryInsightsSectionProps {
  insights: CategoryInsights;
}

export function CategoryInsightsSection({
  insights,
}: CategoryInsightsSectionProps) {
  const categories = [
    {
      key: "positioning" as const,
      title: "Positioning Analysis",
      icon: "🎯",
      color: "bg-green-100 text-green-800",
      description:
        "How well you own your market category and differentiate from competitors",
    },
    {
      key: "clarity" as const,
      title: "Clarity Assessment",
      icon: "💡",
      color: "bg-blue-100 text-blue-800",
      description:
        "How clear and compelling your messaging and value proposition are",
    },
    {
      key: "first_impression" as const,
      title: "First Impression",
      icon: "👁️",
      color: "bg-purple-100 text-purple-800",
      description: "The immediate impact of your hero section and headline",
    },
    {
      key: "aeo" as const,
      title: "AEO Analysis",
      icon: "🤖",
      color: "bg-orange-100 text-orange-800",
      description:
        "Artificial Engine Optimization - how well your site performs for AI search",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg border p-6">
        <h3 className="text-xl font-semibold mb-4">Category Insights</h3>
        <p className="text-gray-600 mb-6">
          Detailed analysis of each key category that impacts your website's
          conversion potential.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {categories.map((category) => {
            const insight = insights[category.key];
            return (
              <Card key={category.key} className="h-full">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-2xl">{category.icon}</span>
                    <Badge className={category.color}>{category.title}</Badge>
                  </div>
                  <CardTitle className="text-lg">{category.title}</CardTitle>
                  <p className="text-sm text-gray-600">
                    {category.description}
                  </p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h5 className="font-medium text-sm mb-2">Key Finding:</h5>
                    <p className="text-sm text-gray-700 leading-relaxed">
                      {insight.statement}
                    </p>
                  </div>

                  <div>
                    <h5 className="font-medium text-sm mb-2">
                      Detailed Analysis:
                    </h5>
                    <p className="text-sm text-gray-700 leading-relaxed">
                      {insight.summary}
                    </p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      <div className="bg-gray-50 rounded-lg p-6">
        <h4 className="font-semibold mb-3">🔍 Understanding Category Scores</h4>
        <div className="text-sm text-gray-600 space-y-2">
          <p>
            <strong>Positioning:</strong> Your market position and competitive
            differentiation
          </p>
          <p>
            <strong>Clarity:</strong> How well visitors understand your value
            proposition
          </p>
          <p>
            <strong>First Impression:</strong> The immediate impact of your
            landing experience
          </p>
          <p>
            <strong>AEO:</strong> Optimization for AI search engines and
            assistants
          </p>
        </div>
        <div className="mt-4 p-3 bg-white rounded border-l-4 border-blue-500">
          <p className="text-sm">
            <strong>💡 Tip:</strong> Focus improvement efforts on categories
            with the lowest scores first, as they typically have the highest
            impact on conversion rates.
          </p>
        </div>
      </div>
    </div>
  );
}
