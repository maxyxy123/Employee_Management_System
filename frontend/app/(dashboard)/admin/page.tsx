"use client"

import { Building2, CalendarDays, FileText, UsersRound } from "lucide-react"

import { Card, CardContent } from "@/components/ui/card"
import { adminDashboardStats } from "@/api/dashboard.api"


//Mock dashboardStats
const dashboardStats = [
  {
    title: "Total Employees",
    value: 3,
    icon: UsersRound,
  },
  {
    title: "Departments",
    value: 10,
    icon: Building2,
  },
  {
    title: "Today's Attendance",
    value: 1,
    icon: CalendarDays,
  },
  {
    title: "Pending Leaves",
    value: 1,
    icon: FileText,
  },
]

export default function AdminDashboardPage() {
  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Dashboard
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Welcome back, Admin — here&apos;s your overview
          </p>
        </div>

        {/* Stats */}
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {dashboardStats.map((item) => {
            const Icon = item.icon

            return (
              <Card
                key={item.title}
                className="relative overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm"
              >
                <div className="absolute top-0 left-0 h-full w-1 bg-slate-400" />

                <CardContent className="flex items-center justify-between p-6">
                  <div>
                    <p className="text-sm font-semibold text-slate-700">
                      {item.title}
                    </p>

                    <p className="mt-3 text-2xl font-bold text-slate-950">
                      {item.value}
                    </p>
                  </div>

                  <div className="flex size-12 items-center justify-center rounded-lg text-slate-500">
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
