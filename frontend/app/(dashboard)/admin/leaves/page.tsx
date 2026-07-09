"use client"
import { AppLoading } from "@/components/shared/loading"
import { UseGetAllLeaves } from "@/hooks/leaves/use-getAllLeaves"
import { columns } from "./columns"
import { DataTable } from "./data-table"
export default function LeavesPage() {
  const { data: allLeaves, isLoading } = UseGetAllLeaves()

  if (isLoading) {
    return <AppLoading />
  }

  console.log(allLeaves)

  return (
    <>
      <div className="p-8">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-extrabold">Leave Management</h1>
            <p className="text-sm text-muted-foreground">
              Manage leave applications
            </p>
          </div>
        </div>
      </div>

      <DataTable columns={columns} data={allLeaves.data} />
    </>
  )
}
