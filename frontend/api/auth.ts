import { api } from "./axios.api"
import { LoginSchemaType } from "@/schema/auth.schema"

export const login = async (data: LoginSchemaType) => {
  const res = await api.post("/auth/login", data)
    console.log("login API", res.data)
  return res.data
}

export const logout = async () => {
  const res = await api.post("/auth/logout")
  return res.data
}

export const refresh = async () => {
  const res = await api.post("/auth/refresh")
  return res.data
}

export const getCurrentUser = async () => {
  const res = await api.get("/auth/me")
  return res.data
}
