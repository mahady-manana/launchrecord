import Placement from "@/lib/models/placement";
import { connectToDatabase } from "@/lib/mongodb";
import { PlacementSlot } from "@/types/placement";
import { NextResponse } from "next/server";

// Define available placement slots with prices and durations
const ALL_SLOTS: PlacementSlot[] = [
  // Featured hero placements (3 available)
  {
    id: "hero-1",
    name: "Featured hero - SLOT1",
    position: "hero",
    type: "featured",
    price: 599,
    duration: 30,
    codeName: "HERO-001",
    isAvailable: true,
  },
  {
    id: "hero-2",
    name: "Featured hero - SLOT2",
    position: "hero",
    type: "featured",
    price: 599,
    duration: 30,
    codeName: "HERO-002",
    isAvailable: true,
  },
  {
    id: "hero-3",
    name: "Featured hero - SLOT3",
    position: "hero",
    type: "featured",
    price: 599,
    duration: 30,
    codeName: "HERO-003",
    isAvailable: true,
  },

  // Left sidebar placements (5 available)
  {
    id: "left-1",
    name: "Sidebar Slot 1",
    position: "left",
    type: "sidebar",
    price: 299,
    duration: 30,
    codeName: "LEFT-001",
    isAvailable: true,
  },
  {
    id: "left-2",
    name: "Sidebar Slot 2",
    position: "left",
    type: "sidebar",
    price: 299,
    duration: 30,
    codeName: "LEFT-002",
    isAvailable: true,
  },
  {
    id: "left-3",
    name: "Sidebar Slot 3",
    position: "left",
    type: "sidebar",
    price: 299,
    duration: 30,
    codeName: "LEFT-003",
    isAvailable: true,
  },
  {
    id: "left-4",
    name: "Sidebar Slot 4",
    position: "left",
    type: "sidebar",
    price: 299,
    duration: 30,
    codeName: "LEFT-004",
    isAvailable: true,
  },
  {
    id: "left-5",
    name: "Sidebar Slot 5",
    position: "left",
    type: "sidebar",
    price: 299,
    duration: 30,
    codeName: "LEFT-005",
    isAvailable: true,
  },

  // Right sidebar placements (5 available)
  {
    id: "right-1",
    name: "Sidebar Slot 6",
    position: "right",
    type: "sidebar",
    price: 299,
    duration: 30,
    codeName: "RIGHT-001",
    isAvailable: true,
  },
  {
    id: "right-2",
    name: "Sidebar Slot 7",
    position: "right",
    type: "sidebar",
    price: 299,
    duration: 30,
    codeName: "RIGHT-002",
    isAvailable: true,
  },
  {
    id: "right-3",
    name: "Sidebar Slot 8",
    position: "right",
    type: "sidebar",
    price: 299,
    duration: 30,
    codeName: "RIGHT-003",
    isAvailable: true,
  },
  {
    id: "right-4",
    name: "Sidebar Slot 9",
    position: "right",
    type: "sidebar",
    price: 299,
    duration: 30,
    codeName: "RIGHT-004",
    isAvailable: true,
  },
  {
    id: "right-5",
    name: "Sidebar Slot 10",
    position: "right",
    type: "sidebar",
    price: 299,
    duration: 30,
    codeName: "RIGHT-005",
    isAvailable: true,
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
