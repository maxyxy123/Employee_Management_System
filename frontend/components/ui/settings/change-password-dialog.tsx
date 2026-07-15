"use client"

import { useState } from "react"
import { LockKeyhole } from "lucide-react"
import { SubmitHandler, useForm } from "react-hook-form"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { UseChangePassword } from "@/hooks/auth/use-changePassword"
import { toast } from "sonner"

type ChangePasswordInput = {
  currentPassword: string
  newPassword: string
}

export function ChangePasswordDialog() {
  const [open, setOpen] = useState(false)
  const ChangePasswordMutation = UseChangePassword()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ChangePasswordInput>({
    defaultValues: {
      currentPassword: "",
      newPassword: "",
    },
  })

  const onSubmit: SubmitHandler<ChangePasswordInput> = async (data) => {
    ChangePasswordMutation.mutate(data,{
        onError : () => {
            toast.error("Failed to change password")
        },onSuccess : () => {
            toast.success("Successfully changing password")
            setOpen(false)
        }
    })
  }

  const handleOpenChange = (value: boolean) => {
    setOpen(value)

    if (!value) {
      reset()
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button
          type="button"
          variant="outline"
          className="h-11 min-w-32 rounded-lg"
        >
          Change
        </Button>
      </DialogTrigger>

      <DialogContent className="rounded-3xl border-border bg-popover p-8 text-popover-foreground sm:max-w-157.5">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 text-2xl text-foreground">
            <LockKeyhole className="size-7 text-primary" />
            Change Password
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-7">
          <div className="space-y-2">
            <Label htmlFor="currentPassword">
              Current Password
            </Label>

            <Input
              id="currentPassword"
              type="password"
              autoComplete="current-password"
              className="h-14 bg-muted/40"
              {...register("currentPassword", {
                required: "Current password is required",
              })}
            />

            {errors.currentPassword && (
              <p className="text-sm text-destructive">
                {errors.currentPassword.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="newPassword">
              New Password
            </Label>

            <Input
              id="newPassword"
              type="password"
              autoComplete="new-password"
              className="h-14 bg-muted/40"
              {...register("newPassword", {
                required: "New password is required",
                minLength: {
                  value: 8,
                  message: "Password must contain at least 8 characters",
                },
              })}
            />

            {errors.newPassword && (
              <p className="text-sm text-destructive">
                {errors.newPassword.message}
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4 pt-3">
            <DialogClose asChild>
              <Button
                type="button"
                variant="outline"
                className="h-14 rounded-lg"
              >
                Cancel
              </Button>
            </DialogClose>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="h-14 rounded-lg"
            >
              {isSubmitting ? "Updating..." : "Update Password"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}