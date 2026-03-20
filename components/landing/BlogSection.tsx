"use client";

import { ArrowRight, BookOpen } from "lucide-react";
import Link from "next/link";

interface BlogPost {
  title: string;
  description: string;
  href: string;
  category: string;
  categoryColor: string;
  readTime: string;
}

export function BlogSection() {
  const posts: BlogPost[] = [
    {
      title: "Will AEO Commoditize SEO?",
      description:
        "For 20 years, SEO has been a craft. But AEO is changing the rules. Mechanical optimization is being automated. Strategy won't be.",
      href: "/blog/will-aeo-commoditize-seo",
      category: "Strategic Analysis",
      categoryColor: "bg-gradient-to-r from-purple-100 to-orange-100 text-purple-800",
      readTime: "8 min read",
    },
    {
      title: "5 Things You Need to Know About AEO",
      description:
        "What AEO is, why it matters, how it works, who needs it, and where to start optimizing for AI visibility.",
      href: "/blog/5-things-you-need-to-know-about-aeo#thing-2",
      category: "Essential Guide",
      categoryColor: "bg-purple-100 text-purple-800",
      readTime: "10 min read",
    },
    {
      title: "AEO vs SEO: What's the Difference & What Actually Matters",
      description:
        "Complete guide comparing AEO and SEO. Learn the key differences, what matters for AI visibility, and how to optimize for both.",
      href: "/aeo-vs-seo",
      category: "Comparison",
      categoryColor: "bg-orange-100 text-orange-800",
      readTime: "15 min read",
    },
  ];

  return (
    <section className="py-16 px-4 bg-gradient-to-b from-slate-50 to-white">
      <div className="max-w-7xl mx-auto space-y-12">
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 bg-purple-100 px-4 py-1.5 rounded-lg text-purple-800 text-sm font-medium">
            <BookOpen className="h-4 w-4" />
            <span>From the Blog</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-bold text-slate-800">
            Latest Insights on{" "}
            <span className="bg-gradient-to-r from-purple-600 to-orange-500 bg-clip-text text-transparent">
              AEO & AI Search
            </span>
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Stay ahead of the AI revolution. Expert analysis on Answer Engine
            Optimization, search strategy, and digital visibility in the age of
            AI.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {posts.map((post, idx) => (
            <Link
              key={idx}
              href={post.href}
              className="group bg-white border border-slate-200 rounded-2xl p-6 hover:shadow-xl hover:border-purple-200 transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-4">
                <span
                  className={`text-xs font-semibold px-3 py-1 rounded-full ${post.categoryColor}`}
                >
                  {post.category}
                </span>
                <span className="text-xs text-slate-500">{post.readTime}</span>
              </div>

              <h3 className="text-xl font-bold text-slate-800 mb-3 group-hover:text-purple-600 transition-colors line-clamp-2">
                {post.title}
              </h3>

              <p className="text-slate-600 text-sm leading-relaxed mb-6 line-clamp-3">
                {post.description}
              </p>

              <div className="flex items-center text-purple-600 font-medium text-sm group-hover:gap-2 transition-all">
                <span>Read Article</span>
                <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>

        <div className="text-center">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            View All Articles
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
