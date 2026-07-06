import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "../badge"
import { Button } from "../button"
import { Pencil } from "lucide-react"
import { Trash } from "lucide-react"
import { toast } from "sonner"
import { UseDeleteEmployee } from "@/hooks/employees/use-deleteEmployee"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../dialog"
import { UpdateEmployeeForm } from "../update-employee-form/update-employee-form"
import { useState } from "react"
interface EmployeeCardProps {
  employee: {
    id: string
    user: { name: string }
    position: string
    department: {
      name: string
    }
  }
}

export function EmployeeCard({ employee }: EmployeeCardProps) {
  const [open, setOpen] = useState<boolean>(false)
  const deleteEmployeeMutation = UseDeleteEmployee()
  const deleteEmployee = (employeeId :string) => {
    return deleteEmployeeMutation.mutate(employeeId, {
      onSuccess: () => {
        toast.success("Successfully delete employee")
      },
      onError: () => {
        toast.error("Fail to delete employee")
      },
    })
  }

  const initials = employee.user.name
    .split(" ")
    .map((n) => n[0])
    .join("")

  return (
    <>
      <Card className="group relative overflow-hidden rounded-xl border transition hover:shadow-md">
        <div className="relative flex h-36 items-center justify-center">
          <Badge variant="secondary" className="absolute top-3 left-3">
            {employee.department?.name ?? "Dont have"}
          </Badge>

          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-indigo-100 text-2xl font-semibold text-indigo-600">
            {initials}
          </div>
        </div>

        <CardContent className="space-y-1 p-4">
          <h3 className="font-extrabold">{employee.user.name}</h3>
          <p className="text-sm text-muted-foreground">{employee.position}</p>
        </CardContent>

        <div className="pointer-events-none absolute right-3 bottom-3 flex translate-y-2 gap-2 opacity-0 transition-all duration-200 group-hover:pointer-events-auto group-hover:translate-y-0 group-hover:opacity-100">
          <Button variant="outline" size="icon" onClick={() => setOpen(!open)}>
            <Pencil />
          </Button>

          <Button
            variant="outline"
            size="icon"
            onClick={() => deleteEmployee(employee.id)}
          >
            <Trash />
          </Button>
        </div>
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>Update employee</DialogTitle>

            <DialogDescription>
              Update the employee information.
            </DialogDescription>
          </DialogHeader>

          <UpdateEmployeeForm
            employee={employee}
            onSuccess={() => setOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </>
  )
}
