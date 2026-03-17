"use client";

import { useProductStore } from "@/stores/product-store";
import {
  BadgeCheck,
  BarChart3,
  Bot,
  ChevronRight,
  Eye,
  LayoutDashboard,
  Shield,
  Target,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const auditTools = [
  {
    name: "Positioning Audit",
    href: "/audit/positioning",
    icon: Target,
    color: "text-blue-600",
    bg: "bg-blue-100",
  },
  {
    name: "Product Clarity Audit",
    href: "/audit/clarity",
    icon: Eye,
    color: "text-green-600",
    bg: "bg-green-100",
  },
  {
    name: "Momentum Audit",
    href: "/audit/momentum",
    icon: TrendingUp,
    color: "text-orange-600",
    bg: "bg-orange-100",
  },
  {
    name: "Founder Proof Audit",
    href: "/audit/founder-proof",
    icon: Shield,
    color: "text-purple-600",
    bg: "bg-purple-100",
  },
  {
    name: "AEO Audit",
    href: "/audit/aeo",
    icon: Bot,
    color: "text-cyan-600",
    bg: "bg-cyan-100",
  },
];

export function ProductSidebar() {
  const { selectedProduct } = useProductStore();
  const pathname = usePathname();

  if (!selectedProduct) {
    return null;
  }

  const isOverview = pathname === `/dashboard/${selectedProduct.id}`;
  const isAudit = pathname.startsWith(`/dashboard/${selectedProduct.id}/audit`);

  return (
    <div className="flex flex-col h-full">
      {/* Product Header */}
      <div className="p-4 border-b border-slate-200">
        <div className="flex items-center gap-3">
          {selectedProduct.logo ? (
            <img
              src={selectedProduct.logo}
              alt={selectedProduct.name}
              className="h-10 w-10 rounded-xl object-cover ring-1 ring-slate-200"
            />
          ) : (
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 ring-1 ring-slate-200">
              <BarChart3 className="h-5 w-5 text-slate-400" />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-slate-900 truncate">
              {selectedProduct.name}
            </h3>
            <p className="text-xs text-slate-500 truncate">
              {selectedProduct.website}
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-6">
        {/* Main Menu */}
        <div>
          <p className="px-2 text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
            Menu
          </p>
          <div className="space-y-1">
            <Link
              href={`/dashboard/${selectedProduct.id}`}
              className={`group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-all duration-200 ${
                isOverview
                  ? "bg-gradient-to-r from-orange-50 to-amber-50 shadow-sm"
                  : "hover:bg-gradient-to-r hover:from-orange-50 hover:to-amber-50 hover:shadow-sm"
              }`}
            >
              <div
                className={`flex h-9 w-9 items-center justify-center rounded-lg transition-colors ${
                  isOverview
                    ? "bg-white shadow-sm"
                    : "bg-slate-100 group-hover:bg-white group-hover:shadow-sm"
                }`}
              >
                <LayoutDashboard
                  className={`h-5 w-5 ${isOverview ? "text-orange-600" : "text-slate-500"}`}
                />
              </div>
              <span
                className={`font-medium ${isOverview ? "text-orange-700" : "text-slate-600"}`}
              >
                Overview
              </span>
              {isOverview && (
                <ChevronRight className="h-4 w-4 text-orange-600 ml-auto" />
              )}
            </Link>

            <Link
              href={`/dashboard/${selectedProduct.id}/audit-page`}
              className={`group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-all duration-200 ${
                isAudit
                  ? "bg-gradient-to-r from-orange-50 to-amber-50 shadow-sm"
                  : "hover:bg-gradient-to-r hover:from-orange-50 hover:to-amber-50 hover:shadow-sm"
              }`}
            >
              <div
                className={`flex h-9 w-9 items-center justify-center rounded-lg transition-colors ${
                  isAudit
                    ? "bg-white shadow-sm"
                    : "bg-slate-100 group-hover:bg-white group-hover:shadow-sm"
                }`}
              >
                <BadgeCheck
                  className={`h-5 w-5 ${isAudit ? "text-orange-600" : "text-slate-500"}`}
                />
              </div>
              <span
                className={`font-medium ${isAudit ? "text-orange-700" : "text-slate-600"}`}
              >
                Audit
              </span>
              {isAudit && (
                <ChevronRight className="h-4 w-4 text-orange-600 ml-auto" />
              )}
            </Link>
          </div>
        </div>

        {/* Audit Tools */}
        <div>
          <p className="px-2 text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
            Audit Tools
          </p>
          <div className="space-y-1">
            {auditTools.map((tool) => {
              const Icon = tool.icon;
              const isActive = pathname.includes(tool.href.split("?")[0]);
              return (
                <Link
                  key={tool.name}
                  href={`/dashboard/${selectedProduct.id}${tool.href}`}
                  className={`group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-all duration-200 hover:bg-gradient-to-r hover:from-slate-50 hover:to-slate-100 hover:shadow-sm ${
                    isActive ? "bg-slate-50 shadow-sm" : ""
                  }`}
                >
                  <div
                    className={`flex h-8 w-8 items-center justify-center rounded-lg ${tool.bg} group-hover:shadow-sm`}
                  >
                    <Icon className={`h-4 w-4 ${tool.color}`} />
                  </div>
                  <span className="font-medium text-slate-700">
                    {tool.name}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </nav>
    </div>
  );
}
