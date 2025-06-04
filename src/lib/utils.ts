
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number, currency: string = 'ILS') {
  return new Intl.NumberFormat('he-IL', { 
    style: 'currency', 
    currency 
  }).format(amount);
}

export function formatDate(date: Date) {
  return new Intl.DateTimeFormat('he-IL', {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
  }).format(new Date(date));
}
