import { api } from "./axios.api"
import {
  CreateEmployeeType,
  UpdateEmployeeType,
} from "@/schema/employee.schema"
export const getAllEmployees = async () => {
  const res = await api.get("/employees")
  return res.data
}

export const getOneEmployee = async (employeeId: string) => {
  const res = await api.get(`/employees/${employeeId}`)
  return res.data
}

export const createEmployee = async (employeeInput: CreateEmployeeType) => {
  const res = await api.post("/employees", employeeInput)
  return res.data
}

export const updateEmployee = async (
  employeeId: string,
  employeeInputUpdate: UpdateEmployeeType
) => {
  const res = await api.put(`/employees/${employeeId}`, employeeInputUpdate)
  return res.data
}

export const deleteEmployee = async (employeeId: string) => {
  const res = await api.delete(`/employees/${employeeId}`)
  return res.data
}
