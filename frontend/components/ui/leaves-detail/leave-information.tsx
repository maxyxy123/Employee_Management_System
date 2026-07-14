import { calculateTotalDays, formatDate } from "@/lib/utils";
import { CalendarDays, Clock3 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../card";
import { InformationItem } from "./information-items";
import { LeaveDetail } from "@/schema/leaves.schema";
import { Separator } from "../separator";
import { Label } from "../label";

type LeaveTypeProps = {
    leave : LeaveDetail
}



export function EmployeeLeaveInformationCard({leave}:LeaveTypeProps){
    const totalDays = calculateTotalDays(leave.startDate, leave.endDate)
   
    return (
        <Card>
            <CardHeader>
              <CardTitle>Leave information</CardTitle>

              <CardDescription>
                Duration and type of the employee&apos;s leave request.
              </CardDescription>
            </CardHeader>

            <CardContent>
              <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
                <InformationItem
                  icon={CalendarDays}
                  label="Leave type"
                  value={leave.leaveType}
                />

                <InformationItem
                  icon={CalendarDays}
                  label="Start date"
                  value={formatDate(leave.startDate)}
                />

                <InformationItem
                  icon={CalendarDays}
                  label="End date"
                  value={formatDate(leave.endDate)}
                />

                <InformationItem
                  icon={Clock3}
                  label="Total duration"
                  value={`${totalDays} ${totalDays === 1 ? "day" : "days"}`}
                />
              </div>

              <Separator className="my-6" />

              <div className="space-y-2">
                <Label>Reason for leave</Label>

                <div className="min-h-28 rounded-lg border bg-muted/30 p-4 text-sm leading-6">
                  {leave.reason}
                </div>
              </div>
            </CardContent>
          </Card>
    )
}