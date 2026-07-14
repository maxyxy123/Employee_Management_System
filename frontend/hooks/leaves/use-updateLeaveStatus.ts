import { useMutation, useQueryClient } from "@tanstack/react-query"
import { updateLeaveStatus } from "@/api/leaves.api"

enum LeaveStatus {
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
}

export const UseUpdateLeaveStatus = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: { leaveId: string; status: LeaveStatus }) => {
            return updateLeaveStatus(input.leaveId,input.status)
    },
    onSettled :async  (data,error,variable) => {
        await Promise.all([
            queryClient.invalidateQueries({
                queryKey : ["allLeaves"],
            }),
            queryClient.invalidateQueries({
                queryKey : ['leave',variable.leaveId]
            })
        ])
    }
  })
}
