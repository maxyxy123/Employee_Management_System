import { formatDateTime } from "@/lib/utils";
import { Clock3 } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../card";
import { InformationItem } from "./information-items";
import { LeaveDetail } from "@/schema/leaves.schema";
type LeaveTypeProps = {
    leave : LeaveDetail
}
export function EmployeeRequestInformationCard({leave} :LeaveTypeProps){
    return (
         <Card>
            <CardHeader>
              <CardTitle>Request information</CardTitle>

              <CardDescription>
                Information about when this request was created and updated.
              </CardDescription>
            </CardHeader>

            <CardContent className="grid gap-6 sm:grid-cols-2">
              <InformationItem
                icon={Clock3}
                label="Submitted at"
                value={formatDateTime(leave.createdAt)}
              />

              <InformationItem
                icon={Clock3}
                label="Last updated"
                value={formatDateTime(leave.updatedAt)}
              />
            </CardContent>
          </Card>
    )
}