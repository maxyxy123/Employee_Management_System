import type { CSSProperties, ReactNode } from "react"

import { MainSidebar } from "@/components/ui/main-Sidebar"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"

type DashboardLayoutProps = {
  children: ReactNode
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "280px",
        } as CSSProperties
      }
    >
      <div className="flex min-h-screen w-full bg-slate-950">
        <MainSidebar />

        <SidebarInset className="bg-slate-50">
          <main className="min-h-screen p-6">{children}</main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}
