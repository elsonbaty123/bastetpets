import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import { Check, Calendar, Package } from 'lucide-react'

export default async function PlansPage() {
  const supabase = await createClient()
  
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/sign-in')
  }

  // Get available plans
  const { data: plans }: { data: any[] | null } = await supabase
    .from('plans')
    .select('*')
    .eq('is_active', true)
    .order('price', { ascending: true })

  // Get user's cats
  const { data: cats }: { data: any[] | null } = await supabase
    .from('cats')
    .select('*')
    .eq('user_id', user.id)

  const brandName = process.env.NEXT_PUBLIC_BRAND_NAME || 'بستت'

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4 space-x-reverse">
              <Link href="/dashboard">
                <Button variant="ghost">← العودة للوحة الرئيسية</Button>
              </Link>
              <h1 className="text-2xl font-bold text-brand font-cairo">الخطط المتاحة</h1>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4 font-cairo">
            اختر الخطة المناسبة لقططك
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            خطط غذائية مُصممة خصيصاً حسب احتياجات كل قطة على حدة
          </p>
        </div>

        {/* Check if user has cats */}
        {!cats || cats.length === 0 ? (
          <div className="text-center py-16">
            <Package className="h-24 w-24 text-gray-400 mx-auto mb-6" />
            <h3 className="text-2xl font-semibold text-gray-900 mb-4 font-cairo">
              يجب إضافة قطة أولاً
            </h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              لحساب الكمية والسعرات المناسبة، نحتاج لبيانات قططك أولاً
            </p>
            <Link href="/cats/new">
              <Button size="lg">
                إضافة قطة جديدة
              </Button>
            </Link>
          </div>
        ) : (
          <>
            {/* Plans */}
            {plans && plans.length > 0 ? (
              <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                {plans.map((plan) => (
                  <Card key={plan.id} className={`relative hover:shadow-lg transition-shadow ${
                    plan.name === 'Monthly' ? 'border-brand border-2' : ''
                  }`}>
                    {plan.name === 'Monthly' && (
                      <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                        <span className="bg-brand text-white px-4 py-1 rounded-full text-sm font-medium">
                          الأكثر شعبية
                        </span>
                      </div>
                    )}
                    <CardHeader className="text-center">
                      <div className="mb-4">
                        {plan.name === 'Weekly' ? (
                          <Calendar className="h-12 w-12 text-brand mx-auto" />
                        ) : (
                          <Package className="h-12 w-12 text-brand mx-auto" />
                        )}
                      </div>
                      <CardTitle className="font-cairo text-2xl">
                        {plan.name === 'Weekly' ? 'الخطة الأسبوعية' : 'الخطة الشهرية'}
                      </CardTitle>
                      <div className="text-4xl font-bold text-brand mt-4">
                        {plan.price} <span className="text-lg text-gray-600">{plan.currency}</span>
                      </div>
                      <CardDescription className="text-base mt-2">
                        {plan.description || (plan.name === 'Weekly' 
                          ? 'تجربة مثالية لبداية رحلة قطتك الصحية' 
                          : 'أفضل قيمة مقابل المال مع توفير أكبر')}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4 mb-6">
                        <div className="flex items-center space-x-2 space-x-reverse">
                          <Check className="h-5 w-5 text-green-500" />
                          <span className="text-sm">
                            {plan.name === 'Weekly' ? '7 أيام من الطعام الطازج' : '30 يوم من الطعام الطازج'}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2 space-x-reverse">
                          <Check className="h-5 w-5 text-green-500" />
                          <span className="text-sm">مُحسوب حسب وزن وعمر كل قطة</span>
                        </div>
                        <div className="flex items-center space-x-2 space-x-reverse">
                          <Check className="h-5 w-5 text-green-500" />
                          <span className="text-sm">مكونات طبيعية 100%</span>
                        </div>
                        <div className="flex items-center space-x-2 space-x-reverse">
                          <Check className="h-5 w-5 text-green-500" />
                          <span className="text-sm">توصيل مجاني في القاهرة والجيزة</span>
                        </div>
                        <div className="flex items-center space-x-2 space-x-reverse">
                          <Check className="h-5 w-5 text-green-500" />
                          <span className="text-sm">دعم فني متواصل</span>
                        </div>
                        {plan.name === 'Monthly' && (
                          <>
                            <div className="flex items-center space-x-2 space-x-reverse">
                              <Check className="h-5 w-5 text-green-500" />
                              <span className="text-sm font-medium text-brand">توفير 15% مقارنة بالأسبوعي</span>
                            </div>
                            <div className="flex items-center space-x-2 space-x-reverse">
                              <Check className="h-5 w-5 text-green-500" />
                              <span className="text-sm font-medium text-brand">استشارة تغذية مجانية</span>
                            </div>
                          </>
                        )}
                      </div>
                      
                      <Link href={`/checkout?plan=${plan.id}`}>
                        <Button className="w-full" size="lg">
                          اختر هذه الخطة
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <p className="text-gray-600">لا توجد خطط متاحة حالياً</p>
              </div>
            )}

            {/* Cat Selection Info */}
            <div className="mt-16 bg-blue-50 rounded-lg p-8">
              <h3 className="text-xl font-semibold text-blue-900 mb-4 font-cairo">
                قططك المسجلة ({cats.length})
              </h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {cats.map((cat) => (
                  <div key={cat.id} className="bg-white rounded-lg p-4 shadow-sm">
                    <h4 className="font-medium text-gray-900">{cat.name}</h4>
                    <p className="text-sm text-gray-600">
                      {cat.age_months} شهر • {cat.weight_kg} كجم
                    </p>
                    <p className="text-xs text-blue-600 mt-1">
                      سيتم حساب الكمية المناسبة تلقائياً
                    </p>
                  </div>
                ))}
              </div>
              <p className="text-sm text-blue-700 mt-4">
                ستحصل على طعام مُحسوب خصيصاً لكل قطة حسب وزنها وعمرها ومستوى نشاطها
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  )
}