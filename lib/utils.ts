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

export function formatTimeAgo(date: Date): string {
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

  const now = new Date()
  const diffInMilliseconds = now.getTime() - dateObject.getTime()
  const diffInSeconds = Math.floor(diffInMilliseconds / 1000)
  const diffInMinutes = Math.floor(diffInSeconds / 60)
  const diffInHours = Math.floor(diffInMinutes / 60)
  const diffInDays = Math.floor(diffInHours / 24)
  const diffInMonths = Math.floor(diffInDays / 30)
  const diffInYears = Math.floor(diffInDays / 365)

  if (diffInSeconds < 60) {
    return 'just now'
  } else if (diffInMinutes < 60) {
    return `${diffInMinutes} ${diffInMinutes === 1 ? 'minute' : 'minutes'} ago`
  } else if (diffInHours < 24) {
    return `${diffInHours} ${diffInHours === 1 ? 'hour' : 'hours'} ago`
  } else if (diffInDays < 30) {
    return `${diffInDays} ${diffInDays === 1 ? 'day' : 'days'} ago`
  } else if (diffInMonths < 12) {
    return `${diffInMonths} ${diffInMonths === 1 ? 'month' : 'months'} ago`
  } else {
    return `${diffInYears} ${diffInYears === 1 ? 'year' : 'years'} ago`
  }
}

export interface EditorJSBlock {
  id: string
  type: string
  data: {
    text?: string
    level?: number
    file?: {
      url: string
    }
    caption?: string
    withBorder?: boolean
    stretched?: boolean
    withBackground?: boolean
  }
}

export interface EditorJSContent {
  time: number
  blocks: EditorJSBlock[]
  version: string
}

export function extractThumbnail(content: EditorJSContent): string | null {
  if (content && Array.isArray(content.blocks)) {
    const imageBlock = content.blocks.find((block) => block.type === 'image')
    if (
      imageBlock &&
      imageBlock.data &&
      imageBlock.data.file &&
      imageBlock.data.file.url
    ) {
      return imageBlock.data.file.url
    }
  }
  return null
}
