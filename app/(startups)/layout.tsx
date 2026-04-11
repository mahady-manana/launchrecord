import { Footer } from "@/components/Footer";
import { StartupsHeader } from "@/components/StartupsHeader";
import Link from "next/link";

export default function StartupsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <StartupsHeader />
      <div className="min-h-screen bg-white">
        <div className="flex gap-6 px-6 py-8 max-w-[1920px] mx-auto">
          {/* Left Sidebar - Navigation & Filters */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="sticky top-2 space-y-6">
              {/* Quick Navigation */}
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
                <nav className="space-y-1">
                  <Link
                    href="/startups"
                    className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-blue-50 hover:text-blue-700 rounded-lg transition-colors"
                  >
                    <span className="text-lg">🏠</span>
                    Startup directories
                  </Link>
                </nav>
              </div>

              {/* Top Categories */}
              <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
                <h3 className="font-bold text-sm text-slate-900 mb-3 uppercase tracking-wider">
                  Top Categories
                </h3>
                <TopCategories />
              </div>

              {/* Quick Stats */}
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 min-w-0 bg-white">{children}</main>

          {/* Right Sidebar - Trends & Info */}
          <aside className="hidden xl:block w-80 flex-shrink-0">
            <div className="sticky top-2 space-y-6">
              {/* Trending Startups */}

              {/* Recent Audits */}
              <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
                <h3 className="font-bold text-sm text-slate-900 mb-3 uppercase tracking-wider">
                  📊 Recent Audits
                </h3>
                <RecentAudits />
              </div>
              <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
                <h3 className="font-bold text-sm text-slate-900 mb-3 uppercase tracking-wider">
                  🔥 Trending Startups
                </h3>
                <TrendingStartups />
              </div>

              {/* CTA */}
              <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl p-6 text-white shadow-sm">
                <h3 className="font-bold text-lg mb-2">Audit Your Startup</h3>
                <p className="text-sm text-blue-100 mb-4">
                  Get your AI visibility score and positioning analysis in
                  minutes.
                </p>
                <a
                  href="/sio-audit"
                  className="block w-full bg-white text-blue-600 font-bold py-2 px-4 rounded-lg text-center hover:bg-blue-50 transition-colors"
                >
                  Free Audit →
                </a>
              </div>
            </div>
          </aside>
        </div>
      </div>
      <Footer />
    </>
  );
}

// Top Categories Component
async function TopCategories() {
  try {
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const res = await fetch(`${appUrl}/api/topics?top=50`);
    const data = await res.json();

    if (data.success && data.topics?.length > 0) {
      return (
        <ul className="space-y-1 h-[500px] overflow-y-auto no-scrollbar">
          {data.topics.map((topic: any) => (
            <li key={topic._id}>
              <a
                href={`/categories/${topic.slug}`}
                className="flex items-center justify-between px-3 py-2 text-sm hover:bg-slate-50 rounded-lg transition-colors group"
              >
                <span className="text-slate-700 group-hover:text-blue-600 font-medium truncate">
                  {topic.name}
                </span>
                <span className="text-xs text-slate-500 ml-2 flex-shrink-0">
                  {topic.count}
                </span>
              </a>
            </li>
          ))}
        </ul>
      );
    }
  } catch (error) {
    console.error("Failed to fetch categories:", error);
  }

  return <p className="text-sm text-slate-500">No categories found</p>;
}

// Trending Startups Component
async function TrendingStartups() {
  try {
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const res = await fetch(`${appUrl}/api/leaderboard?limit=10`);
    const data = await res.json();

    if (data.success && data.data?.products?.length > 0) {
      return (
        <ul className="space-y-1">
          {data.data.products
            .slice(0, 10)
            .map((product: any, index: number) => (
              <li key={product._id}>
                <a
                  href={`/products/${product.slug}`}
                  className="flex items-center gap-3 p-2 hover:bg-slate-50 rounded-lg transition-colors group"
                >
                  <span className="text-xs font-bold text-blue-600 mt-1">
                    #{index + 1}
                  </span>
                  {product.logo && (
                    <img
                      src={product.logo}
                      alt={product.name}
                      className="h-5 w-5 rounded object-cover flex-shrink-0"
                    />
                  )}
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-slate-900 group-hover:text-blue-600 truncate">
                      {product.name}
                    </p>
                    {product.tagline && (
                      <p className="text-xs text-slate-500 line-clamp-1">
                        {product.tagline}
                      </p>
                    )}
                  </div>
                </a>
              </li>
            ))}
        </ul>
      );
    }
  } catch (error) {
    console.error("Failed to fetch trending startups:", error);
  }

  return <p className="text-sm text-slate-500">No trending startups</p>;
}

// Recent Audits Component
async function RecentAudits() {
  try {
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const res = await fetch(`${appUrl}/api/recent-products?limit=5`);
    const data = await res.json();

    if (data.success && data.data?.products?.length > 0) {
      return (
        <ul className="space-y-1">
          {data.data.products.slice(0, 5).map((product: any) => (
            <li key={product._id}>
              <a
                href={`/products/${product.slug}`}
                className="flex items-center gap-3 p-2 hover:bg-slate-50 rounded-lg transition-colors group"
              >
                {product.logo && (
                  <img
                    src={product.logo}
                    alt={product.name}
                    className="h-5 w-5 rounded object-cover flex-shrink-0"
                  />
                )}
                <div className="min-w-0">
                  <p className="text-sm font-medium text-slate-900 group-hover:text-blue-600 truncate">
                    {product.name}
                  </p>
                  {product.tagline && (
                    <p className="text-xs text-slate-500 line-clamp-1">
                      {product.tagline}
                    </p>
                  )}
                </div>
              </a>
            </li>
          ))}
        </ul>
      );
    }
  } catch (error) {
    console.error("Failed to fetch recent audits:", error);
  }

  return <p className="text-sm text-slate-500">No recent audits</p>;
}
