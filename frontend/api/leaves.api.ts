import { api } from "./axios.api"

export const getAllLeaves = async () => {
  const res = await api.get("/leaves")
  return res.data
}
