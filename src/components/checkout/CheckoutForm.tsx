'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Package, Calculator, MapPin, Cat, Clock } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import type { Database } from '@/types/database'

type Plan = Database['public']['Tables']['plans']['Row']
type Profile = Database['public']['Tables']['profiles']['Row']
type Cat = Database['public']['Tables']['cats']['Row']

interface CheckoutFormProps {
  plan: Plan
  cats: Cat[]
  profile: Profile
}

export default function CheckoutForm({ plan, cats, profile }: CheckoutFormProps) {
  const [notes, setNotes] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  // Calculate nutritional totals
  const catsWithNutrition = cats.map(cat => ({
    ...cat,
    nutrition: {
      daily_calories: Math.round(cat.weight_kg * 70 * Math.pow(cat.weight_kg, 0.75) * 
        (cat.activity_level === 'low' ? 1.2 : cat.activity_level === 'high' ? 1.6 : 1.4)),
      daily_grams: Math.round(cat.weight_kg * 20 * 
        (cat.activity_level === 'low' ? 1.1 : cat.activity_level === 'high' ? 1.3 : 1.2))
    }
  }))

  const totalDailyCalories = catsWithNutrition.reduce((sum, cat) => sum + cat.nutrition.daily_calories, 0)
  const totalDailyGrams = catsWithNutrition.reduce((sum, cat) => sum + cat.nutrition.daily_grams, 0)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const supabase = createClient()
      
      // Get current user
      const { data: { user }, error: userError } = await supabase.auth.getUser()
      if (userError || !user) {
        throw new Error('يجب تسجيل الدخول أولاً')
      }

      // Create order
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: user.id,
          plan_id: plan.id,
          total_price: plan.price,
          currency: plan.currency,
          city: profile.city,
          delivery_address: profile.address,
          phone: profile.phone,
          notes: notes || null,
          status: 'pending',
          cats_data: catsWithNutrition,
          nutrition_summary: {
            total_daily_calories: totalDailyCalories,
            total_daily_grams: totalDailyGrams,
            cats_count: cats.length
          }
        })
        .select()
        .single()

      if (orderError) {
        throw new Error('فشل في إنشاء الطلب: ' + orderError.message)
      }

      // Redirect to success page
      router.push(`/orders/${order.id}/success`)
      
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'حدث خطأ غير متوقع'
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Order Summary */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="font-cairo flex items-center">
                <Package className="h-5 w-5 ml-2" />
                ملخص الطلب
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span>الخطة:</span>
                <span className="font-medium">
                  {plan.name === 'Weekly' ? 'أسبوعية' : 'شهرية'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span>المدة:</span>
                <span>{plan.name === 'Weekly' ? '7 أيام' : '30 يوم'}</span>
              </div>
              <div className="flex justify-between items-center">
                <span>عدد القطط:</span>
                <span>{cats.length}</span>
              </div>
              <div className="flex justify-between items-center text-lg font-bold border-t pt-4">
                <span>الإجمالي:</span>
                <span className="text-brand">{plan.price} {plan.currency}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="font-cairo flex items-center">
                <Calculator className="h-5 w-5 ml-2" />
                الحسابات الغذائية
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-center">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{totalDailyCalories}</div>
                  <div className="text-sm text-blue-600">سعرة/يوم</div>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{totalDailyGrams}</div>
                  <div className="text-sm text-green-600">جرام/يوم</div>
                </div>
              </div>
              <p className="text-sm text-gray-600">
                هذه الحسابات مُخصصة حسب وزن وعمر ونشاط كل قطة
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="font-cairo flex items-center">
                <MapPin className="h-5 w-5 ml-2" />
                معلومات التوصيل
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div><strong>الاسم:</strong> {profile.name}</div>
              <div><strong>المدينة:</strong> {profile.city}</div>
              <div><strong>العنوان:</strong> {profile.address}</div>
              <div><strong>الهاتف:</strong> {profile.phone}</div>
            </CardContent>
          </Card>
        </div>

        {/* Cats Details */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="font-cairo flex items-center">
                <Cat className="h-5 w-5 ml-2" />
                تفاصيل القطط ({cats.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {catsWithNutrition.map((cat) => (
                  <div key={cat.id} className="border rounded-lg p-4">
                    <h4 className="font-medium text-lg mb-2">{cat.name}</h4>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>العمر: {cat.age_months} شهر</div>
                      <div>الوزن: {cat.weight_kg} كجم</div>
                      <div>السعرات: {cat.nutrition.daily_calories}/يوم</div>
                      <div>الكمية: {cat.nutrition.daily_grams}جم/يوم</div>
                    </div>
                    {cat.allergies && cat.allergies.length > 0 && (
                      <div className="mt-2 text-xs bg-orange-50 text-orange-700 p-2 rounded">
                        حساسية: {cat.allergies.join(', ')}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Order Form */}
          <Card>
            <CardHeader>
              <CardTitle className="font-cairo">إتمام الطلب</CardTitle>
              <CardDescription>
                ملاحظات إضافية (اختياري)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="notes">ملاحظات خاصة</Label>
                  <Textarea
                    id="notes"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="مثل: أوقات تفضيل التوصيل، تعليمات خاصة للقطط، إلخ..."
                    rows={4}
                  />
                </div>

                {error && (
                  <div className="text-red-500 text-sm bg-red-50 p-3 rounded">
                    {error}
                  </div>
                )}

                <div className="bg-blue-50 p-4 rounded-lg space-y-2">
                  <div className="flex items-center text-blue-700">
                    <Clock className="h-4 w-4 ml-2" />
                    <span className="text-sm font-medium">معلومات مهمة</span>
                  </div>
                  <ul className="text-sm text-blue-600 space-y-1 mr-6">
                    <li>• الدفع عند الاستلام</li>
                    <li>• التوصيل مجاني في القاهرة والجيزة</li>
                    <li>• سنتواصل معك لتأكيد موعد التوصيل</li>
                    <li>• الطعام طازج ومُحضر خصيصاً لقططك</li>
                  </ul>
                </div>

                <Button 
                  type="submit" 
                  className="w-full" 
                  size="lg"
                  disabled={loading}
                >
                  {loading ? 'جاري إنشاء الطلب...' : `تأكيد الطلب - ${plan.price} ${plan.currency}`}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}