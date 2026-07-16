import { api } from "./axios.api"
import { LoginSchemaType, NewProfileInputType, PasswordInputType } from "@/schema/auth.schema"

export const login = async (data: LoginSchemaType) => {
  const res = await api.post("/auth/login", data)
  console.log("login API", res.data.user)
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
  console.log("Get current user:", res.data)
  return res.data
}

export const changePassword = async (passwordInput: PasswordInputType) => {
  const res = await api.put(`/users/me/change-password`, passwordInput)
  return res.data
}

export const updateUserProfile = async (newProfileInput : NewProfileInputType) => {
  const res = await api.put("users/me/profile",newProfileInput)
  return res.data
}
