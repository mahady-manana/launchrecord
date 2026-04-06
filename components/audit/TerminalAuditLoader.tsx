"use client";

import { AuditProgress } from "@/components/audit/useAudit";
import { cn } from "@/lib/utils";
import { Terminal } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

export interface AuditStep {
  id: string;
  name: string;
  progress: AuditProgress;
  metrics?: string[];
  subMetrics?: string[];
}

export interface TerminalAuditLoaderProps {
  command?: string;
  steps: AuditStep[];
  currentProgress: AuditProgress;
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
  currentProgress,
  onComplete,
  className,
}: TerminalAuditLoaderProps) {
  const [lines, setLines] = useState<TerminalLine[]>([]);
  const [isComplete, setIsComplete] = useState(false);
  const [currentPrompt, setCurrentPrompt] = useState("");
  const terminalRef = useRef<HTMLDivElement>(null);
  const lineIdRef = useRef(0);
  const processedStepsRef = useRef<Set<string>>(new Set());

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

  // Initial prompt
  useEffect(() => {
    setCurrentPrompt("sio-v5@LAUNCHRECORD:~/sio-audit$");
    addLine("command", command);
  }, [command, addLine]);

  // Process steps based on current progress
  useEffect(() => {
    if (currentProgress === "idle" || currentProgress === "failed") return;

    const currentStepIndex = steps.findIndex(
      (step) => step.progress === currentProgress,
    );

    // Process all completed steps
    steps.forEach((step, index) => {
      if (processedStepsRef.current.has(step.id)) return;

      // If step is before or at current progress, show it
      if (index <= currentStepIndex || step.progress === currentProgress) {
        processedStepsRef.current.add(step.id);

        // Add step header
        addLine("info", `\n▶ Starting: ${step.name}...`);

        // Add metrics if step is complete
        if (index < currentStepIndex && step.metrics) {
          step.metrics.forEach((metric) => {
            addLine("metric", `  ✓ ${metric}`);
            if (step.subMetrics) {
              step.subMetrics.forEach((sub) => {
                addLine("submetric", `    └─ ${sub}`);
              });
            }
          });
        } else if (index === currentStepIndex) {
          // Currently running step - show some metrics progressively
          if (step.metrics) {
            step.metrics.slice(0, 2).forEach((metric) => {
              addLine("metric", `  ⟳ ${metric}...`);
            });
          }
        }

        // Add step completion if before current
        if (index < currentStepIndex) {
          addLine("success", `✔ Completed: ${step.name}`);
          if (index < currentStepIndex - 1) {
            addLine("separator", "─".repeat(60));
          }
        }
      }
    });

    // Show complete message
    if (currentProgress === "complete" && !isComplete) {
      setIsComplete(true);
      addLine("separator", "═".repeat(60));
      addLine("success", "\n✔ Audit complete. Generating report...");
      onComplete?.();
    }
  }, [currentProgress, steps, addLine, onComplete, isComplete]);

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
        {!isComplete && currentProgress !== "complete" && (
          <span className="inline-block w-2 h-4 bg-emerald-400 animate-pulse ml-1" />
        )}
      </div>
    </div>
  );
}
