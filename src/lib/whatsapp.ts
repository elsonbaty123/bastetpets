/**
 * WhatsApp integration utilities
 */

import { formatPhoneE164, generateWhatsAppLink } from '@/lib/utils'

export interface WhatsAppMessage {
  phoneNumber: string
  message: string
}

export interface OrderSummary {
  orderId: string
  customerName: string
  customerPhone: string
  city: string
  planName: string
  totalPrice: number
  currency: string
  catsCount: number
  adminOrderUrl: string
}

/**
 * Generate WhatsApp message for new order notification to admin
 */
export function generateAdminOrderMessage(orderSummary: OrderSummary): string {
  return `🐱 طلب جديد #${orderSummary.orderId}

📋 تفاصيل العميل:
👤 الاسم: ${orderSummary.customerName}
📱 الهاتف: ${orderSummary.customerPhone}
🏘️ المدينة: ${orderSummary.city}

📦 تفاصيل الطلب:
📋 الخطة: ${orderSummary.planName}
🐾 عدد القطط: ${orderSummary.catsCount}
💰 الإجمالي: ${orderSummary.totalPrice} ${orderSummary.currency}

🔗 رابط الطلب: ${orderSummary.adminOrderUrl}

⏰ تم إنشاء الطلب: ${new Date().toLocaleString('ar-EG')}`
}

/**
 * Generate WhatsApp message for customer after order creation
 */
export function generateCustomerOrderMessage(
  customerName: string,
  orderId: string,
  brandName: string = 'بستت'
): string {
  return `أهلاً ${customerName}! 🎉

تم استلام طلبك رقم #${orderId} بنجاح

✅ سنتواصل معك خلال ساعات قليلة لتأكيد التفاصيل وموعد التوصيل

🚚 التوصيل مجاني في القاهرة والجيزة
💳 الدفع عند الاستلام

شكراً لثقتك في ${brandName}! 🐱❤️`
}

/**
 * Send WhatsApp message using Cloud API (if enabled)
 */
export async function sendWhatsAppCloudAPI(
  phoneNumber: string,
  message: string,
  accessToken: string,
  phoneNumberId: string
): Promise<{ success: boolean; messageId?: string; error?: string }> {
  try {
    const cleanPhone = phoneNumber.replace(/\\D/g, '')
    // Ensure E.164 format
    const formattedPhone = cleanPhone.startsWith('20') ? cleanPhone : `20${cleanPhone.replace(/^0/, '')}`
    
    const response = await fetch(`https://graph.facebook.com/v17.0/${phoneNumberId}/messages`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messaging_product: 'whatsapp',
        to: formattedPhone,
        type: 'text',
        text: {
          body: message
        }
      })
    })

    const data = await response.json()

    if (!response.ok) {
      return {
        success: false,
        error: data.error?.message || 'Failed to send WhatsApp message'
      }
    }

    return {
      success: true,
      messageId: data.messages[0]?.id
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

/**
 * Generate click-to-chat WhatsApp link
 */
export function generateClickToChatLink(
  phoneNumber: string,
  message: string
): string {
  return generateWhatsAppLink(phoneNumber, message)
}

/**
 * Send notification to admin about new order
 */
export async function sendAdminOrderNotification(
  orderSummary: OrderSummary,
  adminWhatsApp: string,
  whatsappConfig?: {
    enabled: boolean
    accessToken: string
    phoneNumberId: string
  }
): Promise<{ success: boolean; method: 'api' | 'link'; result: any }> {
  const message = generateAdminOrderMessage(orderSummary)
  
  // Try Cloud API first if enabled
  if (whatsappConfig?.enabled && whatsappConfig.accessToken && whatsappConfig.phoneNumberId) {
    const result = await sendWhatsAppCloudAPI(
      adminWhatsApp,
      message,
      whatsappConfig.accessToken,
      whatsappConfig.phoneNumberId
    )
    
    return {
      success: result.success,
      method: 'api',
      result
    }
  }
  
  // Fallback to click-to-chat link
  const link = generateClickToChatLink(adminWhatsApp, message)
  
  return {
    success: true,
    method: 'link',
    result: { link }
  }
}

/**
 * Store notification in database
 */
export interface NotificationPayload {
  orderId: string
  type: 'whatsapp' | 'email'
  recipient: string
  message: string
  method?: 'api' | 'link'
  messageId?: string
  link?: string
  error?: string
}

export function createNotificationPayload(
  orderId: string,
  type: 'whatsapp' | 'email',
  recipient: string,
  message: string,
  result: any,
  method: 'api' | 'link'
): NotificationPayload {
  const payload: NotificationPayload = {
    orderId,
    type,
    recipient,
    message,
    method
  }
  
  if (method === 'api') {
    if (result.success) {
      payload.messageId = result.messageId
    } else {
      payload.error = result.error
    }
  } else {
    payload.link = result.link
  }
  
  return payload
}