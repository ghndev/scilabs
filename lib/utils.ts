import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatEnumValue(enumValue: string): string {
  const withSpaces = enumValue.replace(/_/g, ' ')

  return withSpaces.replace(/\w\S*/g, (word) => {
    return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
  })
}

export function formatDate(date: Date, locale: string = 'en-US'): string {
  if (!(date instanceof Date) || isNaN(date.getTime())) {
    return 'Invalid Date'
  }

  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }

  return new Intl.DateTimeFormat(locale, options).format(date)
}
