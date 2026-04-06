"use client";

import { cn } from "@/lib/utils";
import { Terminal } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

export interface AuditStep {
  id: string;
  name: string;
  metrics?: string[];
  subMetrics?: string[];
}

export interface TerminalAuditLoaderProps {
  command?: string;
  steps: AuditStep[];
  onComplete?: () => void;
  className?: string;
}

interface TerminalLine {
  id: string;
  type:
    | "command"
    | "info"
    | "success"
    | "error"
    | "metric"
    | "submetric"
    | "separator";
  content: string;
  timestamp: number;
}

export function TerminalAuditLoader({
  command = "sio audit --full url 'https://example.com'",
  steps,
  onComplete,
  className,
}: TerminalAuditLoaderProps) {
  const [lines, setLines] = useState<TerminalLine[]>([]);
  const [isComplete, setIsComplete] = useState(false);
  const [currentPrompt, setCurrentPrompt] = useState("");
  const terminalRef = useRef<HTMLDivElement>(null);
  const lineIdRef = useRef(0);

  const addLine = useCallback((type: TerminalLine["type"], content: string) => {
    const newLine: TerminalLine = {
      id: `line-${++lineIdRef.current}`,
      type,
      content,
      timestamp: Date.now(),
    };
    setLines((prev) => [...prev, newLine]);
  }, []);

  // Auto-scroll to bottom
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [lines]);

  // Simulate terminal output
  useEffect(() => {
    let cancelled = false;
    const delays: NodeJS.Timeout[] = [];

    const schedule = (fn: () => void, delay: number) => {
      const timeout = setTimeout(() => {
        if (!cancelled) fn();
      }, delay);
      delays.push(timeout);
      return timeout;
    };

    // Initial prompt
    schedule(() => {
      setCurrentPrompt("sio-v5@LAUNCHRECORD:~/sio-audit$");
      addLine("command", command);
    }, 300);

    // Process each step
    // Total duration target: ~3.5 minutes (210,000ms)
    let cumulativeDelay = 1000;
    const totalSteps = steps.length;
    const timePerStep = Math.floor(200000 / totalSteps); // ~40s per step for 5 steps

    steps.forEach((step, stepIndex) => {
      const isLast = stepIndex === steps.length - 1;
      const stepStartOffset = stepIndex * timePerStep;

      // Step header
      schedule(
        () => addLine("info", `\n▶ Starting: ${step.name}...`),
        cumulativeDelay + stepStartOffset,
      );

      // Metrics
      if (step.metrics) {
        const timePerMetric = Math.floor(timePerStep / step.metrics.length);

        step.metrics.forEach((metric, metricIndex) => {
          const hasError = Math.random() < 0.08; // 8% chance of error for realism
          const metricOffset =
            stepStartOffset + 2000 + metricIndex * timePerMetric;

          schedule(
            () => addLine("metric", `  ${hasError ? "✗" : "✓"} ${metric}`),
            cumulativeDelay + metricOffset,
          );

          // Sub-metrics
          if (step.subMetrics && !hasError) {
            const relevantSubMetrics = step.subMetrics.filter(
              (_, i) => i % (step.metrics?.length || 1) === metricIndex,
            );

            relevantSubMetrics.forEach((sub, subIndex) => {
              schedule(
                () => addLine("submetric", `    └─ ${sub}`),
                cumulativeDelay + metricOffset + 1500 + subIndex * 800,
              );
            });
          }

          // Add occasional error with retry
          if (hasError) {
            schedule(
              () =>
                addLine("error", `    ⚠ Warning: Retry required for ${metric}`),
              cumulativeDelay + metricOffset + 2000,
            );
            schedule(
              () => addLine("success", `    ✓ Retry successful`),
              cumulativeDelay + metricOffset + 3500,
            );
          }
        });
      }

      // Step completion
      schedule(
        () => addLine("success", `✔ Completed: ${step.name}`),
        cumulativeDelay + stepStartOffset + timePerStep - 1000,
      );

      // Separator between steps
      if (!isLast) {
        schedule(
          () => addLine("separator", "─".repeat(60)),
          cumulativeDelay + stepStartOffset + timePerStep - 500,
        );
      }
    });

    // Final completion at ~3.5 minutes
    schedule(() => {
      addLine("separator", "═".repeat(60));
      addLine("success", "\n✔ Audit complete. Generating report...");
      setIsComplete(true);
      onComplete?.();
    }, 210000); // 3.5 minutes total

    return () => {
      cancelled = true;
      delays.forEach(clearTimeout);
    };
  }, [command, steps, onComplete, addLine]);

  const getLineColor = (type: TerminalLine["type"]): string => {
    switch (type) {
      case "command":
        return "text-emerald-400 font-semibold";
      case "info":
        return "text-blue-400";
      case "success":
        return "text-emerald-400";
      case "error":
        return "text-red-400";
      case "metric":
        return "text-slate-200";
      case "submetric":
        return "text-slate-400";
      case "separator":
        return "text-slate-600";
      default:
        return "text-slate-300";
    }
  };

  return (
    <div
      className={cn(
        "rounded-lg overflow-hidden border border-slate-800 bg-slate-950 shadow-2xl",
        className,
      )}
    >
      {/* Terminal Header */}
      <div className="flex items-center gap-2 px-4 py-3 bg-slate-900 border-b border-slate-800">
        <div className="flex gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500" />
          <div className="w-3 h-3 rounded-full bg-yellow-500" />
          <div className="w-3 h-3 rounded-full bg-green-500" />
        </div>
        <div className="flex items-center gap-2 flex-1 justify-center">
          <Terminal className="h-4 w-4 text-slate-400" />
          <span className="text-xs text-slate-400 font-mono">
            sio-audit — bash
          </span>
        </div>
        <div className="w-16" /> {/* Spacer for centering */}
      </div>

      {/* Terminal Body */}
      <div
        ref={terminalRef}
        className="p-4 font-mono text-sm h-96 overflow-y-auto scroll-smooth"
        style={{
          scrollbarWidth: "thin",
          scrollbarColor: "#475569 #0f172a",
        }}
      >
        <div className="text-slate-500 mb-2">
          Last login: {new Date().toLocaleString()} on ttys001
        </div>

        {currentPrompt && (
          <div className="mb-2">
            <span className="text-cyan-400">{currentPrompt}</span>
            {lines.length > 0 && lines[0].type === "command" && (
              <span className="text-emerald-400 ml-2">{lines[0].content}</span>
            )}
          </div>
        )}

        {lines.slice(1).map((line) => (
          <div
            key={line.id}
            className={cn("whitespace-pre-wrap", getLineColor(line.type))}
          >
            {line.content}
          </div>
        ))}

        {/* Blinking cursor */}
        {!isComplete && (
          <span className="inline-block w-2 h-4 bg-emerald-400 animate-pulse ml-1" />
        )}
      </div>
    </div>
  );
}
