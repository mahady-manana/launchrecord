"use client";

import { useSubscription } from "@/hooks/use-subscription";
import { reportNavigation } from "../constants/navigation";

interface ReportSidebarProps {
  isGuest?: boolean;
  activeSection: string;
  onNavigate: (sectionId: string) => void;
}

export function ReportSidebar({
  isGuest = false,
  activeSection,
  onNavigate,
}: ReportSidebarProps) {
  const { tier } = useSubscription(isGuest);

  return (
    <nav className="sticky top-18 max-h-[calc(100vh-6rem)] overflow-y-auto pr-2 space-y-1 no-scrollbar">
      {reportNavigation.map((nav) => (
        <div key={nav.id}>
          <button
            onClick={() => onNavigate(nav.id)}
            className={`w-full text-left px-3 py-1 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
              activeSection === nav.id
                ? "bg-primary/10 text-primary"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            <span>{nav.icon}</span>
            <span className="flex-1">{nav.label}</span>
          </button>

          {nav.children && (
            <div
              className={`ml-4 mt-1 space-y-1 border-l-2 border-slate-200 pl-3 ${
                tier === "guest"
                  ? "opacity-40 pointer-events-none select-none grayscale"
                  : ""
              }`}
            >
              {nav.children.map((child, idx) => (
                <button
                  key={child.id}
                  onClick={() => tier !== "guest" && onNavigate(child.id)}
                  className={`w-full text-left px-3 py-0.5 rounded text-xs transition-colors ${
                    activeSection === child.id
                      ? "text-primary font-semibold"
                      : "text-slate-600 hover:text-slate-800"
                  }`}
                  disabled={tier === "guest" && idx === 0}
                >
                  {child.label}
                </button>
              ))}
            </div>
          )}
        </div>
      ))}
    </nav>
  );
}
