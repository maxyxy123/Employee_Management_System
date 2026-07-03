import { api } from "./axios.api"

export const adminDashboardStats = () => {
  return api.get("/dashboard/admin")
}

export const employeeDashboardStats = () => {
  return api.get("/dashboard/employee")
}
