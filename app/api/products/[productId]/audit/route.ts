import { connectToDatabase } from "@/lib/db";
import { getUserSession } from "@/lib/session";
import Product from "@/models/product";
import Subscription from "@/models/subscription";
import Usage from "@/models/usage";
import { jsonError, jsonSuccess } from "@/utils/response";
import { isSameOrigin } from "@/utils/security";
import { NextRequest } from "next/server";

// Plan limits configuration
const PLAN_LIMITS: Record<string, { monthly: number; weekly: number }> = {
  free: { monthly: 3, weekly: 0 },
  founder: { monthly: 10, weekly: 1 },
  growth: { monthly: 30, weekly: 5 },
  sovereign: { monthly: 9999, weekly: 9999 }, // Essentially unlimited
};

function getWeekBounds(date: Date) {
  const now = new Date(date);
  const dayOfWeek = now.getDay(); // 0 = Sunday
  const diff = now.getDate() - dayOfWeek; // Start from Sunday
  
  const weekStart = new Date(now);
  weekStart.setDate(diff);
  weekStart.setHours(0, 0, 0, 0);
  
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 7);
  weekEnd.setMilliseconds(-1);
  
  return { weekStart, weekEnd };
}

function getMonthBounds(date: Date) {
  const now = new Date(date);
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
  
  return { monthStart, monthEnd };
}

async function checkAndUpdateUsage(productId: string, planType: string) {
  const now = new Date();
  const { weekStart, weekEnd } = getWeekBounds(now);
  const { monthStart, monthEnd } = getMonthBounds(now);
  
  // Find or create usage record
  let usage = await Usage.findOne({
    productId,
    periodStart: { $gte: monthStart },
  });
  
  const limits = PLAN_LIMITS[planType] || PLAN_LIMITS.free;
  
  if (!usage) {
    // Create new usage record for new month
    usage = await Usage.create({
      productId,
      periodStart: monthStart,
      periodEnd: monthEnd,
      auditsUsed: 0,
      auditsLimit: limits.monthly,
      weeklyAuditUsed: 0,
      weeklyAuditLimit: limits.weekly,
      weekStart,
      weekEnd,
      resetAt: monthEnd,
    });
  } else {
    // Check if week has reset
    if (usage.weekEnd < now) {
      usage.weeklyAuditUsed = 0;
      usage.weekStart = weekStart;
      usage.weekEnd = weekEnd;
    }
    
    // Update limits in case plan changed
    usage.auditsLimit = limits.monthly;
    usage.weeklyAuditLimit = limits.weekly;
    usage.periodEnd = monthEnd;
    usage.resetAt = monthEnd;
    
    await usage.save();
  }
  
  return usage;
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ productId: string }> }
) {
  if (!isSameOrigin(request)) {
    return jsonError("Invalid origin", 403);
  }

  const session = await getUserSession({ required: true });
  if (!session.user) {
    return jsonError("Unauthorized", 401);
  }

  const { productId } = await params;

  await connectToDatabase();

  // Verify user has access to this product
  const product = await Product.findOne({
    _id: productId,
    users: session.user.id,
    deletedAt: null,
  });

  if (!product) {
    return jsonError("Product not found or access denied", 404);
  }

  // Get subscription for this product
  const subscription = await Subscription.findOne({
    productId,
    deletedAt: null,
  }).sort({ createdAt: -1 });

  const planType = subscription?.status === "active" ? subscription.planType : "free";
  
  // Check and update usage
  const usage = await checkAndUpdateUsage(productId, planType);
  
  // Check weekly limit
  if (usage.weeklyAuditUsed >= usage.weeklyAuditLimit) {
    return jsonError(
      `Weekly audit limit reached (${usage.weeklyAuditUsed}/${usage.weeklyAuditLimit}). Resets on ${usage.weekEnd.toLocaleDateString()}`,
      429
    );
  }
  
  // Check monthly limit
  if (usage.auditsUsed >= usage.auditsLimit) {
    return jsonError(
      `Monthly audit limit reached (${usage.auditsUsed}/${usage.auditsLimit}). Resets on ${usage.periodEnd.toLocaleDateString()}`,
      429
    );
  }

  // Increment usage counters
  usage.auditsUsed += 1;
  usage.weeklyAuditUsed += 1;
  await usage.save();

  // TODO: Run the actual audit logic here
  // For now, return success with usage info
  return jsonSuccess({
    message: "Audit completed successfully",
    usage: {
      auditsUsed: usage.auditsUsed,
      auditsLimit: usage.auditsLimit,
      weeklyAuditUsed: usage.weeklyAuditUsed,
      weeklyAuditLimit: usage.weeklyAuditLimit,
      resetsOn: usage.periodEnd.toLocaleDateString(),
      weekResetsOn: usage.weekEnd.toLocaleDateString(),
    },
  });
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ productId: string }> }
) {
  const session = await getUserSession({ required: true });
  if (!session.user) {
    return jsonError("Unauthorized", 401);
  }

  const { productId } = await params;

  await connectToDatabase();

  const product = await Product.findOne({
    _id: productId,
    users: session.user.id,
    deletedAt: null,
  });

  if (!product) {
    return jsonError("Product not found or access denied", 404);
  }

  const subscription = await Subscription.findOne({
    productId,
    deletedAt: null,
  }).sort({ createdAt: -1 });

  const planType = subscription?.status === "active" ? subscription.planType : "free";
  
  const usage = await checkAndUpdateUsage(productId, planType);

  return jsonSuccess({
    usage: {
      planType,
      auditsUsed: usage.auditsUsed,
      auditsLimit: usage.auditsLimit,
      weeklyAuditUsed: usage.weeklyAuditUsed,
      weeklyAuditLimit: usage.weeklyAuditLimit,
      resetsOn: usage.periodEnd.toLocaleDateString(),
      weekResetsOn: usage.weekEnd.toLocaleDateString(),
    },
  });
}
