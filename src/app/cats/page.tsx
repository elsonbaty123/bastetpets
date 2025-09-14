import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import { Plus, Cat, Edit } from 'lucide-react'

export default async function CatsPage() {
  const supabase = await createClient()
  
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/sign-in')
  }

  // Get user's cats
  const { data: cats } = await supabase
    .from('cats')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

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
              <h1 className="text-2xl font-bold text-brand font-cairo">قططي</h1>
            </div>
            <Link href="/cats/new">
              <Button>
                <Plus className="h-4 w-4 ml-2" />
                إضافة قطة جديدة
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {cats && cats.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cats.map((cat) => (
              <Card key={cat.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="font-cairo text-xl">{cat.name}</CardTitle>
                      <CardDescription>
                        {cat.sex === 'male' ? 'ذكر' : 'أنثى'} • {cat.breed || 'غير محدد'}
                      </CardDescription>
                    </div>
                    <Cat className="h-8 w-8 text-brand" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">العمر:</span>
                      <span>{cat.age_months} شهر</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">الوزن:</span>
                      <span>{cat.weight_kg} كجم</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">مستوى النشاط:</span>
                      <span>
                        {cat.activity_level === 'low' ? 'منخفض' : 
                         cat.activity_level === 'normal' ? 'طبيعي' : 'عالي'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">الحالة الجسدية:</span>
                      <span>{cat.body_condition_score}/9</span>
                    </div>
                    {cat.neutered && (
                      <div className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs">
                        مخصي/معقم
                      </div>
                    )}
                    {cat.allergies && cat.allergies.length > 0 && (
                      <div className="bg-orange-50 text-orange-700 px-2 py-1 rounded text-xs">
                        يعاني من حساسية ({cat.allergies.length})
                      </div>
                    )}
                    {cat.health_issues && cat.health_issues.length > 0 && (
                      <div className="bg-red-50 text-red-700 px-2 py-1 rounded text-xs">
                        مشاكل صحية ({cat.health_issues.length})
                      </div>
                    )}
                  </div>
                  
                  <div className="flex justify-between items-center mt-4 pt-4 border-t">
                    <Link href={`/cats/${cat.id}`}>
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4 ml-1" />
                        عرض/تعديل
                      </Button>
                    </Link>
                    <Link href={`/plans?cat=${cat.id}`}>
                      <Button size="sm">
                        اختار خطة
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <Cat className="h-24 w-24 text-gray-400 mx-auto mb-6" />
            <h3 className="text-2xl font-semibold text-gray-900 mb-4 font-cairo">
              لم تضف أي قطة بعد
            </h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              ابدأ بإضافة بيانات قطتك للحصول على خطة غذائية مخصصة لاحتياجاتها
            </p>
            <Link href="/cats/new">
              <Button size="lg">
                <Plus className="h-5 w-5 ml-2" />
                إضافة قطة جديدة
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}