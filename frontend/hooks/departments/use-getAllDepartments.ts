"use client"

import { useQuery } from "@tanstack/react-query"
import { getAllDepartment } from "@/api/departments.api"

export const UseGetAllDepartment = () => {
  return useQuery({
      queryKey: ["allDepartments"],
    queryFn: getAllDepartment,
    retry: false,
    staleTime: 5 * 60 * 1000,
  })
}
