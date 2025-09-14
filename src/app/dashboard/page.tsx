import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import { Plus, Cat, ShoppingCart, User } from 'lucide-react'

export default async function DashboardPage() {
  const supabase = await createClient()
  
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/sign-in')
  }

  // Get user profile
  const { data: profile }: { data: any } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  // Get user's cats
  const { data: cats }: { data: any[] | null } = await supabase
    .from('cats')
    .select('*')
    .eq('user_id', user.id)

  // Get user's recent orders
  const { data: orders }: { data: any[] | null } = await supabase
    .from('orders')
    .select(`
      *,
      plans:plan_id (name, price, currency)
    `)
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(5)

  const brandName = process.env.NEXT_PUBLIC_BRAND_NAME || 'بستت'

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-brand font-cairo">{brandName}</h1>
            </div>
            <div className="flex items-center space-x-4 space-x-reverse">
              <Link href="/profile">
                <Button variant="ghost" size="sm">
                  <User className="h-4 w-4 ml-2" />
                  الملف الشخصي
                </Button>
              </Link>
              <form action="/auth/signout" method="post">
                <Button variant="ghost" size="sm" type="submit">
                  تسجيل الخروج
                </Button>
              </form>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 font-cairo">
            أهلاً وسهلاً{profile?.name ? ` ${profile.name}` : ''}!
          </h2>
          <p className="text-gray-600 mt-2">
            إدارة قططك وطلباتك من مكان واحد
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Link href="/cats/new">
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardHeader className="text-center">
                <Plus className="h-12 w-12 text-brand mx-auto mb-2" />
                <CardTitle className="font-cairo">إضافة قطة جديدة</CardTitle>
                <CardDescription>
                  أضف بيانات قطة جديدة للحصول على خطة غذائية مخصصة
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>

          <Link href="/cats">
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardHeader className="text-center">
                <Cat className="h-12 w-12 text-brand mx-auto mb-2" />
                <CardTitle className="font-cairo">قططي</CardTitle>
                <CardDescription>
                  عرض وإدارة جميع قططك المسجلة
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>

          <Link href="/plans">
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardHeader className="text-center">
                <ShoppingCart className="h-12 w-12 text-brand mx-auto mb-2" />
                <CardTitle className="font-cairo">الخطط المتاحة</CardTitle>
                <CardDescription>
                  اختر الخطة المناسبة لقططك
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* My Cats */}
          <Card>
            <CardHeader>
              <CardTitle className="font-cairo">قططي</CardTitle>
              <CardDescription>
                {cats?.length || 0} قطة مسجلة
              </CardDescription>
            </CardHeader>
            <CardContent>
              {cats && cats.length > 0 ? (
                <div className="space-y-3">
                  {cats.slice(0, 3).map((cat) => (
                    <div key={cat.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium">{cat.name}</p>
                        <p className="text-sm text-gray-600">
                          {cat.age_months} شهر • {cat.weight_kg} كجم
                        </p>
                      </div>
                      <Link href={`/cats/${cat.id}`}>
                        <Button variant="outline" size="sm">
                          عرض
                        </Button>
                      </Link>
                    </div>
                  ))}
                  {cats.length > 3 && (
                    <Link href="/cats">
                      <Button variant="ghost" className="w-full">
                        عرض الكل ({cats.length})
                      </Button>
                    </Link>
                  )}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Cat className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-4">لم تضف أي قطة بعد</p>
                  <Link href="/cats/new">
                    <Button>إضافة قطة جديدة</Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Orders */}
          <Card>
            <CardHeader>
              <CardTitle className="font-cairo">الطلبات الأخيرة</CardTitle>
              <CardDescription>
                آخر {orders?.length || 0} طلبات
              </CardDescription>
            </CardHeader>
            <CardContent>
              {orders && orders.length > 0 ? (
                <div className="space-y-3">
                  {orders.map((order) => (
                    <div key={order.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium">
                          {(order.plans as any)?.name}
                        </p>
                        <p className="text-sm text-gray-600">
                          {order.total_price} {order.currency} • {order.status === 'pending' ? 'في الانتظار' : 
                           order.status === 'confirmed' ? 'مؤكد' : 
                           order.status === 'preparing' ? 'قيد التحضير' : 
                           order.status === 'shipped' ? 'تم الشحن' : 
                           order.status === 'delivered' ? 'تم التسليم' : 'ملغي'}
                        </p>
                      </div>
                      <Link href={`/orders/${order.id}`}>
                        <Button variant="outline" size="sm">
                          عرض
                        </Button>
                      </Link>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <ShoppingCart className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-4">لا توجد طلبات بعد</p>
                  <Link href="/plans">
                    <Button>تصفح الخطط</Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}