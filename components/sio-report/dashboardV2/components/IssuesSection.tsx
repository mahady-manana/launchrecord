"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  AlertCircle,
  AlertTriangle,
  ChevronDown,
  ChevronRight,
  Info,
  Lock,
} from "lucide-react";
import { useState } from "react";

interface Issue {
  id: string;
  category: "positioning" | "clarity" | "first_impression" | "aeo";
  metricKey?: string;
  severity: "critical" | "high" | "medium" | "low";
  statement: string;
  explanation?: string;
  current?: string;
  recommendations: string[];
  fixes: string[];
  isVisibleInFree?: boolean;
  isFixLocked?: boolean;
  impactScore?: number;
}

interface IssuesSectionProps {
  issues: Issue[];
  isFree?: boolean;
}

export function IssuesSection({ issues, isFree = false }: IssuesSectionProps) {
  const [expandedIssues, setExpandedIssues] = useState<Set<string>>(new Set());

  const toggleIssue = (issueId: string) => {
    const newExpanded = new Set(expandedIssues);
    if (newExpanded.has(issueId)) {
      newExpanded.delete(issueId);
    } else {
      newExpanded.add(issueId);
    }
    setExpandedIssues(newExpanded);
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case "critical":
        return <AlertTriangle className="w-4 h-4 text-red-600" />;
      case "high":
        return <AlertTriangle className="w-4 h-4 text-orange-600" />;
      case "medium":
        return <AlertCircle className="w-4 h-4 text-yellow-600" />;
      case "low":
        return <Info className="w-4 h-4 text-blue-500" />;
      default:
        return <Info className="w-4 h-4 text-gray-500" />;
    }
  };

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case "critical":
        return <Badge variant="destructive">CRITICAL</Badge>;
      case "high":
        return (
          <Badge className="bg-orange-100 text-orange-800 border-orange-200">
            HIGH
          </Badge>
        );
      case "medium":
        return <Badge variant="secondary">MEDIUM</Badge>;
      case "low":
        return <Badge variant="outline">LOW</Badge>;
      default:
        return <Badge variant="outline">{severity.toUpperCase()}</Badge>;
    }
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      positioning: "bg-green-100 text-green-800",
      clarity: "bg-blue-100 text-blue-800",
      first_impression: "bg-purple-100 text-purple-800",
      aeo: "bg-orange-100 text-orange-800",
    };
    return (
      colors[category as keyof typeof colors] || "bg-gray-100 text-gray-800"
    );
  };

  // Group issues by severity
  const groupedIssues = issues.reduce(
    (acc, issue) => {
      if (!acc[issue.severity]) {
        acc[issue.severity] = [];
      }
      acc[issue.severity].push(issue);
      return acc;
    },
    {} as Record<string, Issue[]>,
  );

  const severityOrder = ["critical", "high", "medium", "low"];

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg border p-6">
        <h3 className="text-xl font-semibold mb-4">Issues & Recommendations</h3>
        <p className="text-gray-600 mb-6">
          Here's what we found that could be improved on your website. Issues
          are prioritized by severity and impact.
        </p>

        {severityOrder.map((severity) => {
          const severityIssues = groupedIssues[severity] || [];
          if (severityIssues.length === 0) return null;

          return (
            <div key={severity} className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                {getSeverityIcon(severity)}
                <h4 className="text-lg font-semibold capitalize">
                  {severity} Issues ({severityIssues.length})
                </h4>
              </div>

              <div className="space-y-4">
                {severityIssues.map((issue) => {
                  const isExpanded = expandedIssues.has(issue.id);
                  const isLocked = isFree && !issue.isVisibleInFree;

                  return (
                    <Card
                      key={issue.id}
                      className={isLocked ? "opacity-60" : ""}
                    >
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              {getSeverityBadge(issue.severity)}
                              <Badge
                                className={getCategoryColor(issue.category)}
                              >
                                {issue.category.replace("_", " ").toUpperCase()}
                              </Badge>
                              {issue.metricKey && (
                                <Badge variant="outline">
                                  {issue.metricKey.replace("_", " ")}
                                </Badge>
                              )}
                            </div>
                            <CardTitle className="text-base">
                              {issue.statement}
                            </CardTitle>
                            {issue.explanation && (
                              <p className="text-sm text-gray-600 mt-1">
                                {issue.explanation}
                              </p>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            {issue.impactScore && (
                              <span className="text-sm font-medium text-gray-500">
                                Impact: {issue.impactScore}
                              </span>
                            )}
                            {isLocked && (
                              <Lock className="w-4 h-4 text-gray-400" />
                            )}
                          </div>
                        </div>
                      </CardHeader>

                      <CardContent>
                        {isLocked ? (
                          <div className="text-center py-4">
                            <Lock className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                            <p className="text-sm text-gray-600">
                              Upgrade to see detailed recommendations and fixes
                            </p>
                          </div>
                        ) : (
                          <Collapsible
                            open={isExpanded}
                            onOpenChange={() => toggleIssue(issue.id)}
                          >
                            <CollapsibleTrigger asChild>
                              <Button
                                variant="ghost"
                                className="w-full justify-between p-0 h-auto"
                              >
                                <span className="text-sm text-blue-600 hover:text-blue-800">
                                  {isExpanded ? "Hide" : "Show"} Details &
                                  Recommendations
                                </span>
                                {isExpanded ? (
                                  <ChevronDown className="w-4 h-4" />
                                ) : (
                                  <ChevronRight className="w-4 h-4" />
                                )}
                              </Button>
                            </CollapsibleTrigger>

                            <CollapsibleContent className="space-y-4 mt-4">
                              {issue.current && (
                                <div>
                                  <h5 className="font-medium text-sm mb-2">
                                    Current State:
                                  </h5>
                                  <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded">
                                    {issue.current}
                                  </p>
                                </div>
                              )}

                              {issue.recommendations.length > 0 && (
                                <div>
                                  <h5 className="font-medium text-sm mb-2">
                                    Recommendations:
                                  </h5>
                                  <ul className="space-y-1">
                                    {issue.recommendations.map((rec, idx) => (
                                      <li
                                        key={idx}
                                        className="text-sm text-gray-700 flex items-start gap-2"
                                      >
                                        <span className="text-blue-500 mt-1">
                                          •
                                        </span>
                                        {rec}
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              )}

                              {issue.fixes.length > 0 && (
                                <div>
                                  <h5 className="font-medium text-sm mb-2">
                                    Suggested Fixes:
                                  </h5>
                                  <ul className="space-y-1">
                                    {issue.fixes.map((fix, idx) => (
                                      <li
                                        key={idx}
                                        className="text-sm text-gray-700 flex items-start gap-2"
                                      >
                                        <span className="text-green-500 mt-1">
                                          ✓
                                        </span>
                                        {fix}
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                            </CollapsibleContent>
                          </Collapsible>
                        )}
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          );
        })}

        {issues.length === 0 && (
          <div className="text-center py-12">
            <div className="text-green-500 text-6xl mb-4">✓</div>
            <h4 className="text-lg font-semibold text-gray-900 mb-2">
              No Issues Found!
            </h4>
            <p className="text-gray-600">
              Your website looks great. No critical issues were identified.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
