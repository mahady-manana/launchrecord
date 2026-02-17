import { NextResponse } from "next/server";
import { z } from "zod";

const loginSchema = z.object({
  apiKey: z.string().min(1),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validatedBody = loginSchema.parse(body);

    const adminApiKey = process.env.ADMIN_API_KEY;

    if (!adminApiKey) {
      return NextResponse.json(
        { success: false, message: "Admin API key not configured." },
        { status: 500 },
      );
    }

    if (validatedBody.apiKey !== adminApiKey) {
      return NextResponse.json(
        { success: false, message: "Invalid API key." },
        { status: 401 },
      );
    }

    return NextResponse.json({
      success: true,
      message: "Authenticated successfully",
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          message: error.errors[0]?.message || "Invalid payload.",
        },
        { status: 400 },
      );
    }

    console.error("Error admin login:", error);
    return NextResponse.json(
      { success: false, message: "Failed to authenticate." },
      { status: 500 },
    );
  }
}
