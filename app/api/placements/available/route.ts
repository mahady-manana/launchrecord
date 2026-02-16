import Placement from "@/lib/models/placement";
import { connectToDatabase } from "@/lib/mongodb";
import { PlacementSlot } from "@/types/placement";
import { NextResponse } from "next/server";

// Define available placement slots with prices and durations
const ALL_SLOTS: PlacementSlot[] = [
  // Featured hero placements (3 available)
  {
    id: "hero-1",
    name: "Hero Banner - Top Position",
    position: "hero",
    type: "featured",
    price: 599,
    duration: 20,
    codeName: "HERO-001",
    isAvailable: true,
    description:
      "Premium hero banner at the top of the homepage with maximum visibility (1st slide)",
  },
  {
    id: "hero-2",
    name: "Hero Banner - Middle Position",
    position: "hero",
    type: "featured",
    price: 599,
    duration: 20,
    codeName: "HERO-002",
    isAvailable: true,
    description:
      "Premium hero banner at the top of the homepage with maximum visibility (2nd slide)",
  },
  {
    id: "hero-3",
    name: "Hero Banner - Bottom Position",
    position: "hero",
    type: "featured",
    price: 599,
    duration: 20,
    codeName: "HERO-003",
    isAvailable: true,
    description:
      "Premium hero banner at the top of the homepage with maximum visibility (3rd slide)",
  },

  // Left sidebar placements (5 available)
  // {
  //   id: "left-1",
  //   name: "Left Sidebar - Position 1",
  //   position: "left",
  //   type: "sidebar",
  //   price: 299,
  //   duration: 20,
  //   codeName: "LEFT-001",
  //   isAvailable: true,
  //   description: "Left sidebar placement with consistent visibility across all pages",
  // },
  // {
  //   id: "left-2",
  //   name: "Left Sidebar - Position 2",
  //   position: "left",
  //   type: "sidebar",
  //   price: 299,
  //   duration: 20,
  //   codeName: "LEFT-002",
  //   isAvailable: true,
  //   description: "Left sidebar placement with steady traffic and engagement",
  // },
  // {
  //   id: "left-3",
  //   name: "Left Sidebar - Position 3",
  //   position: "left",
  //   type: "sidebar",
  //   price: 299,
  //   duration: 20,
  //   codeName: "LEFT-003",
  //   isAvailable: true,
  //   description: "Left sidebar placement ideal for brand awareness",
  // },
  // {
  //   id: "left-4",
  //   name: "Left Sidebar - Position 4",
  //   position: "left",
  //   type: "sidebar",
  //   price: 299,
  //   duration: 20,
  //   codeName: "LEFT-004",
  //   isAvailable: true,
  //   description: "Left sidebar placement with targeted audience reach",
  // },
  // {
  //   id: "left-5",
  //   name: "Left Sidebar - Position 5",
  //   position: "left",
  //   type: "sidebar",
  //   price: 299,
  //   duration: 20,
  //   codeName: "LEFT-005",
  //   isAvailable: true,
  //   description: "Left sidebar placement perfect for product launches",
  // },

  // Right sidebar placements (5 available)
  {
    id: "right-1",
    name: "Right Sidebar - Position 1",
    position: "right",
    type: "sidebar",
    price: 299,
    duration: 20,
    codeName: "RIGHT-001",
    isAvailable: true,
    description: "Right sidebar placement with high click-through rates",
  },
  {
    id: "right-2",
    name: "Right Sidebar - Position 2",
    position: "right",
    type: "sidebar",
    price: 299,
    duration: 20,
    codeName: "RIGHT-002",
    isAvailable: true,
    description: "Right sidebar placement with excellent user engagement",
  },
  {
    id: "right-3",
    name: "Right Sidebar - Position 3",
    position: "right",
    type: "sidebar",
    price: 299,
    duration: 20,
    codeName: "RIGHT-003",
    isAvailable: true,
    description: "Right sidebar placement ideal for SaaS and developer tools",
  },
  {
    id: "right-4",
    name: "Right Sidebar - Position 4",
    position: "right",
    type: "sidebar",
    price: 299,
    duration: 20,
    codeName: "RIGHT-004",
    isAvailable: true,
    description: "Right sidebar placement with consistent daily impressions",
  },
  {
    id: "right-5",
    name: "Right Sidebar - Position 5",
    position: "right",
    type: "sidebar",
    price: 299,
    duration: 20,
    codeName: "RIGHT-005",
    isAvailable: true,
    description:
      "Right sidebar placement perfect for startups and new launches",
  },
];

export async function GET() {
  try {
    await connectToDatabase();

    // Get all available placement codes using the model method
    const availableCodes = await Placement.getAvailableCodes();

    // Update availability based on available codes
    const slotsWithAvailability = ALL_SLOTS.map((slot) => {
      return {
        ...slot,
        isAvailable: availableCodes.includes(slot.codeName),
      };
    });

    return NextResponse.json({ success: true, slots: slotsWithAvailability });
  } catch (error) {
    console.error("Error fetching available placement slots:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch available placement slots." },
      { status: 500 },
    );
  }
}
