"use client"

import { Controller, useForm } from "react-hook-form"
import { Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { UseUpdateEmployee } from "@/hooks/employees/use-updateEmployee"
import {
  UpdateEmployeeFormProps,
  UpdateEmployeeType,
} from "@/schema/employee.schema"
import { toast } from "sonner"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../select"
import { UseGetAllDepartment } from "@/hooks/departments/use-getAllDepartments"
export function UpdateEmployeeForm({
  employee,
  onSuccess,
}: UpdateEmployeeFormProps) {
   const { data: departments, isLoading: isLoadingDepartments } =
      UseGetAllDepartment()
  const updateEmployee = UseUpdateEmployee()
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<UpdateEmployeeType>({
    defaultValues: {
      phone: employee.phone ?? "",
      position: employee.position ?? "",
      joinDate: employee.joinDate
        ? new Date(employee.joinDate).toISOString().split("T")[0]
        : "",
      departmentId: employee.department?.id ?? undefined,
      salary: employee.salary ?? undefined,
      avatar: employee.avatar ?? "",
      address: employee.address ?? "",
    },
  })

  const onSubmit = (data: UpdateEmployeeType) => {
    const employeeInputUpdate: UpdateEmployeeType = {
      ...data,

      // Input rỗng thì không gửi salary = NaN
      salary:
        data.salary === undefined || Number.isNaN(data.salary)
          ? undefined
          : data.salary,
    }
    console.log(employeeInputUpdate);
    

    updateEmployee.mutate(
      {
        employeeId: employee.id,
        employeeInputUpdate,
      },
      {
        onSuccess: () => {
          onSuccess?.()
          toast.success("Successfully Update Employee ")
        },
        onError: () => {
          toast.error("Update employee Failed")
        },
      }
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid gap-5">
      <div className="grid gap-2">
        <Label htmlFor="phone">Phone</Label>

        <Input
          id="phone"
          placeholder="Enter phone number"
          {...register("phone")}
        />

        {errors.phone && (
          <p className="text-sm text-destructive">{errors.phone.message}</p>
        )}
      </div>

      <div className="grid gap-2">
        <Label htmlFor="position">Position</Label>

        <Input
          id="position"
          placeholder="Enter position"
          {...register("position")}
        />

        {errors.position && (
          <p className="text-sm text-destructive">{errors.position.message}</p>
        )}
      </div>

      <div className="grid gap-2">
        <Label htmlFor="joinDate">Join date</Label>

        <Input id="joinDate" type="date" {...register("joinDate")} />

        {errors.joinDate && (
          <p className="text-sm text-destructive">{errors.joinDate.message}</p>
        )}
      </div>

      <div className="grid gap-2">
        <Label htmlFor="salary">Salary</Label>

        <Input
          id="salary"
          type="number"
          min={0}
          step="any"
          placeholder="Enter salary"
          {...register("salary", {
            setValueAs: (value) => (value === "" ? undefined : Number(value)),
          })}
        />

        {errors.salary && (
          <p className="text-sm text-destructive">{errors.salary.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="joinDate">Departments</Label>
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
          <p className="text-sm text-red-500">{errors.departmentId.message}</p>
        )}
      </div>

      <div className="grid gap-2">
        <Label htmlFor="avatar">Avatar URL</Label>

        <Input
          id="avatar"
          placeholder="Enter avatar URL"
          {...register("avatar")}
        />

        {errors.avatar && (
          <p className="text-sm text-destructive">{errors.avatar.message}</p>
        )}
      </div>

      <div className="grid gap-2">
        <Label htmlFor="address">Address</Label>

        <Input
          id="address"
          placeholder="Enter address"
          {...register("address")}
        />

        {errors.address && (
          <p className="text-sm text-destructive">{errors.address.message}</p>
        )}
      </div>

      <Button type="submit" disabled={updateEmployee.isPending}>
        {updateEmployee.isPending && (
          <Loader2 className="mr-2 size-4 animate-spin" />
        )}

        {updateEmployee.isPending ? "Updating..." : "Update employee"}
      </Button>
    </form>
  )
}
