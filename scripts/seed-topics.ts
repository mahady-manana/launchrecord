/**
 * Seed Topics
 * Run with: npx tsx scripts/seed-topics.ts
 */

import mongoose from "mongoose";
import { connectToDatabase } from "@/lib/db";
import Topic from "@/models/topic";

const topicsData = [
  // Technology & Software
  "SaaS",
  "Artificial Intelligence",
  "Machine Learning",
  "Developer Tools",
  "API",
  "Cloud Infrastructure",
  "DevOps",
  "Cybersecurity",
  "Data Analytics",
  "Business Intelligence",
  "Low-Code/No-Code",
  "Workflow Automation",
  "Integration Platform",
  "Database",
  "Monitoring & Observability",

  // Business & Operations
  "Sales",
  "Marketing",
  "Customer Support",
  "CRM",
  "Project Management",
  "HR & Recruiting",
  "Finance",
  "Accounting",
  "Legal",
  "Compliance",
  "E-commerce",
  "Supply Chain",
  "Inventory Management",
  "Real Estate",
  "Facility Management",

  // Industry Specific
  "Healthcare",
  "FinTech",
  "EdTech",
  "PropTech",
  "LegalTech",
  "HRTech",
  "MarTech",
  "SalesTech",
  "Retail",
  "Hospitality",
  "Construction",
  "Manufacturing",
  "Logistics",
  "Agriculture",
  "Energy",

  // Communication & Collaboration
  "Communication",
  "Team Collaboration",
  "Video Conferencing",
  "Email Marketing",
  "Social Media",
  "Content Management",
  "Knowledge Management",
  "Documentation",
  "Internal Tools",
  "Remote Work",

  // Design & Creative
  "Design",
  "UX/UI",
  "Graphic Design",
  "Video Editing",
  "Animation",
  "3D Modeling",
  "Prototyping",
  "Creative Tools",
  "Asset Management",

  // Emerging Tech
  "Blockchain",
  "Web3",
  "IoT",
  "AR/VR",
  "Metaverse",
  "Quantum Computing",
  "Edge Computing",
  "5G",
];

async function seedTopics() {
  try {
    await connectToDatabase();
    console.log("✓ Connected to database");

    // Clear existing topics (optional - comment out to keep existing)
    // await Topic.deleteMany({});
    // console.log("✓ Cleared existing topics");

    let created = 0;
    let skipped = 0;

    for (const name of topicsData) {
      try {
        const topic = await Topic.findOneAndUpdate(
          { name: { $regex: new RegExp(`^${name}$`, "i") } },
          { name },
          { upsert: true, new: true },
        );

        if (topic.isNew) {
          created++;
          console.log(`✓ Created: ${name}`);
        } else {
          skipped++;
        }
      } catch (error) {
        console.error(`✗ Error creating topic "${name}":`, error);
      }
    }

    const total = await Topic.countDocuments();
    console.log(`\n✓ Seeding complete!`);
    console.log(`  - Created: ${created} topics`);
    console.log(`  - Skipped: ${skipped} topics (already exist)`);
    console.log(`  - Total in DB: ${total} topics`);

    mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error("✗ Seed failed:", error);
    mongoose.connection.close();
    process.exit(1);
  }
}

seedTopics();
