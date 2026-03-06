import { UserActions } from "@/components/user-actions";
import { LayoutDashboard } from "lucide-react";
import Link from "next/link";
import { DataInitializer } from "@/components/DataInitializer";
import { ProductList } from "@/components/ProductList";

const navItems = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
];

export default function AuthenticatedLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <DataInitializer>
      <div className="min-h-screen bg-background text-foreground">
        <div className="mx-auto flex min-h-screen w-full max-w-6xl gap-6 px-6 py-8">
          <aside className="hidden w-56 shrink-0 flex-col gap-6 rounded-3xl border border-border bg-card p-6 lg:flex">
            <div>
              <Link href="/" className="text-lg font-semibold">
                LaunchRecord
              </Link>
              <p className="mt-1 text-xs text-muted-foreground">
                Founding Member Access
              </p>
            </div>
            <nav className="flex flex-col gap-4 text-sm">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="flex items-center gap-2 rounded-xl px-3 py-2 text-foreground transition hover:bg-muted"
                  >
                    <Icon className="size-4" />
                    {item.label}
                  </Link>
                );
              })}
              <div className="pt-2">
                <ProductList />
              </div>
            </nav>
            <div className="mt-auto">
              <UserActions compact />
            </div>
          </aside>
          <div className="flex-1">
            <div className="flex items-center justify-between rounded-3xl border border-border bg-card px-5 py-4 lg:hidden">
              <Link href="/" className="text-sm font-semibold">
                LaunchRecord
              </Link>
              <UserActions compact />
            </div>
            <div className="mt-6 rounded-3xl border border-border bg-card p-6">
              {children}
            </div>
          </div>
        </div>
      </div>
    </DataInitializer>
  );
}
