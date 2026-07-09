"use client"

import {
  Building2,
  CalendarDays,
  Divide,
  FileText,
  UsersRound,
} from "lucide-react"

import { Card, CardContent } from "@/components/ui/card"
import { UseGetAdminDashboard } from "@/hooks/dashboard/use-getAdminDashboard"
import { AppLoading } from "@/components/shared/loading"
export default function AdminDashboardPage() {
  const { data: admin, isLoading , isError } = UseGetAdminDashboard()
  console.log(admin)

  if (isLoading) {
    return <AppLoading />
  }
  if (isError) {
      return <div>Something went wrong</div>
  }

  if (!admin) {
    return (
      <div className="rounded-lg border p-4">
        <h2 className="font-semibold">Employees profile not found</h2>
      </div>
    )
  }

  const dashboardStats = [
    {
      title: "Total Employees",
      value: admin.data.stats.totalEmployees,
      icon: UsersRound,
    },
    {
      title: "Departments",
      value: admin.data.stats.totalDepartments,
      icon: Building2,
    },
    {
      title: "Total Leaves",
      value: admin.data.stats.totalLeaves,
      icon: CalendarDays,
    },
    {
      title: "Pending Leaves",
      value: admin.data.stats.pendingLeaves,
      icon: FileText,
    },
  ]


  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>

          <p className="mt-1 text-sm">
            Welcome back,{" "}
            <span className="font-extrabold">{admin.data.admin.name}</span> —
            here&apos;s your overview
          </p>
        </div>

        {/* Stats */}
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {dashboardStats.map((item) => {
            const Icon = item.icon

            return (
              <Card
                key={item.title}
                className="relative overflow-hidden rounded-lg border border-slate-200 shadow-sm"
              >
                <div className="absolute top-0 left-0 h-full w-1" />

                <CardContent className="flex items-center justify-between p-6">
                  <div>
                    <p className="text-sm font-semibold">{item.title}</p>

                    <p className="mt-3 text-2xl font-bold">{item.value}</p>
                  </div>

                  <div className="flex size-12 items-center justify-center rounded-lg">
                    <Icon className="size-8 stroke-[1.8]" />
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </div>
  )
}
