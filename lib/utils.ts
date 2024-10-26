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
