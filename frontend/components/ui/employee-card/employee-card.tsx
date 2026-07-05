

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "../badge"

interface EmployeeCardProps {
  name: string
  position: string
  department: string
}

export function EmployeeCard({
  name,
  position,
  department,
}: EmployeeCardProps) {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")

  return (
    <Card className="overflow-hidden rounded-xl border  hover:shadow-md">
      <div className="relative flex h-36 items-center justify-center ">
        <Badge variant="secondary" className="absolute top-3 left-3">
          {department} 
        </Badge>

        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-indigo-100 text-2xl font-semibold text-indigo-600">
          {initials} 
        </div>
      </div>

      <CardContent className="space-y-1 p-4">
        <h3 className="font-extrabold ">{name}</h3>

        <p className="text-sm text-muted-foreground">{position}</p>
      </CardContent>
    </Card>
  )
}
