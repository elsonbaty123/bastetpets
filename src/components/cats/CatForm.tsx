'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'

interface CatFormData {
  name: string
  sex: 'male' | 'female' | ''
  age_months: number
  weight_kg: number
  breed: string
  neutered: boolean
  activity_level: 'low' | 'normal' | 'high' | ''
  body_condition_score: number
  allergies: string[]
  health_issues: string[]
  food_preferences: {
    wet: boolean
    dry: boolean
    raw: boolean
  }
  disliked_ingredients: string[]
  feeding_times_per_day: number
  notes: string
}

const initialFormData: CatFormData = {
  name: '',
  sex: '',
  age_months: 12,
  weight_kg: 4,
  breed: '',
  neutered: false,
  activity_level: 'normal',
  body_condition_score: 5,
  allergies: [],
  health_issues: [],
  food_preferences: {
    wet: true,
    dry: true,
    raw: false
  },
  disliked_ingredients: [],
  feeding_times_per_day: 2,
  notes: ''
}

const commonBreeds = [
  'شيرازي', 'سيامي', 'مين كون', 'بريتيش شورت هير', 'روسي أزرق', 'مصري ماو', 
  'فارسي', 'راجدول', 'أبيسينيان', 'بنغالي', 'مختلط', 'غير محدد'
]

export function CatForm() {
  const [formData, setFormData] = useState<CatFormData>(initialFormData)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    if (!formData.name || !formData.sex || formData.age_months < 1 || formData.weight_kg <= 0) {
      setError('يرجى ملء جميع الحقول المطلوبة بشكل صحيح')
      setLoading(false)
      return
    }

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        setError('يجب تسجيل الدخول أولاً')
        setLoading(false)
        return
      }

      const catData = {
        user_id: user.id,
        name: formData.name,
        sex: formData.sex as 'male' | 'female',
        age_months: formData.age_months,
        weight_kg: formData.weight_kg,
        breed: formData.breed || null,
        neutered: formData.neutered,
        activity_level: formData.activity_level as 'low' | 'normal' | 'high',
        body_condition_score: formData.body_condition_score,
        allergies: formData.allergies,
        health_issues: formData.health_issues,
        food_preferences: formData.food_preferences,
        disliked_ingredients: formData.disliked_ingredients,
        feeding_times_per_day: formData.feeding_times_per_day,
        notes: formData.notes || null,
      }

      const { error: saveError } = await supabase
        .from('cats')
        .insert([catData])

      if (saveError) {
        console.error('Save error:', saveError)
        setError('حدث خطأ في حفظ بيانات القطة')
        return
      }

      router.push('/cats')
      router.refresh()
    } catch (err) {
      console.error('Form error:', err)
      setError('حدث خطأ غير متوقع')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-cairo">إضافة قطة جديدة</h1>
        <p className="text-gray-600 mt-2">
          املأ البيانات للحصول على خطة غذائية مخصصة لقطتك
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle className="font-cairo">المعلومات الأساسية</CardTitle>
            <CardDescription>
              البيانات الأساسية لقطتك
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">اسم القطة *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sex">الجنس *</Label>
                <Select onValueChange={(value: 'male' | 'female') => setFormData(prev => ({ ...prev, sex: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="اختر الجنس" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">ذكر</SelectItem>
                    <SelectItem value="female">أنثى</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="age">العمر (شهر) *</Label>
                <Input
                  id="age"
                  type="number"
                  min="1"
                  max="300"
                  value={formData.age_months}
                  onChange={(e) => setFormData(prev => ({ ...prev, age_months: parseInt(e.target.value) || 0 }))}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="weight">الوزن (كجم) *</Label>
                <Input
                  id="weight"
                  type="number"
                  min="0.1"
                  max="15"
                  step="0.1"
                  value={formData.weight_kg}
                  onChange={(e) => setFormData(prev => ({ ...prev, weight_kg: parseFloat(e.target.value) || 0 }))}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="breed">السلالة</Label>
                <Select onValueChange={(value) => setFormData(prev => ({ ...prev, breed: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="اختر السلالة" />
                  </SelectTrigger>
                  <SelectContent>
                    {commonBreeds.map((breed) => (
                      <SelectItem key={breed} value={breed}>
                        {breed}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Health Information */}
        <Card>
          <CardHeader>
            <CardTitle className="font-cairo">المعلومات الصحية</CardTitle>
            <CardDescription>
              معلومات صحية مهمة لتخصيص الوجبات
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="activity">مستوى النشاط</Label>
                <Select onValueChange={(value: 'low' | 'normal' | 'high') => setFormData(prev => ({ ...prev, activity_level: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="اختر مستوى النشاط" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">منخفض</SelectItem>
                    <SelectItem value="normal">طبيعي</SelectItem>
                    <SelectItem value="high">عالي</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="bcs">درجة الحالة الجسدية (1-9)</Label>
                <Input
                  id="bcs"
                  type="number"
                  min="1"
                  max="9"
                  value={formData.body_condition_score}
                  onChange={(e) => setFormData(prev => ({ ...prev, body_condition_score: parseInt(e.target.value) || 5 }))}
                />
              </div>
            </div>

            <div className="flex items-center space-x-2 space-x-reverse">
              <Checkbox
                id="neutered"
                checked={formData.neutered}
                onCheckedChange={(checked: boolean) => setFormData(prev => ({ ...prev, neutered: !!checked }))}
              />
              <Label htmlFor="neutered">مخصي/معقم</Label>
            </div>

            <div className="space-y-2">
              <Label htmlFor="feeding">عدد الوجبات يومياً</Label>
              <Input
                id="feeding"
                type="number"
                min="1"
                max="6"
                value={formData.feeding_times_per_day}
                onChange={(e) => setFormData(prev => ({ ...prev, feeding_times_per_day: parseInt(e.target.value) || 2 }))}
              />
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-4 space-x-reverse">
          <Button type="button" variant="outline" onClick={() => router.back()}>
            إلغاء
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? 'جاري الحفظ...' : 'حفظ بيانات القطة'}
          </Button>
        </div>

        {error && (
          <div className="text-red-500 text-sm mt-2">{error}</div>
        )}
      </form>
    </div>
  )
}