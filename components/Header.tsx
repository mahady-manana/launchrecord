"use client";

import { SearchModal } from "@/components/SearchModal";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import clsx from "clsx";
import { Search } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

interface Category {
  _id: string;
  name: string;
  slug: string;
  count: number;
}

export function Header() {
  const { isAuthenticated } = useAuth();
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await fetch("/api/topics?top=10");
        const data = await res.json();
        if (data.success) {
          setCategories(data.topics);
        }
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchCategories();
  }, []);

  return (
    <>
      <header
        className={clsx(
          "sticky top-2 backdrop-blur-xl z-50 w-full mx-auto",
          "flex max-w-6xl gap-4 items-center justify-between bg-white shadow border rounded-full px-8 py-2",
        )}
      >
        <Link href="/" className="flex items-end gap-2">
          <Image
            src="/logo.svg"
            alt="LaunchRecord"
            width={30}
            height={30}
            priority
          />
          <span className="text-2xl md:block hidden font-bold text-secondary tracking-tight">
            Launch <span className="text-primary">Record</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="md:flex items-center gap-3 hidden">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsSearchOpen(true)}
            className="border min-w-32 flex justify-end bg-slate-50 hover:bg-slate-100"
            aria-label="Search"
          >
            <Search className="h-4 w-4" />
          </Button>
          <div
            className="relative"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <button className="font-bold text-sm text-slate-800 hover:bg-slate-100 rounded-xl px-4 py-2 transition-colors flex items-center gap-1">
              Top products
              <svg
                className={`w-4 h-4 transition-transform duration-200 ${isHovered ? "rotate-180" : ""}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
            {isHovered && (
              <div className="absolute top-full left-0 mt-0 bg-white rounded-xl shadow-lg border border-slate-200 p-4 min-w-[400px] z-50">
                <div className="grid grid-cols-2 gap-2">
                  {isLoading ? (
                    <div className="col-span-2 px-3 py-2 text-sm text-slate-500 text-center">
                      Loading...
                    </div>
                  ) : (
                    categories.map((category) => (
                      <Link
                        key={category._id}
                        href={`/categories/${category.slug}`}
                        className="block p-3 rounded-lg hover:bg-slate-100 transition-colors"
                      >
                        <div className="text-sm font-medium text-slate-800">
                          {category.name}
                        </div>
                        <div className="text-xs text-slate-500">
                          {category.count} products
                        </div>
                      </Link>
                    ))
                  )}
                </div>
                <div>
                  <Link
                    href="/categories"
                    className="block text-center rounded-full w-full p-2 bg-slate-200"
                  >
                    All categories
                  </Link>
                </div>
              </div>
            )}
          </div>
          <Link
            href="/leaderboard"
            className="font-bold text-sm  text p-1 text-slate-800 rounded-xl px-1 hover:bg-slate-100 hover:underline"
          >
            Sovereign 100
          </Link>
          <Link
            href="/aeo-audit"
            className="font-bold text-sm p-1 text-slate-800 rounded-xl px-1 hover:bg-slate-100 hover:underline"
          >
            AEO Audit<span className="md:inline hidden"></span>
          </Link>
          <Link
            href="/aeo-vs-seo"
            className="font-bold text-sm p-1 text-slate-800 rounded-xl px-1 hover:bg-slate-100 hover:underline"
          >
            AEO vs SEO<span className="md:inline hidden"></span>
          </Link>
          <Link
            href="/sio-v5-engine"
            className="font-bold text-sm p-1 text-slate-800 rounded-xl px-1 hover:bg-slate-100 hover:underline"
          >
            SIO-V5 <span className="md:inline hidden">Engine</span>
          </Link>
          {isAuthenticated ? (
            <Link href="/dashboard">
              <Button size="sm" className="bg-orange-600 hover:bg-orange-700">
                Dashboard
              </Button>
            </Link>
          ) : (
            <>
              <Link href="/login">
                <Button variant="ghost" size="sm">
                  Log in
                </Button>
              </Link>
              <Link href="/survey">
                <Button size="sm" className="bg-orange-600 hover:bg-orange-700">
                  Audit
                </Button>
              </Link>
            </>
          )}
        </nav>

        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsSearchOpen(true)}
          className="md:hidden block border min-w-32 flex justify-end bg-slate-50 hover:bg-slate-100"
          aria-label="Search"
        >
          <Search className="h-4 w-4" />
        </Button>
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden p-2 rounded-lg hover:bg-slate-100 transition-colors"
          aria-label="Toggle menu"
        >
          <svg
            className="w-6 h-6 text-slate-800"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            {isMobileMenuOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-white border-b border-slate-200 rounded-b-2xl shadow-lg mx-4 p-4 z-50">
            <div className="flex flex-col gap-2">
              <Link
                href="/sio-v5-engine"
                onClick={() => setIsMobileMenuOpen(false)}
                className="font-bold text p-3 bg-primary/20 text-primary rounded-xl"
              >
                SIO-V5 Engine
              </Link>
              <Link
                href="/leaderboard"
                onClick={() => setIsMobileMenuOpen(false)}
                className="font-bold text p-3 bg-slate-200 text-slate-800 rounded-xl"
              >
                Sovereign 100
              </Link>
              <Link
                href="/aeo-audit"
                className="font-bold text-sm p-1 text-slate-800 rounded-xl px-1 hover:bg-slate-100 hover:underline"
              >
                AEO Audit<span className="md:inline hidden"></span>
              </Link>
              <Link
                href="/aeo-vs-seo"
                className="font-bold text-sm p-1 text-slate-800 rounded-xl px-1 hover:bg-slate-100 hover:underline"
              >
                AEO vs SEO<span className="md:inline hidden"></span>
              </Link>
              {/* Mobile Categories Dropdown */}
              <div className="border-t border-slate-200 pt-2">
                <div className="font-bold text-sm text-slate-800 px-3 py-2">
                  Top products
                </div>
                <div className="grid grid-cols-2 gap-2 px-2">
                  {isLoading ? (
                    <div className="col-span-2 px-3 py-2 text-sm text-slate-500 text-center">
                      Loading...
                    </div>
                  ) : (
                    categories.map((category) => (
                      <Link
                        key={category._id}
                        href={`/categories/${category.slug}`}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="block p-3 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors"
                      >
                        <div className="text-sm font-medium text-slate-800">
                          {category.name}
                        </div>
                        <div className="text-xs text-slate-500">
                          {category.count} products
                        </div>
                      </Link>
                    ))
                  )}
                </div>
                <div className="mt-4">
                  <Link
                    href="/categories"
                    className="block text-center rounded-full w-full p-2 bg-slate-200"
                  >
                    All categories
                  </Link>
                </div>
              </div>

              <div className="border-t border-slate-200 pt-2 flex flex-col gap-2">
                {isAuthenticated ? (
                  <Link
                    href="/dashboard"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Button
                      size="sm"
                      className="w-full bg-orange-600 hover:bg-orange-700"
                    >
                      Dashboard
                    </Button>
                  </Link>
                ) : (
                  <>
                    <Link
                      href="/login"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <Button variant="ghost" size="sm" className="w-full">
                        Log in
                      </Button>
                    </Link>
                    <Link
                      href="/survey"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <Button
                        size="sm"
                        className="w-full bg-orange-600 hover:bg-orange-700"
                      >
                        Audit
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </header>
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />
    </>
  );
}
