"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { updateEmployee } from "@/api/employees.api"
import { UpdateEmployeeType } from "@/schema/employee.schema"
export const UseUpdateEmployee = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (variable: {
      employeeId: string
      employeeInputUpdate: UpdateEmployeeType
    }) => {
      return updateEmployee(variable.employeeId, variable.employeeInputUpdate)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["allEmployee"],
      })
    },   
  }) 
}





