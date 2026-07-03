import { getCurrentUser } from "@/api/auth"
import { LoginSchemaType } from "@/schema/auth.schema"
import { useQueryClient, useQuery } from "@tanstack/react-query"

export const UseGetCurrentUser = () => {
  return useQuery({
    queryFn: getCurrentUser,
    queryKey: ["auth", "me"],
    retry: false,
      staleTime: 5 * 60 * 1000,
  })
}
