"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  CalendarCheck,
  ClipboardList,
  LayoutDashboard,
  LogOut,
  Settings,
  User,
  Wallet,
  PersonStandingIcon,
} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { UseGetCurrentUser } from "@/hooks/auth/use-getMe"

export function MainSidebar() {
  const pathname = usePathname()

  const { data: user, isLoading } = UseGetCurrentUser()

  const navItems = [
    {
      title: "Dashboard",
      href: "/admin",
      icon: LayoutDashboard,
    },
    {
      title: "Employees",
      href: "/admin/employees",
      icon: PersonStandingIcon,
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

  return (
    <Sidebar className="border-r border-white/10 bg-[#08101f] text-slate-300">
      <SidebarHeader className="border-b border-white/10 bg-[#08101f] px-5 py-5">
        <div className="flex items-center gap-3">
          <User className="size-6 text-white" />

          <div>
            <h1 className="text-sm font-semibold text-white">Employee MS</h1>
            <p className="text-[11px] text-slate-500">Management System</p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="bg-[#08101f] px-4 py-5">
        <div className="mb-6 rounded-xl bg-white/[0.05] p-3">
          <p className="text-sm font-medium text-white">
            {isLoading ? "Loading" : `Name : ${user.data.name}`}
          </p>
          <p className="text-xs text-slate-500">
            {isLoading ? "Loading" : `Role : ${user.data.role}`}
          </p>
        </div>

        <SidebarMenu>
          {navItems.map((item) => {
            const Icon = item.icon
            const active =
              item.href === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(item.href)

            return (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton
                  asChild
                  isActive={active}
                  className="h-11 rounded-lg px-3 text-slate-400 hover:bg-white/[0.06] hover:text-white data-[active=true]:bg-[#22245f] data-[active=true]:text-white"
                >
                  <Link href={item.href} className="flex items-center gap-3">
                    <Icon className="size-4" />
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )
          })}
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter className="border-t border-white/10 bg-[#08101f] p-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="h-11 rounded-lg px-3 text-slate-400 hover:bg-white/[0.06] hover:text-white"
            >
              <Link href="/login" className="flex items-center gap-3">
                <LogOut className="size-4" />
                <span>Log out</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
