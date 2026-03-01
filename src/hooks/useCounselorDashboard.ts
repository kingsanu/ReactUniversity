"use client";

import { useQuery } from "@tanstack/react-query";
import { getCounselorDashboard } from "@/services/counselorService";

export const counselorKeys = {
  all: ["counselor"] as const,
  dashboard: () => [...counselorKeys.all, "dashboard"] as const,
};

export function useCounselorDashboard() {
  return useQuery({
    queryKey: counselorKeys.dashboard(),
    queryFn: () => getCounselorDashboard(),
    staleTime: 1000 * 60 * 2,
  });
}