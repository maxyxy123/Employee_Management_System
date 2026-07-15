import { email, z } from "zod"

export const LoginSchema = z.object({
  email: z.email("Email is not correct in format").trim(),
  password: z
    .string()
    .min(8, "Password at least 8 characters")
})

export type LoginSchemaType = z.infer<typeof LoginSchema>

export type PasswordInputType = {
  currentPassword : string,
  newPassword: string
}

export const NewProfileInputSchema = z.object({
  name : z.string().optional(),
  email : z.email().optional(),
  position : z.string().optional()
})

export type NewProfileInputType = z.infer<typeof NewProfileInputSchema>