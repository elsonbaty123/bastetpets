import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import { CheckCircle, MessageCircle, Package, Home } from 'lucide-react'

export default async function OrderSuccessPage({
  params,
}: {
  params: { id: string }
}) {
  const supabase = await createClient()
  
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/sign-in')
  }

  // Get order details
  const { data: order }: { data: any } = await supabase
    .from('orders')
    .select(`
      *,
      plans:plan_id (name, price, currency)
    `)
    .eq('id', params.id)
    .eq('user_id', user.id)
    .single()

  if (!order) {
    redirect('/dashboard')
  }

  const brandName = process.env.NEXT_PUBLIC_BRAND_NAME || 'بستت'
  const adminWhatsApp = process.env.ADMIN_WHATSAPP_E164 || '+201234567890'
  
  // Generate WhatsApp message
  const whatsappMessage = `مرحباً! أنا ${user.email} وقد أنشأت طلب رقم #${order.id} من موقع ${brandName}. أريد التواصل معكم لتأكيد التفاصيل.`
  const whatsappLink = `https://wa.me/${adminWhatsApp.replace('+', '')}?text=${encodeURIComponent(whatsappMessage)}`

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full space-y-8">
        {/* Success Header */}
        <div className="text-center">
          <CheckCircle className="h-20 w-20 text-green-500 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-gray-900 mb-2 font-cairo">
            تم إنشاء طلبك بنجاح!
          </h1>
          <p className="text-xl text-gray-600">
            رقم الطلب: #{order.id.slice(-8)}
          </p>
        </div>

        {/* Order Details */}
        <Card>
          <CardHeader>
            <CardTitle className="font-cairo flex items-center">
              <Package className="h-5 w-5 ml-2" />
              تفاصيل الطلب
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-gray-600">الخطة:</span>
                <p className="font-medium">
                  {(order.plans as any)?.name === 'Weekly' ? 'أسبوعية' : 'شهرية'}
                </p>
              </div>
              <div>
                <span className="text-gray-600">المبلغ:</span>
                <p className="font-medium">{order.total_price} {order.currency}</p>
              </div>
              <div>
                <span className="text-gray-600">المدينة:</span>
                <p className="font-medium">{order.city}</p>
              </div>
              <div>
                <span className="text-gray-600">الحالة:</span>
                <p className="font-medium text-orange-600">في الانتظار</p>
              </div>
            </div>
            {order.notes && (
              <div>
                <span className="text-gray-600">الملاحظات:</span>
                <p className="text-sm bg-gray-50 p-2 rounded mt-1">{order.notes}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Next Steps */}
        <Card>
          <CardHeader>
            <CardTitle className="font-cairo">الخطوات التالية</CardTitle>
            <CardDescription>
              ماذا يحدث الآن؟
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start space-x-3 space-x-reverse">
                <div className="bg-brand text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">1</div>
                <div>
                  <h4 className="font-medium">مراجعة الطلب</h4>
                  <p className="text-sm text-gray-600">سنراجع طلبك وبيانات قططك خلال ساعات قليلة</p>
                </div>
              </div>
              <div className="flex items-start space-x-3 space-x-reverse">
                <div className="bg-gray-300 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">2</div>
                <div>
                  <h4 className="font-medium">التواصل معك</h4>
                  <p className="text-sm text-gray-600">سنتصل بك لتأكيد التفاصيل وتحديد موعد التوصيل</p>
                </div>
              </div>
              <div className="flex items-start space-x-3 space-x-reverse">
                <div className="bg-gray-300 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">3</div>
                <div>
                  <h4 className="font-medium">تحضير الطعام</h4>
                  <p className="text-sm text-gray-600">نحضر الطعام طازجاً وفقاً لاحتياجات كل قطة</p>
                </div>
              </div>
              <div className="flex items-start space-x-3 space-x-reverse">
                <div className="bg-gray-300 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">4</div>
                <div>
                  <h4 className="font-medium">التوصيل</h4>
                  <p className="text-sm text-gray-600">نوصل لك الطلب في الموعد المحدد</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="grid md:grid-cols-2 gap-4">
          <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
            <Button className="w-full" size="lg">
              <MessageCircle className="h-5 w-5 ml-2" />
              راسلنا على واتساب
            </Button>
          </a>
          <Link href="/dashboard">
            <Button variant="outline" className="w-full" size="lg">
              <Home className="h-5 w-5 ml-2" />
              العودة للوحة الرئيسية
            </Button>
          </Link>
        </div>

        {/* Support Info */}
        <div className="text-center text-sm text-gray-600">
          <p>تحتاج مساعدة؟ تواصل معنا على واتساب أو اتصل بنا</p>
          <p className="font-medium">{adminWhatsApp}</p>
        </div>
      </div>
    </div>
  )
}