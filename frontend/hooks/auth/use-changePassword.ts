import { useMutation } from "@tanstack/react-query"
import { changePassword } from "@/api/auth"
import { PasswordInputType } from "@/schema/auth.schema"
export const UseChangePassword = () => {
  return useMutation({
    mutationFn: (passwordInput: PasswordInputType) => {
      return changePassword(passwordInput)
    },
  })
}
