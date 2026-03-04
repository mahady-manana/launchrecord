"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  RefreshCw,
  Trash2,
  AlertCircle,
  CheckCircle,
  Loader2,
  ExternalLink,
  Pause,
  Play,
} from "lucide-react";

interface AuditTask {
  id: string;
  name: string;
  website: string;
  tagline: string;
  description: string;
  status: "pending" | "running" | "completed" | "error";
  progress: number;
  error?: string;
  result?: any;
  productId?: string;
  topics?: string[];
}

interface ActiveAuditsCardProps {
  audits: AuditTask[];
  isProcessingQueue: boolean;
  currentQueueIndex: number;
  totalQueueLength: number;
  onPause: () => void;
  onResume: () => void;
  onRetry: (audit: AuditTask) => void;
  onRemove: (id: string) => void;
}

export function ActiveAuditsCard({
  audits,
  isProcessingQueue,
  currentQueueIndex,
  totalQueueLength,
  onPause,
  onResume,
  onRetry,
  onRemove,
}: ActiveAuditsCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-500";
      case "running":
        return "bg-blue-500 animate-pulse";
      case "completed":
        return "bg-green-500";
      case "error":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <AlertCircle className="h-4 w-4" />;
      case "running":
        return <Loader2 className="h-4 w-4 animate-spin" />;
      case "completed":
        return <CheckCircle className="h-4 w-4" />;
      case "error":
        return <AlertCircle className="h-4 w-4" />;
      default:
        return null;
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <RefreshCw
              className={`h-5 w-5 ${isProcessingQueue ? "animate-spin" : ""}`}
            />
            Active Audits ({audits.length})
          </CardTitle>
          {isProcessingQueue && (
            <div className="flex items-center gap-2">
              <Badge variant="outline">
                Processing: {currentQueueIndex} / {totalQueueLength}
              </Badge>
              <Button
                variant="ghost"
                size="sm"
                onClick={onPause}
                className="h-8 gap-1"
              >
                <Pause className="h-4 w-4" />
                Pause
              </Button>
            </div>
          )}
          {!isProcessingQueue &&
            totalQueueLength > 0 &&
            currentQueueIndex < totalQueueLength && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onResume}
                className="h-8 gap-1"
              >
                <Play className="h-4 w-4" />
                Resume
              </Button>
            )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {audits.map((audit) => (
            <div
              key={audit.id}
              className="flex items-center gap-4 p-4 border rounded-lg bg-muted/50"
            >
              <div
                className={`w-3 h-3 rounded-full ${getStatusColor(audit.status)}`}
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{audit.name}</span>
                  <a
                    href={audit.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-primary"
                  >
                    <ExternalLink className="h-3 w-3" />
                  </a>
                  <Badge variant="outline" className="text-xs">
                    {audit.status}
                  </Badge>
                </div>
                {audit.status === "running" && (
                  <div className="mt-2">
                    <div className="h-2 bg-secondary rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary transition-all duration-300"
                        style={{ width: `${audit.progress}%` }}
                      />
                    </div>
                  </div>
                )}
                {audit.error && (
                  <p className="text-sm text-destructive mt-1">{audit.error}</p>
                )}
                {audit.result && (
                  <p className="text-sm text-green-600 mt-1">
                    Score:{" "}
                    {audit.result.analysis?.overall_assessment
                      ?.composite_score || "N/A"}
                  </p>
                )}
              </div>
              <div className="flex items-center gap-2">
                {audit.status === "error" && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onRetry(audit)}
                  >
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onRemove(audit.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
