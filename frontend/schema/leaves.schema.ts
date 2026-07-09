export type Leave = {
  id: string
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
