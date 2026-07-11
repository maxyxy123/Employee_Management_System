type AppErrorProps = {
  title?: string
  message?: string
}

export function AppError({
  title = "Something went wrong",
  message = "Please try again later.",
}: AppErrorProps) {
  return (
    <div className="flex min-h-60 flex-col items-center justify-center gap-2">
      <h2 className="text-lg font-semibold">{title}</h2>

      <p className="text-sm text-muted-foreground">
        {message}
      </p>
    </div>
  )
}