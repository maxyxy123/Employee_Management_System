"use client"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Search, Plus } from "lucide-react"
import { EmployeeCard } from "@/components/ui/employee-card/employee-card"
import { UseGetAllEmployee } from "@/hooks/employees/use-getAllEmployee"
import { AppLoading } from "@/components/shared/loading"
import { useState } from "react"
import { CreateEmployeeForm } from "@/components/ui/create-employee-form/employee-form"
import { UseGetAllDepartment } from "@/hooks/departments/use-getAllDepartments"
export default function EmployeesPage() {
  const [open, isOpen] = useState<boolean>(false)
  const { data: employees, isLoading: isLoadingEmployees } = UseGetAllEmployee()
  console.log(employees)

  const { data: departments, isLoading: isLoadingDepartments } =
    UseGetAllDepartment()
  console.log(departments)

  if (isLoadingDepartments || isLoadingEmployees) {
    return <AppLoading /> 
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-black">Employees</h1>
          <p className="text-sm text-muted-foreground">
            Manage your team members
          </p>
        </div>

        <Button className="gap-2" onClick={() => isOpen(!open)}>
          <Plus className="h-4 w-4" />
          Add Employee
        </Button>
      </div>

      <Dialog open={open} onOpenChange={isOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-3xl">
          <DialogHeader>
            <DialogTitle>Create employee</DialogTitle>

            <DialogDescription>
              Enter information to create a new employee.
            </DialogDescription>
          </DialogHeader>

          <CreateEmployeeForm departments = {departments} />
        </DialogContent>
      </Dialog>

      {/* Search */}
      <div className="mt-8 flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

          <Input
            placeholder="Search employees..."
            className="border-gray-600 pl-10"
          />
        </div>

        <Select defaultValue="all">
          <SelectTrigger className="w-52">
            <SelectValue />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="all">All Departments</SelectItem>
            <SelectItem value="engineering">Engineering</SelectItem>
            <SelectItem value="support">IT Support</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Cards */}
      <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {employees.data.map((employee) => {
          return (
            <EmployeeCard
              key={employee.id}
              name={employee.user.name}
              position={employee.position}
              department={employee.department?.name ?? "Dont have"}
            />
          )
        })}
      </div>
    </div>
  )
}
