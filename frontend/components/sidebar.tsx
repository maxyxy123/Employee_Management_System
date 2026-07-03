"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  CalendarCheck,
  ChevronRight,
  ClipboardList,
  LayoutDashboard,
  LogOut,
  Settings,
  User,
  Wallet,
} from "lucide-react"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

const navItems = [
  {
    title: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    title: "Attendance",
    href: "/admin/attendance",
    icon: CalendarCheck,
  },
  {
    title: "Leave",
    href: "/admin/leaves",
    icon: ClipboardList,
  },
  {
    title: "Payslips",
    href: "/admin/payslips",
    icon: Wallet,
  },
  {
    title: "Settings",
    href: "/admin/settings",
    icon: Settings,
  },
]

export function AppSidebar() {
  const pathname = usePathname()

  const isActive = (href: string) => {
    if (href === "/admin") {
      return pathname === "/admin"
    }

    return pathname.startsWith(href)
  }

  return (
    <Sidebar
      collapsible="none"
      className="border-r border-white/10 bg-[#08101f] text-slate-300"
    >
      <SidebarHeader className="border-b border-white/10 px-5 py-5">
        <div className="flex items-center gap-3">
          <div className="flex size-9 items-center justify-center rounded-xl bg-transparent text-white">
            <User className="size-6" />
          </div>

          <div className="leading-tight">
            <h1 className="text-sm font-semibold text-white">Employee MS</h1>
            <p className="text-[11px] text-slate-500">Management System</p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="bg-[#08101f] px-4 py-5">
        <div className="mb-6 flex items-center gap-3 rounded-xl bg-white/[0.05] p-3">
          <Avatar className="size-11 rounded-xl">
            <AvatarFallback className="rounded-xl bg-slate-800 text-sm text-slate-300">
              J
            </AvatarFallback>
          </Avatar>

          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-white">John Doe</p>
            <p className="text-xs text-slate-500">Employee</p>
          </div>
        </div>

        <SidebarGroup className="p-0">
          <SidebarGroupLabel className="mb-2 px-1 text-[11px] font-semibold tracking-[0.2em] text-slate-500 uppercase">
            Navigation
          </SidebarGroupLabel>

          <SidebarGroupContent>
            <SidebarMenu className="gap-1">
              {navItems.map((item) => {
                const active = isActive(item.href)
                const Icon = item.icon

                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      asChild
                      isActive={active}
                      className="h-11 rounded-lg px-3 text-slate-400 transition hover:bg-white/[0.06] hover:text-white data-[active=true]:bg-[#22245f] data-[active=true]:text-white"
                    >
                      <Link
                        href={item.href}
                        className="flex items-center gap-3"
                      >
                        <Icon className="size-4" />
                        <span className="text-sm">{item.title}</span>

                        {active && (
                          <ChevronRight className="ml-auto size-4 text-indigo-300" />
                        )}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-white/10 bg-[#08101f] p-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="h-11 rounded-lg px-3 text-slate-400 transition hover:bg-white/[0.06] hover:text-white"
            >
              <Link href="/login" className="flex items-center gap-3">
                <LogOut className="size-4" />
                <span className="text-sm">Log out</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
