export type Leave = {
  id : string;
  employeeId : string
  employee: {
    user: {
      name: string
    }
    status: string
    leaveType: string
    reason: string
    startDate: string
    endDate :string
  }
}

export type LeaveStatus = "PENDING" | "APPROVED" | "REJECTED"

export type LeaveDetail = {
  id: string
  leaveType: string
  startDate: string
  endDate: string
  reason: string
  status: LeaveStatus
  createdAt: string
  updatedAt: string

  employee: {
    id: string
    employeeCode: string
    position: string
    phone: string | null
    avatar: string | null

    user: {
      name: string
      email: string
    }

    department: {
      name: string
    } | null
  }
}
