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
import { Search, Plus, Building2 } from "lucide-react"
import { EmployeeCard } from "@/components/ui/employee-card/employee-card"
import { UseGetAllEmployee } from "@/hooks/employees/use-getAllEmployee"
import { AppLoading } from "@/components/shared/loading"
import { useMemo, useState } from "react"
import { CreateEmployeeForm } from "@/components/ui/create-employee-form/employee-form"
import { UseGetAllDepartment } from "@/hooks/departments/use-getAllDepartments"
export default function EmployeesPage() {
  const [open, isOpen] = useState<boolean>(false)
  const [selectedDepartmentId, setSelectedDepartmentId] = useState("all")

  //hooks
  const { data: employees, isLoading: isLoadingEmployees } = UseGetAllEmployee()
  console.log(employees)
  const { data: departments, isLoading: isLoadingDepartments } =
    UseGetAllDepartment()
  
  //filltered
  const filteredEmployees = useMemo(() => {
    if (selectedDepartmentId === "all") {
      return employees?.data
    }

    return employees.data.filter(
      (employee: {
        id: string
        user: { name: string }
        position: string
        departmentId: string
        department: {
          name: string
        }
      }) => employee.departmentId === selectedDepartmentId
    )
  }, [employees?.data, selectedDepartmentId])



  if (isLoadingDepartments || isLoadingEmployees) {
    return <AppLoading />
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-extrabold">Employees</h1>
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

          <CreateEmployeeForm departments={departments ?? []} />
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

        {/* render department   */}
        <Select
          defaultValue="all"
          value={selectedDepartmentId}
          onValueChange={setSelectedDepartmentId}
        >
          <SelectTrigger className="h-10 w-full rounded-xl border bg-background px-3 shadow-sm transition-all hover:bg-muted/40 focus:ring-2 focus:ring-primary/20 sm:w-60">
            <div className="flex items-center gap-2">
              <Building2 className="size-4 text-muted-foreground" />

              <SelectValue placeholder="Select department" />
            </div>
          </SelectTrigger>

          <SelectContent className="rounded-xl p-1 shadow-lg">
            <SelectItem
              value="all"
              className="cursor-pointer rounded-lg font-medium"
            >
              All departments
            </SelectItem>

            {departments.data.map(
              (department: { id: string; name: string }) => (
                <SelectItem
                  key={department.id}
                  value={department.id}
                  className="cursor-pointer rounded-lg"
                >
                  {department.name}
                </SelectItem>
              )
            )}
          </SelectContent>
        </Select>
      </div>

      {/* Cards */}
      <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {filteredEmployees && filteredEmployees.map(
          (employee: {
            id: string
            user: { name: string }
            position: string
            department: {
              name: string
            }
          }) => {
            return <EmployeeCard key={employee.id} employee={employee} />
          }
        )}
      </div>
    </div>
  )
}
