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
      <div className="flex min-h-screen w-full">
        <MainSidebar />

        <SidebarInset className="bg-slate-50">
          <main className="min-h-screen bg-background p-6 text-foreground">
            {children}
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}
