import { getAllLeaves } from "@/api/leaves.api"
import { useQuery } from "@tanstack/react-query"

export const UseGetAllLeaves = () => {
  return useQuery({
    queryFn: getAllLeaves,
    queryKey: ["allLeaves"],
    retry: false,
    staleTime: 5 * 60 * 1000,
  })
}
