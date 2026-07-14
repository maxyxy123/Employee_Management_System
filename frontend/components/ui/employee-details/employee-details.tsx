"use client"

import Link from "next/link"
import { UseGetOneEmployee } from "@/hooks/employees/use-getOneEmployee"
import { AppLoading } from "@/components/shared/loading"
import { AppError } from "@/components/shared/error"
import { convertDate } from "@/lib/utils"

type EmployeeIdProps = {
  employeeId: string
}

export function EmployeeDetails({ employeeId }: EmployeeIdProps) {
  console.log(employeeId)
  const {
    data: employeeInput,
    isLoading,
    isError,
    error,

  } = UseGetOneEmployee(employeeId)
  if (isLoading) {
    return <AppLoading />
  }

  if (isError) {
    return <AppError title="Cannot load employee" message={error.message} />
  }

  if (!employeeInput) {
    return (
      <AppError
        title="Employee not found"
        message="The employee data could not be found."
      />
    )
  }
  
  console.log("Get one employee", employeeInput.data)

  const employee = {
    id: employeeInput.data.id,
    name: employeeInput.data.user.name,
    email: employeeInput.data.user.email,
    employeeCode: employeeInput.data.employeeCode,
    phone: employeeInput.data.phone ?? "Not Found",
    position: employeeInput.data.position,
    department: employeeInput.data.department.name,
    joinDate: new Date(employeeInput.data.joinDate).toLocaleDateString(),
    salary: employeeInput.data.salary ?? "Not Found",
    address: employeeInput.data.address ?? "Not Found",
    avatar: employeeInput.data.avatar,
    status: employeeInput.data.user.status,
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-muted-foreground">Employee / Details</p>

          <h1 className="text-2xl font-bold tracking-tight">
            Employee Details
          </h1>
        </div>

        <div className="flex gap-3">
          <Link
            href="/admin/employees"
            className="rounded-md border bg-primary px-4 py-2 text-sm font-medium hover:bg-muted"
          >
            Back
          </Link>
        </div>
      </div>

      {/* Main layout */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left profile card */}
        <div className="rounded-lg border bg-card p-6 shadow-sm">
          <div className="flex flex-col items-center text-center">
            <div className="flex h-28 w-28 items-center justify-center rounded-full bg-muted text-3xl font-bold">
              {employee.name.charAt(0)}
            </div>

            <h2 className="mt-4 text-xl font-bold">{employee.name}</h2>

            <p className="text-sm text-muted-foreground">{employee.position}</p>

            <span className="mt-3 rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
              {employee.status}
            </span>
          </div>

          <div className="mt-6 space-y-4 border-t pt-6">
            <div>
              <p className="text-xs text-muted-foreground">Employee Code</p>
              <p className="font-medium">{employee.employeeCode}</p>
            </div>

            <div>
              <p className="text-xs text-muted-foreground">Department</p>
              <p className="font-medium">{employee.department}</p>
            </div>

            <div>
              <p className="text-xs text-muted-foreground">Joined Date</p>
              <p className="font-medium">{employee.joinDate}</p>
            </div>
          </div>
        </div>

        {/* Right content */}
        <div className="space-y-6 lg:col-span-2">
          {/* Personal info */}
          <div className="rounded-lg border bg-card p-6 shadow-sm">
            <h3 className="text-lg font-semibold">Personal Information</h3>

            <div className="mt-5 grid gap-5 sm:grid-cols-2">
              <InfoItem label="Full Name" value={employee.name} />
              <InfoItem label="Email" value={employee.email} />
              <InfoItem label="Phone" value={employee.phone} />
              <InfoItem label="Address" value={employee.address} />
            </div>
          </div>

          {/* Work info */}
          <div className="rounded-lg border bg-card p-6 shadow-sm">
            <h3 className="text-lg font-semibold">Work Information</h3>

            <div className="mt-5 grid gap-5 sm:grid-cols-2">
              <InfoItem label="Position" value={employee.position} />
              <InfoItem label="Department" value={employee.department} />
              <InfoItem label="Salary" value={employee.salary} />
              <InfoItem label="Join Date" value={employee.joinDate} />
            </div>
          </div>

          {/* Stats */}
          <div className="grid gap-4 sm:grid-cols-3">
            <StatCard
              title="Total Leaves"
              value={employeeInput.data.leaveStats.totalLeaves}
            />
            <StatCard
              title="Approved"
              value={employeeInput.data.leaveStats.approvedLeaves}
            />
            <StatCard
              title="Pending"
              value={employeeInput.data.leaveStats.pendingLeaves}
            />
          </div>

          {/* Recent leaves */}
          <div className="rounded-lg border bg-card p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Recent Leaves</h3>

              <button className="text-sm font-medium text-primary hover:underline">
                View all
              </button>
            </div>

            <div className="mt-5 space-y-3">
              {employeeInput.data.leaveStats.allLeaves.map(
                (leave: {
                  id: string
                  leaveType: string
                  startDate: string
                  endDate: string
                  status: "APPROVED" | "PENDING" | "REJECTED"
                }) => {
                  return (
                    <LeaveRow
                      key={leave.id}
                      type={`${leave.leaveType} LEAVE`}
                      date={`${convertDate(leave.startDate)} → ${convertDate(leave.endDate)}`}
                      status={leave.status}
                    />
                  )
                }
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="mt-1 font-medium">{value}</p>
    </div>
  )
}

function StatCard({ title, value }: { title: string; value: string }) {
  return (
    <div className="rounded-lg border bg-card p-5 shadow-sm">
      <p className="text-sm text-muted-foreground">{title}</p>
      <p className="mt-2 text-2xl font-bold">{value}</p>
    </div>
  )
}

function LeaveRow({
  type,
  date,
  status,
}: {
  type: string
  date: string
  status: "APPROVED" | "PENDING" | "REJECTED"
}) {
  const statusClass = {
    APPROVED: "bg-green-100 text-green-700",
    PENDING: "bg-yellow-100 text-yellow-700",
    REJECTED: "bg-red-100 text-red-700",
  }

  return (
    <div className="flex flex-col gap-3 rounded-md border p-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="font-medium">{type}</p>
        <p className="text-sm text-muted-foreground">{date}</p>
      </div>

      <span
        className={`w-fit rounded-full px-3 py-1 text-xs font-semibold ${statusClass[status]}`}
      >
        {status}
      </span>
    </div>
  )
}
