"use client"
import { getOneLeave } from "@/api/leaves.api";
import { useQuery } from "@tanstack/react-query";

export const UseGetOneLeave = (leaveId : string) => {
    return useQuery({
        queryFn : () => {
            return getOneLeave(leaveId)
        },
        queryKey : ['leave',leaveId],
        enabled : Boolean(leaveId)
    })
} 