import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function convertDate(input :string){
  const date = new Date(input)
  return date.toLocaleDateString('vi-VN')
}


export function formatDate(date: string) {
  return new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(date))
}

export function formatDateTime(date: string) {
  return new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date))
}


export function calculateTotalDays(
  startDate: string,
  endDate: string
) {
  const start = new Date(startDate)
  const end = new Date(endDate)

  const startUTC = Date.UTC(
    start.getUTCFullYear(),
    start.getUTCMonth(),
    start.getUTCDate()
  )

  const endUTC = Date.UTC(
    end.getUTCFullYear(),
    end.getUTCMonth(),
    end.getUTCDate()
  )

  if (endUTC < startUTC) {
    return 0
  }

  return Math.floor((endUTC - startUTC) / 86_400_000) + 1
}

export function getInitials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .slice(-2)
    .map((word) => word.charAt(0))
    .join("")
    .toUpperCase()
}