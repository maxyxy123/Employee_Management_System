"use client"

import { useQuery } from "@tanstack/react-query"
import { adminDashboardStats } from "@/api/dashboard.api"

export const UseGetAdminDashboard = () => {
  return useQuery({
    queryFn: adminDashboardStats,
    queryKey: ["admin", "dashboard"],
    retry: false,
    staleTime: 5 * 60 * 1000,
  })
}
