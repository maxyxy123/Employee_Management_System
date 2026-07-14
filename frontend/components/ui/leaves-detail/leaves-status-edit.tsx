"use client"

import { useState } from "react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import { UseUpdateLeaveStatus } from "@/hooks/leaves/use-updateLeaveStatus"
import { toast } from "sonner"

enum LeaveStatus {
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
}

type LeaveStatusCardProps = {
  leaveId: string
  currentStatus: LeaveStatus
}

const statusStyles: Record<LeaveStatus, string> = {
  PENDING:
    "border-yellow-200 bg-yellow-100 text-yellow-700 dark:border-yellow-900 dark:bg-yellow-950 dark:text-yellow-400",

  APPROVED:
    "border-green-200 bg-green-100 text-green-700 dark:border-green-900 dark:bg-green-950 dark:text-green-400",

  REJECTED:
    "border-red-200 bg-red-100 text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-400",
}

const statusLabels: Record<LeaveStatus, string> = {
  PENDING: "Pending",
  APPROVED: "Approved",
  REJECTED: "Rejected",
}

export function LeaveStatusCard({
  leaveId,
  currentStatus,
}: LeaveStatusCardProps) {
  const [selectedStatus, setSelectedStatus] =
    useState<LeaveStatus>(currentStatus)
    const UpdateStatusMutation = UseUpdateLeaveStatus()

  const hasStatusChanged =
    selectedStatus !== currentStatus

  const handleUpdateStatus = () => {
    console.log({
      status: selectedStatus,
    })
    UpdateStatusMutation.mutateAsync({leaveId,status : selectedStatus},{
      onError : () => {
        toast.error("Fail to update status")
      },
      onSuccess : () => {
        toast.success("Successfully update status")
      }
    })
   
  }

  return (
    <Card className="lg:sticky lg:top-6 h-fit">
      <CardHeader>
        <CardTitle>Review request</CardTitle>

        <CardDescription>
          Change the status of this leave request.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="leave-status">
            Request status
          </Label>

          <Select
            value={selectedStatus}
            onValueChange={(value) =>
              setSelectedStatus(value as LeaveStatus)
            }
          >
            <SelectTrigger id="leave-status">
              <SelectValue placeholder="Select status" />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="PENDING">
                Pending
              </SelectItem>

              <SelectItem value="APPROVED">
                Approved
              </SelectItem>

              <SelectItem value="REJECTED">
                Rejected
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button
          className="w-full"
          disabled={!hasStatusChanged}
          onClick={handleUpdateStatus}
        >
          Update status
        </Button>

        <Separator />

        <div className="space-y-3 text-sm">
          <div className="flex items-center justify-between gap-3">
            <span className="text-muted-foreground">
              Current status
            </span>

            <Badge
              variant="outline"
              className={statusStyles[currentStatus]}
            >
              {statusLabels[currentStatus]}
            </Badge>
          </div>

          <div className="flex items-center justify-between gap-3">
            <span className="text-muted-foreground">
              Selected status
            </span>

            <Badge
              variant="outline"
              className={statusStyles[selectedStatus]}
            >
              {statusLabels[selectedStatus]}
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}