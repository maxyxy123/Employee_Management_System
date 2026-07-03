"use client"

import { useState } from "react"
import { Eye, EyeOff } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useForm, SubmitHandler } from "react-hook-form"
import { LoginSchema, LoginSchemaType } from "@/schema/auth.schema"
import { zodResolver } from "@hookform/resolvers/zod"
import { login } from "@/api/auth"
import { UseLogin } from "@/hooks/auth/use-login"
import { da } from "zod/locales"
export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)

  const loginMutation = UseLogin()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginSchemaType>({
    resolver: zodResolver(LoginSchema),
    mode: "onChange",
  })

  const onSubmit = async (loginInput: LoginSchemaType) => {
 loginMutation.mutate(loginInput)
  }

  return (
    <main className="min-h-dvh bg-[#2f2f2f] p-0">
      <section className="grid min-h-dvh w-full bg-white md:grid-cols-2">
        {/* Left panel */}
        <div className="hidden bg-[#211D52] px-14 md:flex md:flex-col md:justify-center">
          <div className="max-w-[430px]">
            <h1 className="text-4xl leading-tight font-semibold tracking-[-0.04em] text-white">
              Employee
              <br />
              Management System
            </h1>

            <p className="mt-6 max-w-[360px] text-sm leading-6 text-white/65">
              Streamline your workforce operations, track attendance, manage
              payroll, and empower your team securely.
            </p>
          </div>
        </div>

        {/* Right panel */}
        <div className="flex items-center justify-center px-6 py-10">
          <div className="w-full max-w-[385px]">
            <div>
              <h2 className="text-2xl font-semibold tracking-[-0.03em] text-slate-950">
                Employee Portal
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Sign in to access your account
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-5">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">
                  Email address
                </Label>
                <Input
                  id="email"
                  type="email"
                  {...register("email")}
                  placeholder="john@example.com"
                  className="h-11 rounded-md border-slate-200 text-sm text-slate-600 shadow-none placeholder:text-slate-400"
                />
                <div className="text-red-500">
                  {errors.email && errors.email.message}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium">
                  Password
                </Label>

                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    {...register("password")}
                    placeholder="••••••••"
                    className="h-11 rounded-md border-slate-200 bg-white pr-11 text-sm text-slate-600 shadow-none placeholder:text-slate-400 focus-visible:ring-[#5B47FF]"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute top-1/2 right-3 -translate-y-1/2 text-slate-400 transition hover:text-slate-700"
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
                <div className="text-red-500">
                  {errors.password && errors.password.message}
                </div>
              </div>

              <Button
                type="submit"
                className="h-11 w-full rounded-md bg-[#5B47FF] text-sm font-semibold shadow-lg shadow-[#5B47FF]/25 hover:bg-[#4D3BE8]"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Loading" : "Sign in "}
              </Button>
            </form>
          </div>
        </div>
      </section>
    </main>
  )
}
