import { api } from "./axios.api"

export const adminDashboardStats = async () => {
  const res = await api.get("/dashboard/admin")
  console.log(res.data);
  return res.data
}

export const employeeDashboardStats = async () => {
  const res = await api.get("/dashboard/employee")
  return res.data
}
