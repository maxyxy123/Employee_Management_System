import { LucideIcon } from "lucide-react"

type InformationItemProps = {
  icon: LucideIcon
  label: string
  value: string
}

export function InformationItem({ icon: Icon, label, value }: InformationItemProps) {
  return (
    <div className="flex items-start gap-3">
      <div className="flex size-9 shrink-0 items-center justify-center rounded-md bg-muted">
        <Icon className="size-4 text-muted-foreground" />
      </div>

      <div className="min-w-0 space-y-1">
        <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
          {label}
        </p>

        <p className="text-sm font-medium wrap-break-word">{value}</p>
      </div>
    </div>
  )
}