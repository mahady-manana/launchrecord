export const PLACEMENT_TYPES = ["featured", "sidebar"] as const;
export type PlacementType = (typeof PLACEMENT_TYPES)[number];

export const PLACEMENT_POSITIONS = ["hero", "left", "right"] as const;
export type PlacementPosition = (typeof PLACEMENT_POSITIONS)[number];

export interface Placement {
  _id: string;
  title: string;
  tagline: string;
  logoUrl?: string;
  backgroundImage?: string;
  website: string;
  placementType: PlacementType;
  position?: PlacementPosition;
  startDate: string;
  endDate: string;
  price: number;
  status: "active" | "inactive" | "expired";
  userId: string;
  launchId?: string;
  paymentIntentId?: string;
  paymentStatus: "draft" | "pending" | "paid" | "failed" | "refunded";
  codeName: string;
  appName: string;
  color?: string; // Color for the placement
  createdAt: string;
  updatedAt: string;
}

export interface CreatePlacementPayload {
  title: string;
  tagline: string;
  logoUrl?: string;
  backgroundImage?: string;
  website: string;
  placementType: PlacementType;
  position?: PlacementPosition;
  startDate: string;
  endDate: string;
  price: number;
  codeName: string;
  color?: string;
}

export interface UpdatePlacementPayload {
  id: string;
  title?: string;
  tagline?: string;
  logoUrl?: string;
  backgroundImage?: string;
  website?: string;
  placementType?: PlacementType;
  position?: PlacementPosition;
  startDate?: string;
  endDate?: string;
  price?: number;
  status?: "active" | "inactive" | "expired";
  paymentIntentId?: string;
  paymentStatus?: "pending" | "paid" | "failed" | "refunded";
  color?: string;
}

export interface PlacementSlot {
  id: string;
  position: PlacementPosition;
  type: PlacementType;
  price: number;
  duration: number; // in days
  codeName: string;
  isAvailable: boolean;
  name: string;
  description: string;
}
