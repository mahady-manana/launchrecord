import Link from "next/link";

interface Category {
  _id: string;
  name: string;
  slug: string;
  count: number;
}

async function fetchCategories(): Promise<Category[]> {
  try {
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const res = await fetch(`${appUrl}/api/topics?top=18`, {
      cache: "force-cache",
      next: { revalidate: 3600 }, // Revalidate every hour
    });
    const data = await res.json();
    if (data.success) {
      return data.topics;
    }
    return [];
  } catch (error) {
    console.error("Failed to fetch categories:", error);
    return [];
  }
}

export async function Footer() {
  const currentYear = new Date().getFullYear();
  const categories = await fetchCategories();

  const resources = [
    { href: "/aeo-vs-seo", label: "AEO vs SEO Guide" },
    { href: "/how-score-works", label: "How Scoring Works" },
    { href: "/sio-v5-engine", label: "SIO-V5 Engine" },
    {
      href: "/blog/will-aeo-commoditize-seo",
      label: "Will AEO Commoditize SEO?",
    },
    {
      href: "/blog/5-things-you-need-to-know-about-aeo",
      label: "5 Things About AEO",
    },
  ];

  const tools = [
    { href: "/aeo-audit", label: "AEO Audit" },
    { href: "/positioning-audit", label: "Positioning Audit" },
    { href: "/clarity-audit", label: "Product Clarity Audit" },
    { href: "/momentum-audit", label: "Momentum Audit" },
    { href: "/founder-proof-audit", label: "Founder Proof Audit" },
    { href: "/leaderboard", label: "Sovereign 100" },
  ];

  const productLinks = [
    { href: "/pricing", label: "Pricing" },
    { href: "/dashboard", label: "Dashboard" },
    { href: "/categories", label: "All Categories" },
  ];

  const companyLinks = [
    { href: "/", label: "About Us" },
    { href: "/survey", label: "Contact" },
  ];

  const accountLinks = [
    { href: "/login", label: "Login" },
    { href: "/register", label: "Sign Up" },
  ];

  const legalLinks = [
    { href: "/terms", label: "Terms of Service" },
    { href: "/privacy", label: "Privacy Policy" },
    { href: "/cookies", label: "Cookie Policy" },
  ];

  return (
    <footer className="bg-slate-950 text-slate-300">
      <div className="mx-auto w-full max-w-7xl px-6 py-12">
        {/* Main Footer Grid */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-8 mb-12">
          {/* Brand Column */}
          <div className="col-span-2 md:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center">
                <img
                  src="/logo.svg"
                  width={30}
                  height={30}
                  alt="Launch Record Logo"
                />
              </div>
              <span className="font-bold text-lg">Launch Record</span>
            </div>
            <p className="text-sm ">
              The Strategic Architect&apos;s Weapon for the AI Era
            </p>
            <p className="text-xs text-muted-foreground">
              © {currentYear} LaunchRecord
            </p>
          </div>

          {/* Resources Column */}
          <div className="space-y-3">
            <h3 className="font-semibold text-sm uppercase tracking-wider text-primary">
              📚 Resources
            </h3>
            <ul className="space-y-2">
              {resources.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Tools Column */}
          <div className="space-y-3">
            <h3 className="font-semibold text-sm uppercase tracking-wider text-primary">
              🔧 Tools
            </h3>
            <ul className="space-y-2">
              {tools.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm  transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Product Column */}
          <div className="space-y-3">
            <h3 className="font-semibold text-sm uppercase tracking-wider">
              Product
            </h3>
            <ul className="space-y-2">
              {productLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company & Account Column */}
          <div className="space-y-3">
            <h3 className="font-semibold text-sm uppercase tracking-wider">
              Company
            </h3>
            <ul className="space-y-2">
              {companyLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
              <li className="pt-2">
                <h4 className="font-semibold text-xs uppercase tracking-wider text-primary mb-2">
                  Account
                </h4>
                {accountLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="block text-sm transition-colors"
                  >
                    {link.label}
                  </Link>
                ))}
              </li>
            </ul>
          </div>
        </div>

        {/* Categories Section */}
        <div className="border-t border-border pt-8 mb-8">
          <h3 className="font-semibold text-sm uppercase tracking-wider text-primary mb-4">
            🏆 Top Categories
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {categories.length > 0 ? (
              categories.slice(0, 100).map((category) => (
                <Link
                  key={category._id}
                  href={`/categories/${category.slug}`}
                  className="text-sm px-2 py-1 rounded transition-colors"
                >
                  {category.name}
                  <span className="text-xs text-slate-400 ml-1">
                    ({category.count})
                  </span>
                </Link>
              ))
            ) : (
              // Fallback static categories if fetch fails
              <>
                <Link href="/categories" className="text-sm px-2 py-1">
                  View All Categories
                </Link>
              </>
            )}
          </div>
          {categories.length > 0 && (
            <div className="mt-4 text-center">
              <Link
                href="/categories"
                className="inline-block text-sm font-medium text-primary hover:underline"
              >
                View all categories →
              </Link>
            </div>
          )}
        </div>

        {/* Legal & Social Row */}
        <div className="mt-8 pt-8 border-t border-border">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            {/* Legal Links */}
            <div className="flex items-center gap-6 flex-wrap justify-center">
              {legalLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Social Links */}
            <div className="flex items-center gap-4">
              <Link
                href="https://twitter.com"
                className=" transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                <span className="sr-only">Twitter</span>
                <svg
                  className="h-5 w-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </Link>
              <Link
                href="https://github.com"
                className=" transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                <span className="sr-only">GitHub</span>
                <svg
                  className="h-5 w-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    fillRule="evenodd"
                    d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                    clipRule="evenodd"
                  />
                </svg>
              </Link>
              <Link
                href="https://linkedin.com"
                className=" transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                <span className="sr-only">LinkedIn</span>
                <svg
                  className="h-5 w-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-8 border-t border-border">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-xs  ">
              Built for sovereign founders who refuse to be commoditized.
            </p>
            <p className="text-xs text-muted-foreground">
              Made with ❤️ for the AI Era
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
