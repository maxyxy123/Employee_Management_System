"use client"
import { LockKeyhole, Save, UserRound } from "lucide-react"

import { ChangePasswordDialog } from "@/components/ui/settings/change-password-dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { UseUpdateUserProfile } from "@/hooks/auth/use-updateUserProfile"
import { UseGetCurrentUser } from "@/hooks/auth/use-getMe"
import { AppLoading } from "@/components/shared/loading"
import {
  NewProfileInputSchema,
  NewProfileInputType,
} from "@/schema/auth.schema"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
export default function SettingsPage() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<NewProfileInputType>({
    resolver: zodResolver(NewProfileInputSchema),
    mode: "onChange",
  })

  const { data: response, isLoading } = UseGetCurrentUser()

  const employeeId = response?.data?.employee?.id ?? ""

  const UpdateUserProfileMutation = UseUpdateUserProfile(employeeId)

  if (isLoading) {
    return <AppLoading />
  }

  if (!response.data) {
    return <div>User not found</div>
  }
  console.log("EmployeeId :", employeeId)

  const onsubmit = async (data: NewProfileInputType) => {
    console.log("Data form", data)

    return UpdateUserProfileMutation.mutateAsync(data, {
      onSuccess: () => {
        toast.success("Update Profile Successfully")
      },
      onError: () => {
        toast.error("Failed to Update Your Profile")
      },
    })
  }

  return (
    <main className="min-h-screen bg-background p-5 md:p-8">
      <div className="mx-auto max-w-375">
        <div className="mb-12">
          <h1 className="text-3xl font-semibold tracking-tight text-foreground">
            Settings
          </h1>

          <p className="mt-2 text-base text-muted-foreground">
            Manage your account and preferences
          </p>
        </div>

        <section className="rounded-2xl border border-border bg-card p-6 text-card-foreground shadow-sm md:p-8">
          <div className="flex items-center gap-3 border-b border-border pb-6">
            <UserRound className="size-6 text-muted-foreground" />

            <h2 className="text-xl font-semibold text-foreground">
              Public Profile
            </h2>
          </div>

          <form onSubmit={handleSubmit(onsubmit)} className="mt-8 space-y-7">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2.5">
                <Label htmlFor="name" className="text-base">
                  Name
                </Label>

                <Input
                  id="name"
                  {...register("name")}
                  placeholder="Enter your name"
                  className="h-14 rounded-lg bg-muted/40"
                />

                {errors.name && errors.name.message}
              </div>

              <div className="space-y-2.5">
                <Label htmlFor="email" className="text-base">
                  Email
                </Label>

                <Input
                  id="email"
                  type="email"
                  {...register("email")}
                  placeholder="Enter your email"
                  className="h-14 rounded-lg bg-muted/40"
                />
                {errors.email && errors.email.message}
              </div>
            </div>

            <div className="space-y-2.5">
              <Label htmlFor="position" className="text-base">
                Position
              </Label>

              <Input
                id="position"
                {...register("position")}
                placeholder="Enter your position"
                className="h-14 rounded-lg bg-muted/40"
              />
              {errors.position && errors.position.message}
            </div>

            <div className="flex justify-end pt-2">
              <Button
                type="submit"
                className="h-14 gap-2 rounded-lg px-7 text-base shadow-md"
                disabled={isSubmitting}
              >
                {!isSubmitting ? (
                  <>
                    <Save className="size-5" /> Save Changes{" "}
                  </>
                ) : (
                  "is loading"
                )}
              </Button>
            </div>
          </form>
        </section>

        <section className="mt-8 max-w-2xl rounded-2xl border border-border bg-card p-6 text-card-foreground shadow-sm">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex size-14 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                <LockKeyhole className="size-6 text-primary" />
              </div>

              <div>
                <h2 className="text-lg font-semibold text-foreground">
                  Password
                </h2>

                <p className="mt-1 text-sm text-muted-foreground">
                  Update your account password
                </p>
              </div>
            </div>

            <ChangePasswordDialog />
          </div>
        </section>
      </div>
    </main>
  )
}
