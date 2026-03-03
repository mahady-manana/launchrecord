/**
 * Seed Products
 * Run with: npx tsx scripts/seed-products.ts
 *
 * All fields are optional for bulk creation.
 * Products can be created with just name, or with full details.
 */

import mongoose from "mongoose";
import { connectToDatabase } from "@/lib/db";
import Product from "@/models/product";
import Topic from "@/models/topic";

interface ProductSeedData {
  name: string;
  description?: string;
  tagline?: string;
  logo?: string;
  website?: string;
  topics?: string[];
  score?: number;
}

const productsData: ProductSeedData[] = [
  // AI & Machine Learning Products
  {
    name: "Claude Pro",
    description:
      "Advanced AI assistant for complex reasoning, coding, and creative tasks with extended context windows.",
    tagline: "Think deeper with AI",
    website: "https://claude.ai",
    topics: ["Artificial Intelligence", "SaaS", "Developer Tools"],
    score: 85,
  },
  {
    name: "Jasper",
    description:
      "AI content platform for marketing teams to generate branded content at scale.",
    tagline: "AI content for teams",
    website: "https://jasper.ai",
    topics: ["Artificial Intelligence", "Marketing", "Content Management"],
    score: 72,
  },
  {
    name: "Runway",
    description:
      "AI-powered creative tools for video editing, generation, and visual effects.",
    tagline: "AI magic tools",
    website: "https://runwayml.com",
    topics: ["Artificial Intelligence", "Video Editing", "Design"],
    score: 78,
  },
  {
    name: "Midjourney",
    description:
      "Generative AI program that creates images from natural language descriptions.",
    tagline: "Imagine with AI",
    website: "https://midjourney.com",
    topics: ["Artificial Intelligence", "Graphic Design", "Creative Tools"],
    score: 91,
  },
  {
    name: "Hugging Face",
    description:
      "Platform for building, training, and deploying machine learning models with community collaboration.",
    tagline: "The AI community building the future",
    website: "https://huggingface.co",
    topics: ["Machine Learning", "Developer Tools", "API"],
    score: 88,
  },

  // Developer Tools
  {
    name: "Vercel",
    description:
      "Platform for frontend developers to build, deploy, and scale web applications.",
    tagline: "Develop. Preview. Ship.",
    website: "https://vercel.com",
    topics: ["Developer Tools", "Cloud Infrastructure", "DevOps"],
    score: 82,
  },
  {
    name: "Supabase",
    description:
      "Open source Firebase alternative with PostgreSQL database and real-time subscriptions.",
    tagline: "Build in a weekend, scale to millions",
    website: "https://supabase.com",
    topics: ["Developer Tools", "Database", "Cloud Infrastructure"],
    score: 79,
  },
  {
    name: "Railway",
    description:
      "Cloud platform that makes it easy to run online applications and services.",
    tagline: "The internet, on your terms",
    website: "https://railway.app",
    topics: ["Developer Tools", "Cloud Infrastructure", "DevOps"],
    score: 71,
  },
  {
    name: "Linear",
    description:
      "Issue tracking tool designed for software development teams with keyboard-first workflow.",
    tagline: "A better way to build products",
    website: "https://linear.app",
    topics: ["Project Management", "Developer Tools", "SaaS"],
    score: 84,
  },
  {
    name: "Raycast",
    description:
      "Blazingly fast, totally extendable launcher that lets you complete tasks in seconds.",
    tagline: "Your shortcut to everything",
    website: "https://raycast.com",
    topics: ["Developer Tools", "Workflow Automation", "SaaS"],
    score: 76,
  },

  // Sales & Marketing
  {
    name: "HubSpot",
    description:
      "Full-stack CRM platform with marketing, sales, and customer service tools.",
    tagline: "Grow better with HubSpot",
    website: "https://hubspot.com",
    topics: ["CRM", "Sales", "Marketing"],
    score: 68,
  },
  {
    name: "Outreach",
    description:
      "Sales engagement platform that helps teams create and close more pipeline.",
    tagline: "The first sales execution platform",
    website: "https://outreach.io",
    topics: ["Sales", "SalesTech", "SaaS"],
    score: 65,
  },
  {
    name: "Gong",
    description:
      "Revenue intelligence platform that captures and analyzes customer interactions.",
    tagline: "Realize your full potential",
    website: "https://gong.io",
    topics: ["Sales", "Artificial Intelligence", "SalesTech"],
    score: 74,
  },
  {
    name: "Drift",
    description:
      "Conversational marketing platform that connects businesses with customers in real-time.",
    tagline: "The conversational marketing platform",
    website: "https://drift.com",
    topics: ["Marketing", "Communication", "SaaS"],
    score: 58,
  },
  {
    name: "Intercom",
    description:
      "Conversational relationship platform for customer support and engagement.",
    tagline: "The engagement OS",
    website: "https://intercom.com",
    topics: ["Customer Support", "Communication", "SaaS"],
    score: 70,
  },

  // Design & Creative
  {
    name: "Figma",
    description:
      "Collaborative interface design tool for creating, prototyping, and shipping designs.",
    tagline: "Nothing great is made alone",
    website: "https://figma.com",
    topics: ["Design", "UX/UI", "Team Collaboration"],
    score: 93,
  },
  {
    name: "Canva",
    description:
      "Online design and publishing tool with drag-and-drop features and templates.",
    tagline: "Empower the world to design",
    website: "https://canva.com",
    topics: ["Design", "Graphic Design", "SaaS"],
    score: 89,
  },
  {
    name: "Notion",
    description:
      "All-in-one workspace for notes, docs, wikis, and project management.",
    tagline: "Your wiki, docs, and projects. Together.",
    website: "https://notion.so",
    topics: ["Knowledge Management", "Project Management", "SaaS"],
    score: 87,
  },
  {
    name: "Loom",
    description:
      "Video messaging tool for async communication at work with screen recording.",
    tagline: "Your words, at their pace",
    website: "https://loom.com",
    topics: ["Communication", "Video Conferencing", "Remote Work"],
    score: 75,
  },
  {
    name: "Framer",
    description:
      "Web design tool that lets you design and publish websites with AI assistance.",
    tagline: "Start with AI, finish with design",
    website: "https://framer.com",
    topics: ["Design", "Web Design", "Artificial Intelligence"],
    score: 73,
  },

  // Data & Analytics
  {
    name: "Mixpanel",
    description:
      "Product analytics platform for tracking user engagement and behavior.",
    tagline: "Build better products with data",
    website: "https://mixpanel.com",
    topics: ["Data Analytics", "Business Intelligence", "SaaS"],
    score: 67,
  },
  {
    name: "Amplitude",
    description:
      "Digital optimization system for product teams to build better products.",
    tagline: "Be the best product team",
    website: "https://amplitude.com",
    topics: ["Data Analytics", "Business Intelligence", "SaaS"],
    score: 69,
  },
  {
    name: "Segment",
    description:
      "Customer data platform that collects, cleans, and activates first-party data.",
    tagline: "The foundation for customer data",
    website: "https://segment.com",
    topics: ["Data Analytics", "Marketing", "API"],
    score: 71,
  },
  {
    name: "Looker",
    description:
      "Business intelligence and data platform for exploring and sharing insights.",
    tagline: "Data-driven decisions for everyone",
    website: "https://looker.com",
    topics: ["Business Intelligence", "Data Analytics", "SaaS"],
    score: 64,
  },
  {
    name: "Retool",
    description:
      "Low-code platform for building internal tools and admin panels quickly.",
    tagline: "Build software, faster",
    website: "https://retool.com",
    topics: ["Low-Code/No-Code", "Developer Tools", "Internal Tools"],
    score: 77,
  },

  // Finance & Operations
  {
    name: "Stripe",
    description:
      "Financial infrastructure platform for online payments and business operations.",
    tagline: "Financial infrastructure for the internet",
    website: "https://stripe.com",
    topics: ["FinTech", "Payments", "API"],
    score: 95,
  },
  {
    name: "Plaid",
    description:
      "Financial services API platform connecting apps to users' bank accounts.",
    tagline: "The easiest way to connect your financial accounts",
    website: "https://plaid.com",
    topics: ["FinTech", "API", "Banking"],
    score: 81,
  },
  {
    name: "Brex",
    description:
      "Financial platform for growing companies with corporate cards and expense management.",
    tagline: "The AI-powered spend platform",
    website: "https://brex.com",
    topics: ["FinTech", "Finance", "SaaS"],
    score: 66,
  },
  {
    name: "Ramp",
    description:
      "Finance automation platform with corporate cards, bill payments, and expense management.",
    tagline: "The finance automation platform",
    website: "https://ramp.com",
    topics: ["FinTech", "Finance", "Accounting"],
    score: 72,
  },
  {
    name: "Mercury",
    description:
      "Banking platform designed for startups with powerful financial tools.",
    tagline: "Banking for startups",
    website: "https://mercury.com",
    topics: ["FinTech", "Banking", "SaaS"],
    score: 68,
  },

  // Infrastructure & DevOps
  {
    name: "Datadog",
    description:
      "Monitoring and security platform for cloud applications with real-time observability.",
    tagline: "See inside any system",
    website: "https://datadoghq.com",
    topics: ["Monitoring & Observability", "DevOps", "Cloud Infrastructure"],
    score: 78,
  },
  {
    name: "Sentry",
    description:
      "Application monitoring platform for tracking errors and performance issues.",
    tagline: "Where code meets data",
    website: "https://sentry.io",
    topics: ["Monitoring & Observability", "Developer Tools", "DevOps"],
    score: 74,
  },
  {
    name: "Vercel",
    description:
      "Frontend cloud platform for building and shipping modern web experiences.",
    tagline: "Develop. Preview. Ship.",
    website: "https://vercel.com",
    topics: ["Cloud Infrastructure", "Developer Tools", "DevOps"],
    score: 82,
  },
  {
    name: "Netlify",
    description:
      "Platform for modern web development with continuous deployment and serverless functions.",
    tagline: "Build for the modern web",
    website: "https://netlify.com",
    topics: ["Cloud Infrastructure", "Developer Tools", "DevOps"],
    score: 76,
  },
  {
    name: "Cloudflare",
    description:
      "Web infrastructure and security company providing CDN, DNS, and DDoS protection.",
    tagline: "Help build a better internet",
    website: "https://cloudflare.com",
    topics: ["Cybersecurity", "Cloud Infrastructure", "DevOps"],
    score: 85,
  },

  // Minimal products (name only for bulk testing)
  {
    name: "Acme Analytics",
  },
  {
    name: "Beta Builder",
  },
  {
    name: "CloudSync Pro",
  },
  {
    name: "DataFlow",
  },
  {
    name: "EdgeCompute",
  },
  {
    name: "FlowState",
  },
  {
    name: "GridLock",
  },
  {
    name: "HyperScale",
  },
  {
    name: "InnovateLab",
  },
  {
    name: "JumpStart AI",
  },
];

async function seedProducts() {
  try {
    await connectToDatabase();
    console.log("✓ Connected to database");

    // Pre-fetch all topics for faster lookup
    const allTopics = await Topic.find();
    const topicMap = new Map(
      allTopics.map((t) => [t.name.toLowerCase(), t._id]),
    );
    console.log(`✓ Loaded ${allTopics.length} topics for reference`);

    let created = 0;
    let updated = 0;
    let skipped = 0;

    for (const productData of productsData) {
      try {
        // Find topic IDs for this product
        const topicIds: mongoose.Types.ObjectId[] = [];
        if (productData.topics) {
          for (const topicName of productData.topics) {
            const topicId = topicMap.get(topicName.toLowerCase());
            if (topicId) {
              topicIds.push(topicId);
            }
          }
        }

        // Build update object (only include provided fields)
        const updateData: Partial<ProductSeedData> = {
          name: productData.name,
        };

        if (productData.description) updateData.description = productData.description;
        if (productData.tagline) updateData.tagline = productData.tagline;
        if (productData.logo) updateData.logo = productData.logo;
        if (productData.website) updateData.website = productData.website;
        if (productData.score !== undefined) updateData.score = productData.score;
        if (topicIds.length > 0) updateData.topics = topicIds as any;

        // Upsert product
        const product = await Product.findOneAndUpdate(
          { name: productData.name },
          updateData,
          { upsert: true, new: true },
        );

        if (product.isNew) {
          created++;
          console.log(`✓ Created: ${productData.name}`);
        } else {
          updated++;
          console.log(`✓ Updated: ${productData.name}`);
        }
      } catch (error) {
        console.error(`✗ Error creating product "${productData.name}":`, error);
        skipped++;
      }
    }

    const total = await Product.countDocuments();
    console.log(`\n✓ Seeding complete!`);
    console.log(`  - Created: ${created} products`);
    console.log(`  - Updated: ${updated} products`);
    console.log(`  - Skipped: ${skipped} products (errors)`);
    console.log(`  - Total in DB: ${total} products`);

    mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error("✗ Seed failed:", error);
    mongoose.connection.close();
    process.exit(1);
  }
}

seedProducts();
