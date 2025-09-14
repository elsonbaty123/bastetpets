import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPrice(price: number, currency: string = "جنيه") {
  return `${price.toFixed(2)} ${currency}`
}

export function formatDate(date: Date | string) {
  const d = new Date(date)
  return d.toLocaleDateString('ar-EG', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

export function formatDateTime(date: Date | string) {
  const d = new Date(date)
  return d.toLocaleString('ar-EG', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

export function generateWhatsAppLink(phoneNumber: string, message: string) {
  const cleanPhone = phoneNumber.replace(/\D/g, '')
  const encodedMessage = encodeURIComponent(message)
  return `https://wa.me/${cleanPhone}?text=${encodedMessage}`
}

export function validateEgyptianPhone(phone: string): boolean {
  // Egyptian phone number validation
  const cleaned = phone.replace(/\D/g, '')
  // Should start with +20 or 0 followed by 10 or 11 digits
  return /^(20)?0?1[0-9]{9}$/.test(cleaned)
}

export function formatPhoneE164(phone: string): string {
  const cleaned = phone.replace(/\D/g, '')
  if (cleaned.startsWith('20')) {
    return `+${cleaned}`
  }
  if (cleaned.startsWith('0')) {
    return `+20${cleaned.substring(1)}`
  }
  return `+20${cleaned}`
}