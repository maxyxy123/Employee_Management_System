"use client"

import { login } from "@/api/auth"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useRouter } from "next/navigation"

export const UseLogin = () => {
  const queryClient = useQueryClient()
  const router = useRouter()

  return useMutation({
    mutationFn: login,

    onError: (error) => {
      console.log(error, "Failed to logging in")
    },

    onSuccess: async () => {
      console.log("Successfully logging in")

      await queryClient.invalidateQueries({
        queryKey: ["auth", "me"],
      })

      router.replace("/admin")
    },
  })
}
