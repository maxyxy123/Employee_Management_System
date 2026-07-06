import { z } from "zod"

export const CreateEmployeeSchema = z.object({
  //user
  name: z.string().min(3, "Name at least 3 characters"),
  email: z.email(),
  password: z.string().min(8, "Password at least 8 characters"),

  //Employee
  employeeCode: z.string(),
  phone: z.coerce.number().optional(),
  position: z.string(),
  joinDate: z.string().min(1, "Join date is required"),
  departmentId : z.string(),
  salary: z.coerce.number().min(0).optional(),
  avatar: z.string().optional(),
  address: z.string().optional(),
})

export type CreateEmployeeType = z.infer<typeof CreateEmployeeSchema>

export const UpdateEmployeeSchema = z.object({
  phone: z.number().optional(),
  position: z.string().optional(),
  joinDate: z.coerce
    .date({
      error: "Join date is required",
    })
    .optional(),
  salary: z.coerce.number().min(0).optional(),
  avatar: z.string().optional(),
  address: z.string().optional(),
})





export type UpdateEmployeeType = {
  phone?: string
  position?: string
  joinDate?: string
  salary?: number
  avatar?: string
  address?: string
  departmentId ?:string
}

export type UpdateEmployeeFormProps = {
  employee: {
    id: string
    phone?: string | null
    position: string
    joinDate: string
    salary?: number | null
    avatar?: string | null
    address?: string | null
    department: {
      id :string 
    } | null
  }
  onSuccess?: () => void
}