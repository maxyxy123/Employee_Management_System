"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  CreateEmployeeSchema,
  CreateEmployeeType,
} from "@/schema/employee.schema"
import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"
import { UseCreateEmployee } from "@/hooks/employees/use-createEmployee"
import z from "zod"
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "../select"
import {toast} from 'sonner'
type CreateEmployeeInput = z.input<typeof CreateEmployeeSchema>
type CreateEmployeeOutput = z.output<typeof CreateEmployeeSchema>

export function CreateEmployeeForm({ departments }) {
  const createEmployeeMutation = UseCreateEmployee()

  const {
    register,
    handleSubmit,
    control,
    formState: { isSubmitting, errors },
  } = useForm<CreateEmployeeInput, unknown, CreateEmployeeOutput>({
    resolver: zodResolver(CreateEmployeeSchema),
    mode: "onBlur",
    defaultValues: {
      name: "",
      email: "",
      password: "",
      departmentId: "",
      employeeCode: "",
      position: "",
      avatar: "",
      address: "",
    },
  })
  const onSubmit = async (data: CreateEmployeeType) => {
    createEmployeeMutation.mutate(data, {
      onSuccess: () => {
        toast.success("Create employee successfully")
      },
      onError: () => {
        toast.error("Failed to create employee")
      }
   })
    
  }

  return (
    <form className="space-y-9" onSubmit={handleSubmit(onSubmit)}>
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        {/* Name */}
        <div className="space-y-2">
          <Label htmlFor="name">
            Name <span className="text-destructive">*</span>
          </Label>

          <Input
            id="name"
            type="text"
            {...register("name")}
            placeholder="Enter employee name"
          />
          <br />
          {errors.name && (
            <p className="text-1xl font-semibold text-red-400">
              {errors.name.message}
            </p>
          )}
        </div>

        {/* Employee code */}
        <div className="space-y-2">
          <Label htmlFor="employeeCode">
            Employee code <span className="text-destructive">*</span>
          </Label>

          <Input
            id="employeeCode"
            {...register("employeeCode")}
            type="text"
            placeholder="EMP-001"
          />

          <br />
          {errors.employeeCode && (
            <p className="text-1xl font-semibold text-red-400">
              {errors.employeeCode.message}
            </p>
          )}
        </div>

        {/* Email */}
        <div className="space-y-2">
          <Label htmlFor="email">
            Email <span className="text-destructive">*</span>
          </Label>

          <Input
            id="email"
            {...register("email")}
            type="email"
            placeholder="employee@example.com"
          />

          <br />
          {errors.email && (
            <p className="text-1xl font-semibold text-red-400">
              {errors.email.message}
            </p>
          )}
        </div>

        {/* Password */}
        <div className="space-y-2">
          <Label htmlFor="password">
            Password <span className="text-destructive">*</span>
          </Label>

          <Input
            id="password"
            {...register("password")}
            type="password"
            placeholder="Enter password"
          />
          <br />
          {errors.password && (
            <p className="text-1xl font-semibold text-red-400">
              {errors.password.message}
            </p>
          )}
        </div>

        {/* Position */}
        <div className="space-y-2">
          <Label htmlFor="position">
            Position <span className="text-destructive">*</span>
          </Label>

          <Input
            id="position"
            {...register("position")}
            type="text"
            placeholder="Software Engineer"
          />
          <br />
          {errors.position && (
            <p className="text-1xl font-semibold text-red-400">
              {errors.position.message}
            </p>
          )}
        </div>

        {/* Join date */}
        <div className="space-y-2">
          <Label htmlFor="joinDate">
            Join date <span className="text-destructive">*</span>
          </Label>

          <Input id="joinDate" {...register("joinDate")} type="date" />
          <br />
          {errors.joinDate && (
            <p className="text-1xl font-semibold text-red-400">
              {errors.joinDate.message}
            </p>
          )}
        </div>

        {/* Phone */}
        <div className="space-y-2">
          <Label htmlFor="phone">Phone</Label>

          <Input
            id="phone"
            {...register("phone")}
            type="tel"
            inputMode="numeric"
            placeholder="0987654321"
          />
          <br />
          {errors.phone && (
            <p className="text-1xl font-semibold text-red-400">
              {errors.phone.message}
            </p>
          )}
        </div>

        {/* Salary */}
        <div className="space-y-2">
          <Label htmlFor="salary">Salary</Label>

          <Input
            id="salary"
            {...register("salary")}
            type="number"
            min={0}
            placeholder="15000000"
          />
          <br />
          {errors.salary && (
            <p className="text-1xl font-semibold text-red-400">
              {errors.salary.message}
            </p>
          )}
        </div>

        {/* Department */}
        <div className="space-y-2">
          <Controller
            name="departmentId"
            control={control}
            rules={{
              required: "Please select a department",
            }}
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>

                <SelectContent>
                  {departments.data.map(
                    (department: { id: string; name: string }) => (
                      <SelectItem key={department.id} value={department.id}>
                        {department.name}
                      </SelectItem>
                    )
                  )}
                </SelectContent>
              </Select>
            )}
          />

          {errors.departmentId && (
            <p className="text-sm text-red-500">
              {errors.departmentId.message}
            </p>
          )}
        </div>

        {/* Avatar */}
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="avatar">Avatar URL</Label>

          <Input
            id="avatar"
            {...register("avatar")}
            type="text"
            placeholder="https://example.com/avatar.jpg"
          />
          <br />
          {errors.avatar && (
            <p className="text-1xl font-semibold text-red-400">
              {errors.avatar.message}
            </p>
          )}
        </div>

        {/* Address */}
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="address">Address</Label>

          <Textarea
            id="address"
            {...register("address")}
            placeholder="Enter employee address"
            className="min-h-24 resize-none"
          />
          <br />
          {errors.address && (
            <p className="text-1xl font-semibold text-red-400">
              {errors.address.message}
            </p>
          )}
        </div>
      </div>

      <div className="flex justify-end gap-3 border-t pt-5">
        <Button type="button" variant="outline">
          Cancel
        </Button>

        <Button type="submit">
          {isSubmitting ? "Creating" : "Create employee"}
        </Button>
      </div>
    </form>
  )
}
