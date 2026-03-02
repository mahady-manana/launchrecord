import { useAuth } from "@/hooks/use-auth";

export function useSessionUser() {
  const { user } = useAuth();
  return user;
}
