import { Metadata } from "next/types";
import { ReactNode } from "react";
const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const { metadata } = await import(`@/content/ressources/${slug}.mdx`);
  const title = metadata.title;
  const description = metadata?.description;
  const keywords = metadata?.keywords?.split(",").map((k: string) => k.trim());
  return {
    title,
    description,
    metadataBase: new URL(appUrl),
    openGraph: {
      title,
      description,
      url: `${appUrl}/ressources/${slug}`,
      siteName: "LaunchRecord",
      type: "article",
      modifiedTime: new Date(
        metadata.lastUpdated || metadata.published,
      ).toISOString(),
      publishedTime: new Date(metadata.published).toISOString(),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
    keywords: keywords,
    authors: [{ name: "LaunchRecord", url: appUrl }],
    creator: "LaunchRecord",
    publisher: "LaunchRecord",
    alternates: {
      canonical: `${appUrl}/ressources/${slug}`,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
  };
}
const getdata = (slug: string) => {
  try {
    return import(`@/content/ressources/${slug}.mdx`);
  } catch (error) {
    return null;
  }
};
export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const data = await getdata(slug);
  if (!data) {
    return <div className="text-center py-20">Resource not found.</div>;
  }
  const { default: Post, metadata } = data;
  const overrideComponents = {
    h1: CustomH1,
    section: Section,
    h2: CustomH2,
    blockquote: Blockquote,
    h3: CustomH3,
    h4: CustomH4,
    p: PorCTA,
  };

  const meta = {
    image: metadata.image,
    title: metadata.title,
    description: metadata.description,
    lastUpdated: metadata.lastUpdated,
  };

  return (
    <div className="">
      <section className="relative bg-gradient-to-b pt-20 flex justify-between flex-col from-white via-blue-50 to-purple-50">
        <div className="max-w-4xl px-4 mx-auto relative flex-1 flex flex-col justify-center">
          <h1 className="text-4xl font-bold mt-8 tracking-tighter text-slate-700">
            {metadata.title}
          </h1>
          <p className="text-lg text-slate-600 my-4">{metadata.description}</p>
          <p className="text-slate-500 my-4">
            Last updated: {new Date(metadata.lastUpdated).toLocaleDateString()}
          </p>
        </div>
        <div className="w-full inset-0">
          <img
            src="/images/line-1.svg"
            alt={metadata.title}
            className="w-full h-full object-cover max-h-[100px] "
          />
        </div>
      </section>
      <div className="max-w-4xl mx-auto py-20 px-4">
        <Post components={overrideComponents} />
      </div>
    </div>
  );
}

export function generateStaticParams() {
  return [{ slug: "welcome" }, { slug: "what-is-startup-positioning" }];
}

function CustomH1({ children }: { children: ReactNode }) {
  return (
    <h1 className="text-4xl font-medium py-8 tracking-tighter text-slate-700">
      {children}
    </h1>
  );
}
function CustomH2({ children }: { children: ReactNode }) {
  return (
    <h2 className="text-3xl font-medium pt-8 pb-4 tracking-tighter text-slate-700">
      {children}
    </h2>
  );
}
function CustomH3({ children }: { children: ReactNode }) {
  return (
    <h3 className="text-xl font-medium pt-8 pb-4 tracking-tighter text-slate-700">
      {children}
    </h3>
  );
}
function CustomH4({ children }: { children: ReactNode }) {
  return (
    <h4 className="text-lg font-medium pt-8 pb-4 tracking-tighter text-slate-700">
      {children}
    </h4>
  );
}
function Section({ children }: { children: ReactNode }) {
  return <section className="py-8">{children}</section>;
}
function Blockquote({ children }: { children: ReactNode }) {
  return (
    <blockquote className="border-l-4 bg-slate-50 py-2 my-4 border-primary pl-4 italic text-lg text-slate-600">
      {children}
    </blockquote>
  );
}

function PorCTA({ children }: { children: ReactNode }) {
  if (!children) return null;
  if (typeof children === "string" && children.trim() === "#CTA_PLACEHOLDER#")
    return (
      <div>
        <p>This is a CTA placement!</p>
      </div>
    );
  return <p>{children}</p>;
}
export const dynamicParams = false;
