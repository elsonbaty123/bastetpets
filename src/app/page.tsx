import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Heart, Shield, Clock, Phone } from "lucide-react"
import Link from "next/link"

export default function HomePage() {
  const brandName = process.env.NEXT_PUBLIC_BRAND_NAME || 'بستت'

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-brand font-cairo">{brandName}</h1>
            </div>
            <div className="flex items-center space-x-4 space-x-reverse">
              <Link href="/auth/sign-in">
                <Button variant="ghost">تسجيل الدخول</Button>
              </Link>
              <Link href="/auth/sign-up">
                <Button>ابدأ دلوقتي</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 font-cairo">
            أفضل طعام لقطتك
            <br />
            <span className="text-brand">مُصمم خصيصاً لها</span>
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            خطط غذائية مُخصصة حسب عمر ووزن وحالة قطتك الصحية. 
            صناديق أسبوعية وشهرية بأفضل المكونات الطبيعية.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/sign-up">
              <Button size="lg" className="text-lg px-8 py-4">
                ابدأ دلوقتي
              </Button>
            </Link>
            <Link href="#how-it-works">
              <Button variant="outline" size="lg" className="text-lg px-8 py-4">
                ازاي بيشتغل؟
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h3 className="text-3xl font-bold text-gray-900 mb-4 font-cairo">
              ليه تختارنا؟
            </h3>
            <p className="text-xl text-gray-600">
              لأننا نهتم بصحة قطتك زيك كده
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center">
              <CardHeader>
                <Heart className="h-12 w-12 text-brand mx-auto mb-4" />
                <CardTitle className="font-cairo">مُصمم خصيصاً</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  كل وجبة مُصممة حسب عمر ووزن وحالة قطتك الصحية والنشاط اليومي
                </CardDescription>
              </CardContent>
            </Card>
            
            <Card className="text-center">
              <CardHeader>
                <Shield className="h-12 w-12 text-brand mx-auto mb-4" />
                <CardTitle className="font-cairo">مكونات طبيعية</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  مكونات طبيعية 100% بدون مواد حافظة أو ألوان صناعية
                </CardDescription>
              </CardContent>
            </Card>
            
            <Card className="text-center">
              <CardHeader>
                <Clock className="h-12 w-12 text-brand mx-auto mb-4" />
                <CardTitle className="font-cairo">توصيل سريع</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  توصيل مجاني في القاهرة والجيزة، ووصول سريع لباقي المحافظات
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h3 className="text-3xl font-bold text-gray-900 mb-4 font-cairo">
              ازاي بيشتغل؟
            </h3>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-brand text-white rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4 text-xl font-bold">1</div>
              <h4 className="text-xl font-semibold mb-2 font-cairo">سجل بيانات قطتك</h4>
              <p className="text-gray-600">
                اكتب اسم قطتك، عمرها، وزنها، والحالة الصحية
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-brand text-white rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4 text-xl font-bold">2</div>
              <h4 className="text-xl font-semibold mb-2 font-cairo">اختار الخطة</h4>
              <p className="text-gray-600">
                خطط أسبوعية أو شهرية حسب احتياجك
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-brand text-white rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4 text-xl font-bold">3</div>
              <h4 className="text-xl font-semibold mb-2 font-cairo">استلم الصندوق</h4>
              <p className="text-gray-600">
                هنوصلك الصندوق في الميعاد المحدد
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-brand text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-3xl font-bold mb-4 font-cairo">
            جاهز تبدأ رحلة الصحة مع قطتك؟
          </h3>
          <p className="text-xl mb-8 opacity-90">
            انضم لآلاف العملاء اللي وثقوا فينا
          </p>
          <Link href="/auth/sign-up">
            <Button size="lg" variant="secondary" className="text-lg px-8 py-4">
              ابدأ دلوقتي
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h4 className="text-lg font-semibold mb-4 font-cairo">{brandName}</h4>
              <p className="text-gray-400">
                أفضل طعام لقططك مُصمم خصيصاً لاحتياجاتها
              </p>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4 font-cairo">الخدمات</h4>
              <ul className="space-y-2 text-gray-400">
                <li>خطط أسبوعية</li>
                <li>خطط شهرية</li>
                <li>استشارات تغذية</li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4 font-cairo">الدعم</h4>
              <ul className="space-y-2 text-gray-400">
                <li>مركز المساعدة</li>
                <li>تواصل معنا</li>
                <li>سياسة الخصوصية</li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4 font-cairo">تواصل معنا</h4>
              <div className="flex items-center space-x-2 space-x-reverse text-gray-400">
                <Phone className="h-5 w-5" />
                <span>01234567890</span>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 {brandName}. جميع الحقوق محفوظة.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}