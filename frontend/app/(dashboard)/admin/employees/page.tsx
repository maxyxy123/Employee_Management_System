import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Search, Plus } from "lucide-react"
import { EmployeeCard } from "@/components/ui/employee-card/employee-card"

const employees = [
  {
    name: "David Michael",
    position: "Associate Business Support",
    department: "IT Support",
  },
  {
    name: "Alex Matthew",
    position: "Software Developer",
    department: "Engineering",
  },
  {
    name: "John Doe",
    position: "Senior Software Developer",
    department: "Engineering",
  },
]

export default function EmployeesPage() {
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

        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Add Employee
        </Button>
      </div>

      {/* Search */}
      <div className="mt-8 flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

          <Input placeholder="Search employees..." className="pl-10 border-gray-600" />
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
        {employees.map((employee) => (
          <EmployeeCard key={employee.name} {...employee} />
        ))}
      </div>
    </div>
  )
}
