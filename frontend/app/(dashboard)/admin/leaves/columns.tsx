"use client"

import { ColumnDef } from "@tanstack/react-table"
import type { Leave } from "@/schema/leaves.schema"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { MoreHorizontal } from "lucide-react"
import Link from "next/link"

export const columns: ColumnDef<Leave>[] = [
  {
    accessorKey: "employee.user.name",
    header: () => <div className="font-semibold">EMPLOYEE</div>,
  },
  {
    accessorKey: "leaveType",
    header: "TYPE",
  },
  {
    accessorKey: "status",
    header: () => <div>STATUS</div>,
    cell: ({ row }) => {
      const status = row.getValue("status") as
        "PENDING" | "APPROVED" | "REJECTED"
      const leaveStatusClass = {
        PENDING:
          "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-400",

        APPROVED:
          "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-400",

        REJECTED:
          "border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-800 dark:bg-rose-950/40 dark:text-rose-400",
      }

      return (
        <span
          className={`rounded-lg border px-3 py-1 text-xs font-semibold ${leaveStatusClass[status]}`}
        >
          {status}
        </span>
      )
    },
  },
  {
    accessorKey: "reason",
    header: "REASON",
  },
  {
    accessorKey: "startDate",
    header: "STARTDATE",
    cell: ({ row }) => {
      const date = new Date(row.getValue("startDate"))
      const formattedDate = date.toLocaleDateString("vi-en", {
        timeZone: "Asia/Ho_Chi_Minh",
      })
      return <div className="text-center">{formattedDate}</div>
    },
  },
  {
    accessorKey: "endDate",
    header: () => <div className="text-center">ENDDATE</div>,
    cell: ({ row }) => {
      const date = new Date(row.getValue("endDate"))
      const formattedDate = date.toLocaleDateString("vi-en", {
        timeZone: "Asia/Ho_Chi_Minh",
      })
      return <div className="text-center">{formattedDate}</div>
    },
  },
  {
    header: "ACTION",
    id: "action",
    cell: ({ row }) => {
      const leaveId = row.original.id
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem>Copy payment ID</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Link href={`/admin/leaves/${leaveId}`}>View leave details</Link>
            </DropdownMenuItem>
            <DropdownMenuItem>View payment details</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]
