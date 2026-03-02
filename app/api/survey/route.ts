import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import User from "@/models/user";

// Interface for survey responses
interface SurveyData {
  email: string;
  founderName: string;
  saasName: string;
  saasUrl: string;
  role: string;
  teamSize: string;
  revenue: string;
  biggestChallenge: string;
  aeoAwareness: string;
  competitorThreat: string;
  willingToInvest: string;
}

// Calculate Genericity Score (mock algorithm for pre-audit)
function calculateGenericityScore(url: string): number {
  // In production, this would analyze the actual website
  // For now, return a random score between 40-85
  const hash = url.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return 40 + (hash % 46);
}

// Generate Sovereign Rank
function generateSovereignRank(): number {
  return Math.floor(Math.random() * 100) + 1;
}

// Generate personalized insights based on survey
function generateInsights(survey: SurveyData) {
  const genericityScore = calculateGenericityScore(survey.saasUrl);
  const sovereignRank = generateSovereignRank();

  const insights: any = {
    email: survey.email,
    founderName: survey.founderName,
    saasName: survey.saasName,
    saasUrl: survey.saasUrl,
    genericityScore,
    sovereignRank,
    diagnostics: {
      aeoPulse: {
        mentionShare: (Math.random() * 15).toFixed(1) + "%",
        sectorAverage: "12%",
        firstMentionPosition: Math.random() > 0.5 ? "N/A" : `#${Math.floor(Math.random() * 10) + 1}`,
        diagnosis:
          genericityScore > 70
            ? "Your positioning is too feature-heavy. LLMs are categorizing you as a utility, not a leader."
            : "Strong differentiation detected. Continue reinforcing outcome-based language.",
      },
      marketPositionVector: {
        genericityScore,
        riskLevel: genericityScore > 70 ? "HIGH" : genericityScore > 50 ? "MEDIUM" : "LOW",
        overlapCount: Math.floor(Math.random() * 10) + 1,
        differentiationDelta: `-${Math.floor(Math.random() * 20)}%`,
      },
      founderProofVault: {
        shippingConsistency: survey.role.includes("solo") ? "N/A" : `${Math.floor(Math.random() * 40 + 60)}%`,
        revenueVelocity: survey.revenue === "pre-revenue" ? "N/A" : (Math.random() * 3).toFixed(1),
        socialProofStrength: ["Weak", "Moderate", "Strong"][Math.floor(Math.random() * 3)],
      },
      aiThreatRadar: {
        threatLevel: ["LOW", "MEDIUM", "HIGH", "RED"][Math.floor(Math.random() * 4)],
        roadmapOverlap: `${Math.floor(Math.random() * 60)}%`,
        recommendedAction:
          survey.competitorThreat.includes("existential") ||
          survey.competitorThreat.includes("very")
            ? "Pivot from 'Data Capture' to 'Proprietary Data Synthesis' before the API becomes a commodity."
            : "Monitor closely. Build moat around unique data assets.",
      },
      productClarityIndex: {
        cfoClarity: Math.floor(Math.random() * 5) + 2,
        techLeadClarity: Math.floor(Math.random() * 4) + 6,
        timeToAha: `${Math.floor(Math.random() * 40 + 20)}s`,
        targetTime: "15s",
      },
    },
    recommendedTier:
      survey.willingToInvest === "299-tier"
        ? "Tier 3: The Ego-Play"
        : survey.willingToInvest === "99-tier"
        ? "Tier 2: The Retention"
        : "Tier 1: The Hook",
    actionPlan: [
      "Rewrite H1: Use the 'Sovereign Outcome' formula provided in your dashboard.",
      "Submit Proof: 5 minutes of a recorded user demo where the user says 'I get it now.'",
      "AEO Seed: Post one technical deep-dive on Reddit/X to seed the Generative Engine.",
    ],
  };

  return insights;
}

export async function POST(request: NextRequest) {
  try {
    const survey: SurveyData = await request.json();

    // Validate survey data
    if (!survey.email || !survey.founderName || !survey.saasName) {
      return NextResponse.json(
        { error: "Incomplete survey data" },
        { status: 400 }
      );
    }

    // Connect to database
    await connectToDatabase();

    // Check if user already exists
    let user = await User.findOne({ email: survey.email.toLowerCase() });

    if (user) {
      // Update existing user
      user.founderName = survey.founderName;
      user.saasName = survey.saasName;
      user.surveyData = survey;
      user.whitelisted = true;
      await user.save();
    } else {
      // Create new whitelisted user
      user = await User.create({
        email: survey.email.toLowerCase(),
        name: survey.founderName,
        founderName: survey.founderName,
        saasName: survey.saasName,
        surveyData: survey,
        whitelisted: true,
        provider: "credentials",
        role: "user",
        password: "", // No password for whitelist-only users
      });
    }

    // Generate personalized insights
    const insights = generateInsights(survey);

    // Create session ID
    const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    return NextResponse.json({
      sessionId,
      userId: user._id,
      message: "Survey saved successfully. Welcome to LaunchRecord!",
      insights,
    });
  } catch (error) {
    console.error("Survey API error:", error);
    return NextResponse.json(
      { error: "Failed to process survey" },
      { status: 500 }
    );
  }
}

// GET endpoint to retrieve insights
export async function GET(request: NextRequest) {
  try {
    const sessionId = request.nextUrl.searchParams.get("session");
    const userId = request.nextUrl.searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({ error: "User ID required" }, { status: 400 });
    }

    await connectToDatabase();
    const user = await User.findById(userId);

    if (!user || !user.surveyData) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const insights = generateInsights(user.surveyData as SurveyData);

    return NextResponse.json({
      sessionId,
      userId: user._id,
      founderName: user.founderName,
      saasName: user.saasName,
      insights,
    });
  } catch (error) {
    console.error("Get insights API error:", error);
    return NextResponse.json(
      { error: "Failed to retrieve insights" },
      { status: 500 }
    );
  }
}
