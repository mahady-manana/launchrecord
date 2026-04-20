"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";

interface Strength {
  statement: string;
  impact: string;
}

interface StrengthsSectionProps {
  strengths: Strength[];
}

export function StrengthsSection({ strengths }: StrengthsSectionProps) {
  if (strengths.length === 0) {
    return (
      <div className="bg-white rounded-lg border p-6">
        <h3 className="text-xl font-semibold mb-4">Strengths</h3>
        <div className="text-center py-8">
          <p className="text-gray-600">No strengths identified yet.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg border p-6">
        <h3 className="text-xl font-semibold mb-4">Your Website Strengths</h3>
        <p className="text-gray-600 mb-6">
          These are the areas where your website is performing well and
          contributing to your conversion potential.
        </p>

        <div className="grid gap-4">
          {strengths.map((strength, index) => (
            <Card key={index} className="border-green-200 bg-green-50">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  {strength.statement}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-start gap-2">
                  <Badge
                    variant="secondary"
                    className="bg-green-100 text-green-800"
                  >
                    Impact
                  </Badge>
                  <p className="text-sm text-gray-700">{strength.impact}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div className="bg-green-50 rounded-lg p-6">
        <h4 className="font-semibold text-green-800 mb-3">
          💪 Keep Building on These Strengths
        </h4>
        <div className="text-sm text-green-700 space-y-2">
          <p>
            Your strengths show what you're doing right. Focus on maintaining
            and enhancing these areas while addressing the issues identified.
          </p>
          <p>
            <strong>Pro tip:</strong> Use your strengths as selling points in
            your marketing and continue to optimize around them.
          </p>
        </div>
      </div>
    </div>
  );
}
