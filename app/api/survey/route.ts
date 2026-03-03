import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import User from "@/models/user";
import Product from "@/models/product";

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
      user.earlyAccess = true;
      user.earlyAccessGrantedAt = new Date();
      await user.save();
    } else {
      // Create new whitelisted user with early access
      user = await User.create({
        email: survey.email.toLowerCase(),
        name: survey.founderName,
        founderName: survey.founderName,
        saasName: survey.saasName,
        surveyData: survey,
        whitelisted: true,
        earlyAccess: true,
        earlyAccessGrantedAt: new Date(),
        provider: "credentials",
        role: "user",
        password: "", // No password for whitelist-only users
      });
    }

    // Create incomplete product with early access flag
    const product = await Product.create({
      name: survey.saasName,
      website: survey.saasUrl,
      description: null,
      tagline: null,
      logo: null,
      user: user._id,
      score: null,
      earlyAccess: true,
      earlyAccessGrantedAt: new Date(),
      surveyData: survey,
    });

    return NextResponse.json({
      message: "Survey saved successfully. Welcome to LaunchRecord!",
      productId: product._id,
      userId: user._id,
    });
  } catch (error) {
    console.error("Survey API error:", error);
    return NextResponse.json(
      { error: "Failed to process survey" },
      { status: 500 }
    );
  }
}
