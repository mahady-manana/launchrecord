"use client";

import { DataInitializer } from "@/components/DataInitializer";
import { ProductList } from "@/components/ProductList";
import { ProductSidebar } from "@/components/ProductSidebar";
import { UserActions } from "@/components/user-actions";
import { useProductStore } from "@/stores/product-store";
import { LayoutDashboard, Rocket } from "lucide-react";
import Link from "next/link";

const navItems = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
];

function FirstColumn({ compact }: { compact: boolean }) {
  return (
    <aside
      className={`hidden no-scrollbar flex-col border-r border-slate-200/60 bg-white/90 backdrop-blur-xl shadow-xl shadow-slate-200/20 lg:flex fixed left-0 top-0 h-full overflow-y-auto z-40 ${
        compact ? "w-20 items-center p-4" : "w-72 p-4"
      }`}
    >
      {/* Logo */}
      <div
        className={`flex items-center gap-3 pb-6 border-b border-slate-200/60 w-full ${
          compact ? "flex-col justify-center" : ""
        }`}
      >
        <div className="flex h-10 w-10 items-center justify-center flex-shrink-0">
          <img
            src={"/logo.svg"}
            width={30}
            height={30}
            className="h-8 w-8 text-white"
          />
        </div>
        {!compact && (
          <div>
            <Link
              href="/"
              className="text-sm font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent"
            >
              LaunchRecord
            </Link>
            <p className="text-[10px] font-medium text-slate-500 uppercase tracking-wider">
              Dashboard
            </p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex flex-col gap-2 text-sm flex-1 w-full mt-6">
        <div>
          {!compact && (
            <p className="px-3 text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-3">
              Menu
            </p>
          )}
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`group flex items-center gap-3 rounded-xl px-3 py-3 text-slate-600 transition-all duration-200 hover:bg-gradient-to-r hover:from-orange-50 hover:to-amber-50 hover:text-orange-600 hover:shadow-md hover:shadow-orange-500/10 ${
                  compact ? "justify-center" : ""
                }`}
                title={compact ? item.label : undefined}
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 transition-colors group-hover:bg-white group-hover:shadow-sm flex-shrink-0">
                  <Icon className="h-5 w-5" />
                </div>
                {!compact && <span className="font-medium">{item.label}</span>}
              </Link>
            );
          })}
        </div>

        {/* Products Section */}
        <div className="pt-6 border-t border-slate-200/60 w-full">
          {!compact && (
            <p className="px-3 text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-3">
              Products
            </p>
          )}
          <ProductList compact={compact} />
        </div>
      </nav>

      {/* User Actions */}
      <div className="pt-6 border-t border-slate-200/60 w-full">
        <UserActions compact={compact} />
      </div>
    </aside>
  );
}

export default function AuthenticatedLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { selectedProduct } = useProductStore();
  const hasProduct = !!selectedProduct;

  return (
    <DataInitializer>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-orange-50/30">
        <div className="flex min-h-screen w-full">
          {/* Sidebar Column 1 - Compact when product selected */}
          <FirstColumn compact={hasProduct} />

          {/* Sidebar Column 2 - Only visible when product selected */}
          {hasProduct && (
            <aside className="hidden w-64 shrink-0 border-r border-slate-200/60 bg-white/60 backdrop-blur-xl lg:flex fixed left-20 top-0 h-full overflow-y-auto z-30">
              <ProductSidebar />
            </aside>
          )}

          {/* Main Content */}
          <main
            className={`flex-1 min-h-screen ${
              hasProduct ? "lg:ml-[336px]" : "lg:ml-72"
            }`}
          >
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
            <div className="bg-slate-100">
              <div className="sticky top-0 z-50 overflow-hidden border border-orange-200/60 bg-gradient-to-r from-orange-500 via-amber-500 to-orange-500 p-5">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-orange-400/20 to-amber-400/20 rounded-full blur-2xl" />
                <div className="relative flex items-start gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 shadow-lg shadow-orange-500/30 flex-shrink-0">
                    <Rocket className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-white">
                      New SIO V5 Audit Experience, Try it now !!!
                    </h3>
                    <p className="text-sm text-slate-100 mt-1.5">
                      Delivering deep insights in just 2-5 minutes. Experience
                      the future of SaaS evaluation with our new SIO V5 Audit,
                      more insightful than ever!
                    </p>
                  </div>
                </div>
              </div>
              <div className="p-8 ">{children}</div>
            </div>
          </main>
        </div>
      </div>
    </DataInitializer>
  );
}
