import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function convertDate(input :string){
  const date = new Date(input)
  return date.toLocaleDateString('vi-VN')
}
