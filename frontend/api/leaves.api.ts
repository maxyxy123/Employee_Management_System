import { api } from "./axios.api"

enum LeaveStatus {
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
}
export const getAllLeaves = async () => {
  const res = await api.get("/leaves")
  return res.data
}

export const getOneLeave = async (leaveId: string) => {
  const res = await api.get(`/leaves/${leaveId}`)
  return res.data
}

export const updateLeaveStatus = async (
  leaveId: string,
  status: LeaveStatus
) => {
  const res = await api.put(`/leaves/${leaveId}/status`,{
    status : status
  })
  return res.data
}
