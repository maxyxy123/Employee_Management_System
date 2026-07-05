"use client"

import { useQuery } from "@tanstack/react-query"
import { getAllEmployees } from "@/api/employees.api"

export const UseGetAllEmployee = () => {
  return useQuery({
    queryFn: getAllEmployees,
    queryKey: ["allEmployee"],
    retry: false,
    staleTime: 5 * 60 * 1000,
  })
}
