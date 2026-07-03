import { login } from "@/api/auth"

import { useQueryClient, useMutation } from "@tanstack/react-query"

export const UseLogin = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: login,
    onError: (error) => {
      console.log(error, "Failed to logging in")
    },
    onSuccess: () => {
      console.log("Successfully logging in")
      queryClient.invalidateQueries({
        queryKey: ["auth", "me"],
      })
    },
  })
}
