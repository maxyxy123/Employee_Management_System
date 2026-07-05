import { useMutation, useQueryClient } from "@tanstack/react-query"
import { createEmployee } from "@/api/employees.api"
import { CreateEmployeeType } from "@/schema/employee.schema"
// import axios from "axios"
export const UseCreateEmployee = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (employeeInput: CreateEmployeeType) => {
      return createEmployee(employeeInput)
    },

    onError: (error) => {
      console.log("error :", error)
    },

    //  onError: (error) => {
    //   if (axios.isAxiosError(error)) {
    //     console.log("Status:", error.response?.status)
    //     console.log("Backend error:", error.response?.data)
    //     console.log("Request data:", error.config?.data)
    //     return
    //   }
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["allEmployee"],
      })
    },
  })
}
