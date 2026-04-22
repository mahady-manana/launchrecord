import { BlogPostMetadata } from "@/types/blog-mdx";
import Link from "next/link";
import { FC } from "react";

interface RessourceSidebarProps {
  items: BlogPostMetadata[];
}
export const RessourceSidebar: FC<RessourceSidebarProps> = ({ items }) => {
  return (
    <aside className="md:sticky top-10 md:w-64 w-full shrink-0 px-4 py-8 bg-slate-50 border border-slate-200 rounded-lg">
      <h3 className="text-xl font-semibold mb-6 text-slate-700">
        Related articles
      </h3>
      <nav className="space-y-4">
        {items.map((item) => (
          <Link
            key={item.slug}
            href={`/ressources/${item.slug}`}
            className="block font-bold pb-6 border-b border-slate-200 text-blue-900 hover:text-primary transition-colors"
          >
            {item.title}
          </Link>
        ))}
      </nav>
    </aside>
  );
};
