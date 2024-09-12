import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatEnumValue(enumValue: string): string {
  return enumValue.replace(/\w\S*/g, (word) => {
    return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
  })
}

export function formatDate(date: Date, locale: string = 'en-US'): string {
  let dateObject: Date

  if (typeof date === 'string') {
    dateObject = new Date(date)
  } else if (date instanceof Date) {
    dateObject = date
  } else {
    return 'Invalid Date'
  }

  if (isNaN(dateObject.getTime())) {
    return 'Invalid Date'
  }

  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }

  return new Intl.DateTimeFormat(locale, options).format(dateObject)
}
