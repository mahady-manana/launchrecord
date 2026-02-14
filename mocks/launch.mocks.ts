import { Launch } from "@/types";
import { Placement } from "@/types/placement";

export const mockFeaturedLaunch: Launch = {
  _id: "mock-featured-launch",
  name: "LaunchRecord Pro",
  slug: "launchrecord-pro",
  logoUrl: "/lr-logo.svg",
  tagline: "Supercharge your product launches with advanced analytics",
  description:
    "Get detailed insights on your launch performance with real-time analytics and user engagement metrics.",
  website: "https://launchrecord.com",
  category: "SaaS",
  valueProposition: "Track and optimize your product launches",
  problem: "Lack of insight into launch performance",
  audience: "Startup founders and product managers",
  businessModel: "B2B",
  pricingModel: "paid",
  name: "Launch Team",
  x: "@launchrecord",
  linkedin: "https://linkedin.com/company/launchrecord",
  placement: "hero",
  submittedBy: "mock-user-id",
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

export const mockPlacements: Placement[] = [
  {
    _id: "mock-placement-1",
    title: "Vercel",
    tagline: "Deploy web projects in seconds",
    logoUrl: "/vercel-logo.svg",
    backgroundImage: "/vercel-bg.jpg",
    website: "https://vercel.com",
    placementType: "sidebar",
    position: "left",
    startDate: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
    endDate: new Date(Date.now() + 2592000000).toISOString(), // 30 days from now
    price: 299,
    status: "active",
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: "mock-placement-2",
    title: "Supabase",
    tagline: "The open source Firebase alternative",
    logoUrl: "/supabase-logo.svg",
    backgroundImage: "/placeholder-ads-1.webp",
    website: "https://supabase.com",
    placementType: "featured",
    position: "right",
    startDate: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
    endDate: new Date(Date.now() + 2505600000).toISOString(), // 29 days from now
    price: 399,
    status: "active",
    createdAt: new Date(Date.now() - 172800000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: "mock-placement-3",
    title: "PlanetScale",
    tagline: "Serverless MySQL platform",
    logoUrl: "/planetscale-logo.svg",
    backgroundImage: "/placeholder-ads-1.webp",
    website: "https://planetscale.com",
    placementType: "featured",
    startDate: new Date(Date.now() - 259200000).toISOString(), // 3 days ago
    endDate: new Date(Date.now() + 2419200000).toISOString(), // 28 days from now
    price: 599,
    status: "active",
    createdAt: new Date(Date.now() - 259200000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: "mock-placement-4",
    title: "Tailwind CSS",
    tagline: "Rapidly build modern websites",
    logoUrl: "/tailwind-logo.svg",
    backgroundImage: "/tailwind-bg.jpg",
    website: "https://tailwindcss.com",
    placementType: "sidebar",
    position: "left",
    startDate: new Date(Date.now() - 345600000).toISOString(), // 4 days ago
    endDate: new Date(Date.now() + 2332800000).toISOString(), // 27 days from now
    price: 249,
    status: "active",
    createdAt: new Date(Date.now() - 345600000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: "mock-placement-5",
    title: "Framer",
    tagline: "Build websites visually",
    logoUrl: "/framer-logo.svg",
    backgroundImage: "/placeholder-ads-1.webp",
    website: "https://framer.com",
    placementType: "featured",
    position: "right",
    startDate: new Date(Date.now() - 432000000).toISOString(), // 5 days ago
    endDate: new Date(Date.now() + 2246400000).toISOString(), // 26 days from now
    price: 349,
    status: "active",
    createdAt: new Date(Date.now() - 432000000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export const mockLaunches: Launch[] = [
  {
    _id: "mock-launch-1",
    name: "Project Alpha",
    slug: "project-alpha",
    logoUrl: "/lr-logo.svg",
    tagline: "Revolutionary project management tool",
    description:
      "Streamline your workflow with our intuitive project management solution.",
    website: "https://projectalpha.example.com",
    category: "Productivity",
    valueProposition: "Simplify project management",
    problem: "Complex workflows slowing teams down",
    audience: "Project managers and teams",
    businessModel: "B2B",
    pricingModel: "freemium",
    name: "Alpha Team",
    x: "@projectalpha",
    linkedin: "https://linkedin.com/company/projectalpha",
    placement: "none",
    submittedBy: "mock-user-id-1",
    createdAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
    updatedAt: new Date().toISOString(),
  },
  {
    _id: "mock-launch-2",
    name: "Beta Analytics",
    slug: "beta-analytics",
    logoUrl: "/lr-logo.svg",
    tagline: "Advanced analytics for growing businesses",
    description:
      "Get actionable insights from your business data with our analytics platform.",
    website: "https://betaanalytics.example.com",
    category: "Analytics",
    valueProposition: "Turn data into insights",
    problem: "Difficulty extracting insights from raw data",
    audience: "Business analysts and executives",
    businessModel: "B2B",
    pricingModel: "paid",
    name: "Beta Team",
    x: "@betaanalytics",
    linkedin: "https://linkedin.com/company/betaanalytics",
    placement: "left",
    submittedBy: "mock-user-id-2",
    createdAt: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
    updatedAt: new Date().toISOString(),
  },
  {
    _id: "mock-launch-3",
    name: "Gamma Design",
    slug: "gamma-design",
    logoUrl: "/lr-logo.svg",
    tagline: "Design tools for modern creators",
    description: "Create stunning visuals with our suite of design tools.",
    website: "https://gammadesign.example.com",
    category: "Design",
    valueProposition: "Design made simple",
    problem: "Complex design tools intimidating for beginners",
    audience: "Designers and creators",
    businessModel: "B2C",
    pricingModel: "freemium",
    name: "Gamma Team",
    x: "@gammadesign",
    linkedin: "https://linkedin.com/company/gammadesign",
    placement: "right",
    submittedBy: "mock-user-id-3",
    createdAt: new Date(Date.now() - 259200000).toISOString(), // 3 days ago
    updatedAt: new Date().toISOString(),
  },
];
