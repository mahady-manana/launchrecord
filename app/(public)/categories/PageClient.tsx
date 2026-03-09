"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  BarChart3,
  Search,
  TrendingUp,
  Zap,
  Shield,
  Globe,
  Crown,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

interface Category {
  _id: string;
  name: string;
  slug: string;
  count: number;
}

interface CategoriesPageClientProps {
  initialCategories: Category[];
}

export default function CategoriesPageClient({
  initialCategories,
}: CategoriesPageClientProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const categories = initialCategories;

  const filteredCategories = categories.filter((cat) =>
    cat.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const topCategories = filteredCategories.slice(0, 10);
  const allCategories = filteredCategories.slice(10);

  const getCategoryIcon = (index: number) => {
    const icons = [Zap, Shield, Globe, Crown, BarChart3, TrendingUp];
    const Icon = icons[index % icons.length];
    return Icon;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-primary/5">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary via-primary/90 to-primary/80 text-white">
        <div className="max-w-6xl mx-auto px-4 py-16">
          <div className="text-center space-y-6">
            <Badge className="bg-white/20 text-white border-0 text-sm px-4 py-1.5">
              <BarChart3 className="h-4 w-4 mr-2" />
              Browse by Category
            </Badge>

            <h1 className="text-5xl md:text-6xl font-black tracking-tighter">
              Explore Categories
            </h1>

            <p className="text-xl text-white/80 max-w-3xl mx-auto">
              Discover the best SaaS products in each niche, ranked by
              defensibility score.
            </p>

            {/* Search */}
            <div className="max-w-xl mx-auto mt-8">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-white/60" />
                <Input
                  type="text"
                  placeholder="Search categories..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-12 h-14 bg-white/10 border-white/20 text-white placeholder:text-white/60 focus:border-white/40 focus:ring-white/40 rounded-xl"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 py-12 space-y-12">
        {/* Top 10 Categories */}
        {topCategories.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Top Categories</h2>
              <Badge variant="outline" className="text-sm">
                {topCategories.length} categories
              </Badge>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {topCategories.map((category, index) => {
                const Icon = getCategoryIcon(index);
                return (
                  <Link
                    key={category._id}
                    href={`/categories/${category.slug}`}
                  >
                    <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-2 border-transparent hover:border-primary/20 overflow-hidden h-full">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="p-3 bg-gradient-to-br from-primary/10 to-primary/20 rounded-xl group-hover:from-primary/20 group-hover:to-primary/30 transition-colors">
                            <Icon className="h-6 w-6 text-primary" />
                          </div>
                          <Badge
                            variant="secondary"
                            className="bg-slate-100 text-slate-700"
                          >
                            {category.count}{" "}
                            {category.count === 1 ? "product" : "products"}
                          </Badge>
                        </div>

                        <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-primary transition-colors">
                          {category.name}
                        </h3>

                        <div className="flex items-center text-sm text-muted-foreground">
                          <span>View leaderboard</span>
                          <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                );
              })}
            </div>
          </section>
        )}

        {/* All Categories */}
        {allCategories.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">All Categories</h2>
              <Badge variant="outline" className="text-sm">
                {allCategories.length} more categories
              </Badge>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {allCategories.map((category) => (
                <Link
                  key={category._id}
                  href={`/categories/${category.slug}`}
                >
                  <Card className="group hover:shadow-md transition-all hover:-translate-y-0.5">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <Globe className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                        <Badge
                          variant="outline"
                          className="text-[10px] h-5 px-1.5"
                        >
                          {category.count}
                        </Badge>
                      </div>
                      <h3 className="font-semibold text-sm truncate group-hover:text-primary transition-colors">
                        {category.name}
                      </h3>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Empty State */}
        {filteredCategories.length === 0 && (
          <Card>
            <CardContent className="py-16 text-center">
              <Search className="h-16 w-16 text-slate-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-slate-600">
                No categories found
              </h3>
              <p className="text-slate-500 mt-2">
                {searchTerm
                  ? `No categories match "${searchTerm}"`
                  : "No categories available yet"}
              </p>
              {searchTerm && (
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={() => setSearchTerm("")}
                >
                  Clear Search
                </Button>
              )}
            </CardContent>
          </Card>
        )}

        {/* CTA Section */}
        <section className="bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 rounded-2xl p-8 border border-primary/20">
          <div className="text-center space-y-4">
            <h2 className="text-2xl font-bold">Don't see your category?</h2>
            <p className="text-muted-foreground">
              Add your product and create a new category.
            </p>
            <Link href="/survey">
              <Button size="lg" className="gap-2">
                <Zap className="h-5 w-5" />
                Add Your Product
              </Button>
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
