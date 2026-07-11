import { useQuery } from "@tanstack/react-query"
import { getOneEmployee } from "@/api/employees.api"

export const UseGetOneEmployee = (employeeId: string) => {
  return useQuery({
    queryFn: () => {
      return getOneEmployee(employeeId)
    },
    queryKey: ["employee", `id:${employeeId}`],
    retry: false,
    staleTime: 2 * 60 * 1000,
    enabled : Boolean(employeeId)
  })
}
