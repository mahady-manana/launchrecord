"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, Lightbulb } from "lucide-react";

interface WebsiteSummary {
  overview: string;
  problems: string[];
  solutions: string[];
}

interface WebsiteSummarySectionV2Props {
  summary: WebsiteSummary;
}

export function WebsiteSummarySectionV2({
  summary,
}: WebsiteSummarySectionV2Props) {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg border p-6">
        <h3 className="text-xl font-semibold mb-4">Website Summary</h3>

        {/* Overview */}
        <div className="mb-6">
          <h4 className="font-semibold mb-3">Overview</h4>
          <p className="text-gray-700 leading-relaxed">{summary.overview}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Problems */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-red-500" />
                Problems Identified
              </CardTitle>
            </CardHeader>
            <CardContent>
              {summary.problems.length > 0 ? (
                <ul className="space-y-2">
                  {summary.problems.map((problem, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-red-500 mt-1">•</span>
                      <span className="text-sm text-gray-700">{problem}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-gray-500 italic">
                  No major problems identified
                </p>
              )}
            </CardContent>
          </Card>

          {/* Solutions */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-yellow-500" />
                Solutions Provided
              </CardTitle>
            </CardHeader>
            <CardContent>
              {summary.solutions.length > 0 ? (
                <ul className="space-y-2">
                  {summary.solutions.map((solution, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-green-500 mt-1">•</span>
                      <span className="text-sm text-gray-700">{solution}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-gray-500 italic">
                  No specific solutions highlighted
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Analysis Summary */}
      <div className="bg-blue-50 rounded-lg p-6">
        <h4 className="font-semibold text-blue-800 mb-3">
          📊 Analysis Summary
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="bg-white rounded p-3">
            <div className="font-medium text-blue-800">Problems Found</div>
            <div className="text-2xl font-bold text-blue-600">
              {summary.problems.length}
            </div>
          </div>
          <div className="bg-white rounded p-3">
            <div className="font-medium text-blue-800">Solutions Offered</div>
            <div className="text-2xl font-bold text-blue-600">
              {summary.solutions.length}
            </div>
          </div>
          <div className="bg-white rounded p-3">
            <div className="font-medium text-blue-800">Overall Health</div>
            <div className="text-lg font-bold text-blue-600">
              {summary.problems.length === 0
                ? "Excellent"
                : summary.problems.length <= 2
                  ? "Good"
                  : summary.problems.length <= 5
                    ? "Needs Work"
                    : "Critical"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
