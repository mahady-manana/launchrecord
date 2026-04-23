"use client";

import { Button } from "@/components/ui/button";
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
    ChevronDown,
    ChevronRight,
} from "lucide-react";
import { useState } from "react";
import { Issue, IssueCard } from "./IssueCard";
import { IssuesStatusSummary } from "./IssuesStatusSummary";

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

  const severityOrder = ["critical", "high", "medium", "low"] as const;

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg border p-6">
        <p className="text-gray-600 mb-6">
          Here's what we found that could be improved on your website. Issues
          are prioritized by severity and impact.
        </p>

        <IssuesStatusSummary issues={issues} />

        {severityOrder.map((severity) => {
          const severityIssues = groupedIssues[severity] || [];
          if (severityIssues.length === 0) return null;

          return (
            <div key={severity} className="mb-8">
              <h4 className="text-lg font-semibold capitalize mb-4 flex items-center gap-2">
                 <span className={`w-2 h-2 rounded-full ${
                  severity === 'critical' ? 'bg-red-500' : 
                  severity === 'high' ? 'bg-orange-500' : 
                  severity === 'medium' ? 'bg-yellow-400' : 'bg-blue-500'
                }`} />
                {severity === "low" ? "Improvement Suggestions" : `${severity} Issues`} ({severityIssues.length})
              </h4>

              <div className="space-y-4">
                {severityIssues.map((issue) => {
                  const isExpanded = expandedIssues.has(issue.id);
                  const isLocked = isFree && !issue.isVisibleInFree;

                  return (
                    <div key={issue.id} className="space-y-2">
                       <IssueCard 
                        issue={issue} 
                        isLocked={isLocked} 
                        showDetails={isExpanded || !isLocked} 
                      />
                      
                      {!isLocked && (
                         <Collapsible
                           open={isExpanded}
                           onOpenChange={() => toggleIssue(issue.id)}
                         >
                           <CollapsibleTrigger asChild>
                             <Button
                               variant="ghost"
                               className="w-full justify-center p-0 h-8 text-[11px] text-blue-600 hover:text-blue-800 hover:bg-transparent"
                             >
                               {isExpanded ? "Hide Details" : "Show Deep Analysis"}
                               {isExpanded ? (
                                 <ChevronDown className="w-3 h-3 ml-1" />
                               ) : (
                                 <ChevronRight className="w-3 h-3 ml-1" />
                               )}
                             </Button>
                           </CollapsibleTrigger>
                           <CollapsibleContent>
                           </CollapsibleContent>
                         </Collapsible>
                      )}
                    </div>
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
