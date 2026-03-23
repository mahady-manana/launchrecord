/**
 * Migration Script: Separate SIO and Positioning Audit Counters
 * 
 * This script migrates existing usage records to use separate counters
 * for SIO audits and positioning audits instead of shared counters.
 * 
 * Usage: npx tsx scripts/migrate-usage-separate-counters.ts
 */

import mongoose from "mongoose";

async function migrate() {
  console.log("🚀 Starting migration: Separate audit counters...\n");

  // Connect to database
  const MONGODB_URI = process.env.MONGODB_URI;
  if (!MONGODB_URI) {
    console.error("❌ Error: MONGODB_URI environment variable not set");
    process.exit(1);
  }

  await mongoose.connect(MONGODB_URI);
  console.log("✅ Connected to MongoDB\n");

  // Get Usage model
  const Usage = mongoose.model("Usage", new mongoose.Schema({
    productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
    periodStart: Date,
    periodEnd: Date,
    // Legacy fields
    auditsUsed: Number,
    auditsLimit: Number,
    weeklyAuditUsed: Number,
    weeklyAuditLimit: Number,
    // New SIO fields
    sioAuditsUsed: Number,
    sioAuditsLimit: Number,
    sioWeeklyAuditUsed: Number,
    sioWeeklyAuditLimit: Number,
    // New Positioning fields
    positioningAuditsUsed: Number,
    positioningAuditsLimit: Number,
    positioningWeeklyAuditUsed: Number,
    positioningWeeklyAuditLimit: Number,
    weekStart: Date,
    weekEnd: Date,
    resetAt: Date,
  }, { timestamps: true }));

  // Find all usage records with legacy fields
  const legacyRecords = await Usage.find({
    $or: [
      { auditsUsed: { $exists: true } },
      { auditsLimit: { $exists: true } },
    ],
  });

  console.log(`📊 Found ${legacyRecords.length} usage records with legacy fields\n`);

  if (legacyRecords.length === 0) {
    console.log("✅ No records need migration. Done!\n");
    await mongoose.disconnect();
    return;
  }

  let updated = 0;
  let skipped = 0;

  for (const record of legacyRecords) {
    try {
      const update: any = {};

      // Migrate legacy counters to SIO counters
      if (record.auditsUsed !== undefined) {
        update.sioAuditsUsed = record.auditsUsed;
      }
      if (record.auditsLimit !== undefined) {
        update.sioAuditsLimit = record.auditsLimit;
      }
      if (record.weeklyAuditUsed !== undefined) {
        update.sioWeeklyAuditUsed = record.weeklyAuditUsed;
      }
      if (record.weeklyAuditLimit !== undefined) {
        update.sioWeeklyAuditLimit = record.weeklyAuditLimit;
      }

      // Initialize positioning counters with same limits but 0 usage
      // (assuming positioning audit is a new feature)
      if (record.auditsLimit !== undefined) {
        update.positioningAuditsLimit = record.auditsLimit;
      }
      if (record.weeklyAuditLimit !== undefined) {
        update.positioningWeeklyAuditLimit = record.weeklyAuditLimit;
      }
      
      // Set positioning usage to 0 if not already set
      if (update.positioningAuditsUsed === undefined) {
        update.positioningAuditsUsed = 0;
      }
      if (update.positioningWeeklyAuditUsed === undefined) {
        update.positioningWeeklyAuditUsed = 0;
      }

      await Usage.updateOne(
        { _id: record._id },
        { $set: update },
      );

      updated++;
      console.log(`  ✓ Migrated record ${record._id}`);
    } catch (error) {
      skipped++;
      console.error(`  ✗ Failed to migrate record ${record._id}:`, error);
    }
  }

  console.log(`\n📈 Migration Summary:`);
  console.log(`   - Updated: ${updated}`);
  console.log(`   - Skipped: ${skipped}`);
  console.log(`   - Total: ${legacyRecords.length}`);

  // Verify migration
  const verifySio = await Usage.countDocuments({
    sioAuditsUsed: { $exists: true },
  });
  const verifyPositioning = await Usage.countDocuments({
    positioningAuditsUsed: { $exists: true },
  });

  console.log(`\n✅ Verification:`);
  console.log(`   - Records with sioAuditsUsed: ${verifySio}`);
  console.log(`   - Records with positioningAuditsUsed: ${verifyPositioning}`);

  await mongoose.disconnect();
  console.log("\n✅ Migration completed successfully!\n");
}

// Run migration
migrate().catch((error) => {
  console.error("❌ Migration failed:", error);
  process.exit(1);
});
