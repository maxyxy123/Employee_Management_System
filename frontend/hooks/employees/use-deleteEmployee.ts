import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteEmployee } from "@/api/employees.api";


export const UseDeleteEmployee = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (employeeId :string) => {
                return deleteEmployee(employeeId)
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
              queryKey: ["allEmployee"],
            })
        },
    })
}