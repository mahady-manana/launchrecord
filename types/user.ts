import { Types } from "mongoose";

export type UserRole = "user" | "admin";

export interface SessionUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  _id: Types.ObjectId;
}

export interface UserRecord extends SessionUser {
  stripeCustomerId?: string | null;
  subscriptionId?: string | null;
  subscriptionStatus?: string | null;
  createdAt?: string;
  updatedAt?: string;
}
