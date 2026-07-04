"use client"

import { getCurrentUser } from "@/api/auth"
import {  useQuery } from "@tanstack/react-query"

export const UseGetCurrentUser = () => {
  return useQuery({
    queryFn: getCurrentUser,
    queryKey: ["auth", "me"],
    retry: false,
    // staleTime: 0,
  })
}
