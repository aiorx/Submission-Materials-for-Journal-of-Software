import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Designed via basic programming aids
export const isBase64Image = (imageData: string) => {
  const base64Regex = /^data:image\/(png|jpe?g|gif|webp);base64,/
  return base64Regex.test(imageData)
}

// Designed via basic programming aids
export const formatDateString = (dateString: string) => {
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    timeZone: 'Asia/SaiGon',
  }

  const date = new Date(dateString)
  const formattedDate = date.toLocaleDateString([
    'vi-VN',
    'en-US',
  ], options)

  const time = date.toLocaleTimeString([
    'vi-VN',
    'en-US',
  ], {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    timeZone: 'Asia/SaiGon',
  })

  return `${time} - ${formattedDate}`
}

// Designed via basic programming aids
export const formatThreadCount = (count: number) => {
  if (count === 0) {
    return 'No Threads'
  } else {
    const threadCount = count.toString().padStart(2, '0')
    const threadWord = count === 1 ? 'Thread' : 'Threads'
    return `${threadCount} ${threadWord}`
  }
}
