"use client";

import { SearchModal } from "@/components/SearchModal";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

interface Category {
  _id: string;
  name: string;
  slug: string;
  count: number;
}

export function StartupsHeader() {
  const { isAuthenticated } = useAuth();
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);

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
      {/* Announcement Bar - Blue Theme */}
      <aside className="text-center bg-gradient-to-b from-blue-600/10 to-blue-500/5 text-slate-900 text-sm font-medium py-2 px-4">
        <p>
          <span className="pr-4">
            🔍 Discover and compare the most defensive startups in AI
          </span>
          <Link
            href="/sio-audit"
            className="underline text-blue-600 font-bold py-2 rounded-lg transition-colors"
          >
            Audit your startup too!
          </Link>
        </p>
      </aside>

      {/* Header - Blue Theme */}
      <header className="relative left-0 right-0 translate-x-0 backdrop-blur-xl z-50 w-full flex max-w-none gap-4 items-center justify-between bg-white px-8 py-4">
        <Link href="/" className="flex items-end gap-2">
          <Image
            src="/logo.svg"
            alt="LaunchRecord"
            width={30}
            height={30}
            priority
          />
          <span className="text-xl md:block hidden font-bold text-blue-600 tracking-tight">
            Launchrecord <span className="text-emerald-500">Startups</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="md:flex items-center gap-1 hidden">
          {/* Categories Dropdown */}
          {/* <Link href="/dashboard" className="text-slate-600 font-bold">
            Audit
          </Link> */}
          {isAuthenticated ? (
            <Link href="/dashboard">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white font-bold">
                Access dashboard
              </Button>
            </Link>
          ) : (
            <>
              <Link href="/login">
                <Button className="border-none bg-white hover:bg-blue-50 border text-blue-600 font-bold">
                  Login
                </Button>
              </Link>
              <Link href="/">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white font-bold">
                  Audit Your SaaS - Free
                </Button>
              </Link>
            </>
          )}
        </nav>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden p-2 rounded-lg hover:bg-slate-100 transition-colors"
          aria-label="Toggle menu"
        >
          <svg
            className="w-6 h-6 text-slate-600"
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
          <div className="md:hidden absolute top-full left-0 right-0 bg-white border-b border-slate-200 shadow-lg mx-0 p-4 z-50">
            <div className="flex flex-col gap-2">
              <Link
                href="/categories"
                onClick={() => setIsMobileMenuOpen(false)}
                className="font-bold text p-3 bg-blue-50 text-blue-700 rounded-xl"
              >
                📂 Categories
              </Link>
              <Link
                href="/leaderboard"
                onClick={() => setIsMobileMenuOpen(false)}
                className="font-bold text p-3 bg-slate-100 text-slate-700 rounded-xl"
              >
                🏆 Sovereign 100
              </Link>

              <div className="border-t border-slate-200 pt-2 flex flex-col gap-2">
                <Link
                  href="/sio-audit"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Button
                    size="sm"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold"
                  >
                    Audited Your Startups
                  </Button>
                </Link>
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
