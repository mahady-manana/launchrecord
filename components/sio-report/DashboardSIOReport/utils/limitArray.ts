import { UserType } from "./getUserType";

export function limitArray<T>(
  arr: T[],
  userType: UserType,
  limitConfig: { guest: number; free: number },
): T[] {
  if (userType === "paid") return arr;
  const limit = userType === "guest" ? limitConfig.guest : limitConfig.free;
  return arr.slice(0, limit);
}
