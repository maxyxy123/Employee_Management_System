import { api } from "./axios.api"

export const getAllDepartment = async () => {
  const res = await api.get("/departments")
  console.log(res.data)
  return res.data
}
