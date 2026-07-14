import { BriefcaseBusiness, Building2, Mail, Phone, UserRound } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../avatar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../card";
import { InformationItem } from "./information-items";
import { getInitials } from "@/lib/utils";
import { LeaveDetail } from "@/schema/leaves.schema";

type LeaveTypeProps = {
    leave : LeaveDetail
}

export function EmployeeInfomationCard({leave}: LeaveTypeProps) {
    const employeeInitials = getInitials(leave.employee.user.name)
  return (
    <Card>
      <CardHeader>
        <CardTitle>Employee information</CardTitle>

        <CardDescription>
          Information about the employee who submitted this request.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
          <Avatar className="size-16">
            <AvatarImage
              src={leave.employee.avatar ?? undefined}
              alt={leave.employee.user.name}
            />

            <AvatarFallback className="text-lg">
              {employeeInitials}
            </AvatarFallback>
          </Avatar>

          <div className="grid flex-1 gap-5 sm:grid-cols-2">
            <InformationItem
              icon={UserRound}
              label="Employee name"
              value={leave.employee.user.name}
            />
            <InformationItem
              icon={BriefcaseBusiness}
              label="Employee code"
              value={leave.employee.employeeCode}
            />

            <InformationItem
              icon={Mail}
              label="Email address"
              value={leave.employee.user.email}
            />

            <InformationItem
              icon={Phone}
              label="Phone number"
              value={leave.employee.phone ?? "Not provided"}
            />

            <InformationItem
              icon={Building2}
              label="Department"
              value={leave.employee.department?.name ?? "Not assigned"}
            />

            <InformationItem
              icon={BriefcaseBusiness}
              label="Position"
              value={leave.employee.position}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
