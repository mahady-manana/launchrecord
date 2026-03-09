import { DataInitializer } from "@/components/DataInitializer";
import { ProductList } from "@/components/ProductList";
import { UserActions } from "@/components/user-actions";
import { LayoutDashboard, Rocket, Settings } from "lucide-react";
import Link from "next/link";

const navItems = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/subscription", label: "Subscription", icon: Settings },
];

export default function AuthenticatedLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <DataInitializer>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-orange-50/30">
        <div className="flex min-h-screen w-full">
          {/* Sidebar - Fixed width, full height */}
          <aside className="hidden w-72 shrink-0 flex-col gap-6 border-r border-slate-200/60 bg-white/90 backdrop-blur-xl p-6 shadow-xl shadow-slate-200/20 lg:flex fixed left-0 top-0 h-full overflow-y-auto">
            {/* Logo */}
            <div className="flex items-center gap-3 pb-6 border-b border-slate-200/60">
              <div className="flex h-11 w-11 items-center justify-center">
                <img
                  src={"/logo.svg"}
                  width={30}
                  height={30}
                  className="h-9 w-9 text-white"
                />
              </div>
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
            </div>

            {/* Navigation */}
            <nav className="flex flex-col gap-2 text-sm flex-1">
              <div>
                <p className="px-3 text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-3">
                  Menu
                </p>
                {navItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="group flex items-center gap-3 rounded-xl px-3 py-3 text-slate-600 transition-all duration-200 hover:bg-gradient-to-r hover:from-orange-50 hover:to-amber-50 hover:text-orange-600 hover:shadow-md hover:shadow-orange-500/10"
                    >
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 transition-colors group-hover:bg-white group-hover:shadow-sm">
                        <Icon className="h-5 w-5" />
                      </div>
                      <span className="font-medium">{item.label}</span>
                    </Link>
                  );
                })}
              </div>

              {/* Products Section */}
              <div className="pt-6 border-t border-slate-200/60">
                <p className="px-3 text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-3">
                  Products
                </p>
                <ProductList />
              </div>
            </nav>

            {/* User Actions */}
            <div className="pt-6 border-t border-slate-200/60">
              <UserActions compact />
            </div>
          </aside>

          {/* Main Content - Full width, full height */}
          <main className="flex-1 lg:ml-72 min-h-screen">
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

            {/* Content Area - Full width with padding */}
            <div className="bg-slate-100">
              <div className="sticky top-0 z-50 overflow-hidden border border-orange-200/60 bg-gradient-to-r from-orange-500 via-amber-500 to-orange-500 p-5">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-orange-400/20 to-amber-400/20 rounded-full blur-2xl" />
                <div className="relative flex items-start gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 shadow-lg shadow-orange-500/30 flex-shrink-0">
                    <Rocket className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-white">
                      Launch Date: March 17, 2026
                    </h3>
                    <p className="text-sm text-slate-100 mt-1.5">
                      Some features will be available before the official launch
                      date. Stay tuned for updates!
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
