import {
  generateConfirmationEmail,
  generateFeedbackEmail,
} from "@/utils/email-templates";
import { NextRequest, NextResponse } from "next/server";

// In production, use a real email service like SendGrid, Mailgun, AWS SES, or Resend
async function sendEmail(to: string, subject: string, html: string) {
  // Example using Resend (recommended for Next.js projects)
  // Install: npm install resend
  // const { Resend } = require('resend');
  // const resend = new Resend(process.env.RESEND_API_KEY);
  // return await resend.emails.send({
  //   from: 'support@babygearplanner.com',
  //   to,
  //   subject,
  //   html,
  // });

  // For MVP, log to console (in production, use a real email service)
  console.log(`[EMAIL MOCK] Sending to ${to}:`);
  console.log(`Subject: ${subject}`);
  console.log(`Body: ${html.substring(0, 100)}...`);

  return { success: true, messageId: `msg_${Date.now()}` };
}

export async function POST(request: NextRequest) {
  try {
    const { type, email, planName, planAmount } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: "Email address required" },
        { status: 400 },
      );
    }

    let subject = "";
    let html = "";

    if (type === "confirmation") {
      subject = "Your Personalized Baby Gear Plan is Ready ✅";
      html = generateConfirmationEmail(
        email,
        planName || "Personalized Plan",
        planAmount || 39,
      );
    } else if (type === "feedback") {
      subject = "How's Your Personalized Plan Working Out? 💝";
      html = generateFeedbackEmail(email);
    } else {
      return NextResponse.json(
        { error: "Invalid email type" },
        { status: 400 },
      );
    }

    // Send the email
    const result = await sendEmail(email, subject, html);

    if (result.success) {
      return NextResponse.json({
        message: "Email sent successfully",
        messageId: result.messageId,
      });
    } else {
      throw new Error("Failed to send email");
    }
  } catch (error) {
    console.error("Email API error:", error);
    return NextResponse.json(
      { error: "Failed to send email" },
      { status: 500 },
    );
  }
}
