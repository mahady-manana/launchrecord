"use client";

import { DataInitializer } from "@/components/DataInitializer";
import { ProductSwitcher } from "@/components/ProductSwitcher";
import { UserActions } from "@/components/user-actions";
import { useProductStore } from "@/stores/product-store";
import {
  BadgeCheck,
  Bot,
  ChevronRight,
  CreditCard,
  FileText,
  LayoutDashboard,
  LucideIcon,
  Settings,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface MenuItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

const productMenuItems: MenuItem[] = [
  {
    label: "Overview",
    href: "",
    icon: LayoutDashboard,
  },
  {
    label: "New Audit",
    href: "/audit-page",
    icon: BadgeCheck,
  },
  // {
  //   label: "You vs Competitors",
  //   href: "/market-center",
  //   icon: ShoppingBag,
  // },
  // {
  //   label: "Competitors and Spy",
  //   href: "/audit-page",
  //   icon: ScanSearch,
  // },

  {
    label: "Reports and History",
    href: "/reports",
    icon: FileText,
  },
  {
    label: "Settings",
    href: "/settings",
    icon: Settings,
  },
  {
    label: "Billing",
    href: "/subscription",
    icon: CreditCard,
  },
];

const auditTools = [
  {
    name: "AEO Audit",
    href: "/audit/aeo",
    icon: Bot,
    color: "text-cyan-600",
    bg: "bg-cyan-100",
  },
];

function Sidebar() {
  const { selectedProduct } = useProductStore();
  const pathname = usePathname();
  const hasProduct = !!selectedProduct;

  if (!hasProduct) return null;

  const basePath = `/dashboard/${selectedProduct.id}`;

  return (
    <aside className="hidden no-scrollbar flex-col border-r border-slate-200/60 bg-white/90 backdrop-blur-xl shadow-xl shadow-slate-200/20 lg:flex fixed left-0 top-0 h-full overflow-y-auto z-40 w-72 p-4">
      {/* 1. Logo Section */}
      <div>
        <ProductSwitcher />
      </div>

      {/* Navigation */}
      <nav className="flex flex-col gap-2 text-sm flex-1 w-full mt-6 overflow-y-auto">
        {/* Product Menu */}
        <div className="pt-6 border-t border-slate-200/60">
          <div className="space-y-1">
            {productMenuItems.map((item) => {
              const href = `${basePath}${item.href}`;
              const isActive = pathname === href;
              const Icon = item.icon;

              return (
                <Link
                  key={item.label}
                  href={href}
                  className={`group flex items-center gap-3 rounded-xl px-3 py-1 text-sm transition-all duration-200 ${
                    isActive
                      ? "bg-gradient-to-r from-orange-50 to-amber-50 shadow-sm"
                      : "hover:bg-gradient-to-r hover:from-orange-50 hover:to-amber-50 hover:shadow-sm"
                  }`}
                >
                  <div
                    className={`flex h-9 w-9 items-center justify-center rounded-lg transition-colors ${
                      isActive
                        ? "bg-white shadow-sm"
                        : "bg-slate-100 group-hover:bg-white group-hover:shadow-sm"
                    }`}
                  >
                    <Icon
                      className={`h-5 w-5 ${
                        isActive ? "text-orange-600" : "text-slate-500"
                      }`}
                    />
                  </div>
                  <span
                    className={`font-medium ${
                      isActive ? "text-orange-700" : "text-slate-600"
                    }`}
                  >
                    {item.label}
                  </span>
                  {isActive && (
                    <ChevronRight className="h-4 w-4 text-orange-600 ml-auto" />
                  )}
                </Link>
              );
            })}
          </div>
        </div>

        {/* Audit Tools */}
        <div className="pt-6 border-t border-slate-200/60">
          <p className="px-3 text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-3">
            Audit Tools
          </p>
          <div className="space-y-1">
            {auditTools.map((tool) => {
              const Icon = tool.icon;
              const isActive = pathname.includes(tool.href.split("?")[0]);
              return (
                <Link
                  key={tool.name}
                  href={`${basePath}${tool.href}`}
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

      {/* User Actions */}
      <div className="pt-6 border-t border-slate-200/60 w-full mt-auto">
        <UserActions />
      </div>
    </aside>
  );
}

export default function AuthenticatedLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <DataInitializer>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-orange-50/30">
        <div className="flex min-h-screen w-full">
          {/* Single Sidebar */}
          <Sidebar />

          {/* Main Content */}
          <main className="flex-1 min-h-screen lg:ml-72">
            {/* Mobile Header */}
            <div className="flex items-center justify-between border-b border-slate-200/60 bg-white/90 backdrop-blur-xl px-6 py-4 shadow-sm lg:hidden sticky top-0 z-50">
              <div className="flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-orange-500 to-amber-500">
                  <img
                    src={"/logo.svg"}
                    width={30}
                    height={30}
                    className="h-5 w-5 text-white"
                  />
                </div>
                <Link href="/" className="text-base font-bold">
                  LaunchRecord
                </Link>
              </div>
              <UserActions compact />
            </div>

            {/* Content Area */}
            <div className="bg-slate-100 min-h-screen">
              <div className="p-8 ">{children}</div>
            </div>
          </main>
        </div>
      </div>
    </DataInitializer>
  );
}
