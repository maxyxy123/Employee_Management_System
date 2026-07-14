"use client"
import Link from "next/link"
import type { LucideIcon } from "lucide-react"
import {
  ArrowLeft,
  BriefcaseBusiness,
  Building2,
  CalendarDays,
  Clock3,
  Mail,
  Phone,
  UserRound,
} from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
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

import type { LeaveDetail, LeaveStatus } from "@/schema/leaves.schema"
import {
  calculateTotalDays,
  formatDate,
  formatDateTime,
  getInitials,
} from "@/lib/utils"
import { UseGetOneLeave } from "@/hooks/leaves/use-getOneLeave"
import { AppError } from "@/components/shared/error"
import { AppLoading } from "@/components/shared/loading"
import { LeaveStatusCard } from "./leaves-status-edit"
import { EmployeeInfomationCard } from "./employee-information"
import { EmployeeLeaveInformationCard } from "./leave-information"
import { EmployeeRequestInformationCard } from "./request-informartion"

type LeaveDetailsProps = {
  leaveId: string
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

export function LeaveDetails({ leaveId }: LeaveDetailsProps) {
  const { data: response, isError, isLoading, error } = UseGetOneLeave(leaveId)

  if (isLoading) {
    return <AppLoading />
  }

  if (isError) {
    return <AppError message={error.name} title={error.message} />
  }

  const responseLeave = response?.data.leave
  console.log("leave",responseLeave)
  console.log("employee" ,responseLeave.employee);
  

  if (!responseLeave) {
    return (
      <AppError
        title="Leave not found"
        message="The requested leave does not exist."
      />
    )
  }

  if (!responseLeave.employee) {
  return (
    <AppError
      title="Employee not found"
      message="Employee information for this leave request is missing."
    />
  )
}

if (!responseLeave.employee.user) {
  return (
    <AppError
      title="User information not found"
      message="User information for this employee is missing."
    />
  )
}

  const leave: LeaveDetail = {
    id: leaveId,
    leaveType: responseLeave.leaveType,
    startDate: responseLeave.startDate,
    endDate: responseLeave.endDate,
    reason: responseLeave.reason,
    status: responseLeave.status,
    createdAt: responseLeave.createdAt,
    updatedAt: responseLeave.updatedAt,

    employee: {
      id: responseLeave.employeeId,
      employeeCode: responseLeave.employee.employeeCode,
      position: responseLeave.employee.position,
      phone: responseLeave.employee.phone ?? null,
      avatar: responseLeave.employee.avatar ?? null,

      user: {
        name: responseLeave.employee.user.name,
        email: responseLeave.employee.user.email,
      },

      department: responseLeave.employee.department
        ? {
            name: responseLeave.employee.department.name,
          }
        : null,
    },
  }

  const totalDays = calculateTotalDays(leave.startDate, leave.endDate)

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-2">
          <Button variant="ghost" size="sm" asChild className="-ml-3">
            <Link href="/admin/leaves">
              <ArrowLeft className="mr-2 size-4" />
              Back to leaves
            </Link>
          </Button>

          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight">
              Leave request details
            </h1>

            <Badge variant="outline" className={statusStyles[leave.status]}>
              {statusLabels[leave.status]}
            </Badge>
          </div>

          <p className="text-sm text-muted-foreground">
            Review employee information and leave request details.
          </p>
        </div>

        <p className="text-sm text-muted-foreground">
          Request ID:{" "}
          <span className="font-medium text-foreground">{leave.id}</span>
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(300px,1fr)]">
        <div className="space-y-6">
            {/* employee Information */}
          <EmployeeInfomationCard leave={leave} />
            {/* leave information */}
         <EmployeeLeaveInformationCard leave={leave} />
            {/* request information */}
         <EmployeeRequestInformationCard leave={leave} />
        </div>

            {/* status Card */}
        <LeaveStatusCard leaveId={leaveId} currentStatus={leave.status} />
      </div>
    </div>
  )
}

type InformationItemProps = {
  icon: LucideIcon
  label: string
  value: string
}

function InformationItem({ icon: Icon, label, value }: InformationItemProps) {
  return (
    <div className="flex items-start gap-3">
      <div className="flex size-9 shrink-0 items-center justify-center rounded-md bg-muted">
        <Icon className="size-4 text-muted-foreground" />
      </div>

      <div className="min-w-0 space-y-1">
        <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
          {label}
        </p>

        <p className="text-sm font-medium wrap-break-word">{value}</p>
      </div>
    </div>
  )
}
