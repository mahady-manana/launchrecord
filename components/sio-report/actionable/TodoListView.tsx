"use client";

import { SIOV5Report } from "@/services/sio-report/schema";
import { CheckCircle2, ChevronRight, Copy, ListTodo } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

interface TodoItem {
  id: string;
  section: string;
  category:
    | "headline"
    | "subheadline"
    | "cta"
    | "positioning"
    | "messaging"
    | "clarity"
    | "aeo";
  priority: "high" | "medium" | "low";
  text: string;
  context?: string;
}

interface TodoListViewProps {
  report: SIOV5Report;
  productId?: string;
  isGuest?: boolean;
}

export function TodoListView({
  report,
  productId = "unknown",
  isGuest = false,
}: TodoListViewProps) {
  const [copiedIndex, setCopiedIndex] = useState<string | null>(null);

  const handleCopy = async (text: string, key: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedIndex(key);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  // Build todo list from all sections
  const todos: TodoItem[] = [];

  // First Impression todos
  report.firstImpression.headline.suggested.forEach((suggestion, idx) => {
    todos.push({
      id: `headline-${idx}`,
      section: "Headline",
      category: "headline",
      priority: "high",
      text: suggestion,
      context: report.firstImpression.headline.current,
    });
  });

  report.firstImpression.subheadline.suggested.forEach((suggestion, idx) => {
    todos.push({
      id: `subheadline-${idx}`,
      section: "Subheadline",
      category: "subheadline",
      priority: "high",
      text: suggestion,
      context: report.firstImpression.subheadline.current,
    });
  });

  report.firstImpression.cta.suggested.forEach((suggestion, idx) => {
    todos.push({
      id: `cta-${idx}`,
      section: "Call-to-Action",
      category: "cta",
      priority: "high",
      text: suggestion,
      context: report.firstImpression.cta.current,
    });
  });

  // Positioning todos
  report.positioning.summary.suggested.forEach((suggestion, idx) => {
    todos.push({
      id: `positioning-${idx}`,
      section: "Positioning",
      category: "positioning",
      priority: "high",
      text: suggestion,
      context: report.positioning.summary.current,
    });
  });

  // Clarity todos
  report.clarity.summary.suggested.forEach((suggestion, idx) => {
    todos.push({
      id: `messaging-${idx}`,
      section: "Messaging",
      category: "messaging",
      priority: "high",
      text: suggestion,
      context: report.clarity.summary.current,
    });
  });

  // Unclear sentences (fixes)
  report.clarity.unclearSentences?.forEach((item, idx) => {
    todos.push({
      id: `clarity-${idx}`,
      section: "Clarity",
      category: "clarity",
      priority: "medium",
      text: item.fix,
      context: item.text,
    });
  });

  // AEO recommendations
  report.aeo.recommendations?.forEach((rec, idx) => {
    todos.push({
      id: `aeo-${idx}`,
      section: "AEO",
      category: "aeo",
      priority: "low",
      text: rec,
    });
  });

  // Sort by priority
  const priorityOrder = { high: 0, medium: 1, low: 2 };
  const sortedTodos = todos.sort(
    (a, b) => priorityOrder[a.priority] - priorityOrder[b.priority],
  );

  // Group by priority
  const highPriorityTodos = sortedTodos.filter((t) => t.priority === "high");
  const mediumPriorityTodos = sortedTodos.filter(
    (t) => t.priority === "medium",
  );
  const lowPriorityTodos = sortedTodos.filter((t) => t.priority === "low");

  return (
    <div className="space-y-6 px-8">
      {/* Header */}
      <div className="bg-white border-2 border-slate-200 rounded-xl p-6">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <ListTodo className="h-6 w-6 text-slate-700" />
              <h2 className="text-xl font-bold text-slate-900">Todo List</h2>
            </div>
            <p className="text-slate-600 text-sm max-w-2xl">
              Actionable items to improve your startup's messaging and
              positioning.
            </p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-slate-900">
              {todos.length}
            </div>
            <div className="text-sm text-slate-500 uppercase tracking-wide">
              Total Tasks
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-slate-200">
          <div>
            <div className="text-2xl font-bold text-orange-600">
              {highPriorityTodos.length}
            </div>
            <div className="text-sm text-slate-500">High Priority</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-amber-600">
              {mediumPriorityTodos.length}
            </div>
            <div className="text-sm text-slate-500">Medium Priority</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-slate-900">
              {lowPriorityTodos.length}
            </div>
            <div className="text-sm text-slate-500">Low Priority</div>
          </div>
        </div>
      </div>

      {/* High Priority */}
      {highPriorityTodos.length > 0 && (
        <div className="bg-white border-2 border-orange-200 rounded-xl overflow-hidden">
          <div className="bg-orange-50 border-b border-orange-200 px-5 py-4">
            <h3 className="text-sm font-bold text-orange-800 uppercase flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5" />
              High Priority ({highPriorityTodos.length})
            </h3>
          </div>
          <div className="p-5 space-y-3">
            {highPriorityTodos.map((todo, idx) => {
              const key = `high-${todo.id}`;
              return (
                <TodoItemCard
                  key={todo.id}
                  todo={todo}
                  copiedIndex={copiedIndex}
                  onCopy={handleCopy}
                />
              );
            })}
          </div>
        </div>
      )}

      {/* Medium Priority */}
      {mediumPriorityTodos.length > 0 && (
        <div className="bg-white border-2 border-amber-200 rounded-xl overflow-hidden">
          <div className="bg-amber-50 border-b border-amber-200 px-5 py-4">
            <h3 className="text-sm font-bold text-amber-800 uppercase flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5" />
              Medium Priority ({mediumPriorityTodos.length})
            </h3>
          </div>
          <div className="p-5 space-y-3">
            {mediumPriorityTodos.map((todo, idx) => {
              const key = `medium-${todo.id}`;
              return (
                <TodoItemCard
                  key={todo.id}
                  todo={todo}
                  copiedIndex={copiedIndex}
                  onCopy={handleCopy}
                />
              );
            })}
          </div>
        </div>
      )}

      {/* Low Priority */}
      {lowPriorityTodos.length > 0 && (
        <div className="bg-white border-2 border-slate-200 rounded-xl overflow-hidden">
          <div className="bg-slate-50 border-b border-slate-200 px-5 py-4">
            <h3 className="text-sm font-bold text-slate-700 uppercase flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5" />
              Low Priority ({lowPriorityTodos.length})
            </h3>
          </div>
          <div className="p-5 space-y-3">
            {lowPriorityTodos.map((todo, idx) => {
              const key = `low-${todo.id}`;
              return (
                <TodoItemCard
                  key={todo.id}
                  todo={todo}
                  copiedIndex={copiedIndex}
                  onCopy={handleCopy}
                />
              );
            })}
          </div>
        </div>
      )}

      {/* Guest CTA */}
      {isGuest && (
        <div className="bg-slate-900 rounded-xl p-8 text-center text-white">
          <ListTodo className="h-12 w-12 mx-auto mb-4 text-slate-400" />
          <h3 className="text-2xl font-bold mb-3">
            Want More Actionable Todos?
          </h3>
          <p className="text-slate-300 mb-6 max-w-xl mx-auto">
            Sign up to unlock the complete todo list with prioritized tasks,
            detailed context, and step-by-step guidance.
          </p>
          <Link href={`/register?productUrl=${encodeURIComponent(report.url)}`}>
            <button className="inline-flex items-center gap-2 bg-white text-slate-900 px-6 py-3 rounded-lg text-sm font-bold hover:bg-slate-100 transition-colors">
              Get Full Todo List <ChevronRight className="h-5 w-5" />
            </button>
          </Link>
        </div>
      )}
    </div>
  );
}

interface TodoItemCardProps {
  todo: TodoItem;
  copiedIndex: string | null;
  onCopy: (text: string, key: string) => void;
}

function TodoItemCard({ todo, copiedIndex, onCopy }: TodoItemCardProps) {
  return (
    <div className="border border-slate-200 rounded-lg p-4 hover:bg-slate-50 transition-colors">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-bold text-slate-500 uppercase bg-slate-100 px-2 py-0.5 rounded">
              {todo.section}
            </span>
            {todo.context && (
              <span className="text-xs text-slate-500">Replace current</span>
            )}
          </div>
          <p className="text-sm text-green-900 font-medium mb-2">{todo.text}</p>
          {todo.context && (
            <p className="text-xs text-slate-500 italic">
              Current: "{todo.context}"
            </p>
          )}
        </div>
        <button
          onClick={() => onCopy(todo.text, todo.id)}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 rounded-md text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors flex-shrink-0"
        >
          {copiedIndex === todo.id ? (
            <>
              <CheckCircle2 className="h-4 w-4" />
              Copied
            </>
          ) : (
            <>
              <Copy className="h-4 w-4" />
              Copy
            </>
          )}
        </button>
      </div>
    </div>
  );
}
