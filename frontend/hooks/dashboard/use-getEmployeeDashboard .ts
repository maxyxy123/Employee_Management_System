import { useQuery } from "@tanstack/react-query"
import { employeeDashboardStats } from "@/api/dashboard.api"

export const UseGetEmployeeDashboard = () => {
  return useQuery({
    queryFn: employeeDashboardStats,
    queryKey: ["employee", "dashboard"],
    retry: false,
    staleTime: 5 * 60 * 1000,
  })
}
