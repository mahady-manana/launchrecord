"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { usePayments } from "@/hooks/use-payments";
import { useSubscription } from "@/hooks/use-subscription";
import { useUsers } from "@/hooks/use-users";

interface DashboardDataProviderProps {
  children: React.ReactNode;
}

const USERS_ROUTES = new Set(["/dashboard", "/dashboard/users"]);
const PAYMENTS_ROUTES = new Set(["/dashboard", "/dashboard/payments"]);
const SUBSCRIPTION_ROUTES = new Set(["/dashboard", "/dashboard/subscription"]);

export function DashboardDataProvider({ children }: DashboardDataProviderProps) {
  const pathname = usePathname();
  const { fetchUsers } = useUsers();
  const { fetchPayments } = usePayments();
  const { fetchSubscription } = useSubscription();

  useEffect(() => {
    if (USERS_ROUTES.has(pathname)) {
      fetchUsers();
    }
    if (PAYMENTS_ROUTES.has(pathname)) {
      fetchPayments();
    }
    if (SUBSCRIPTION_ROUTES.has(pathname)) {
      fetchSubscription();
    }
  }, [pathname, fetchUsers, fetchPayments, fetchSubscription]);

  return <>{children}</>;
}
