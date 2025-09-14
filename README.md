# بستت - منصة صناديق أكل القطط

منصة ويب متكاملة لبيع صناديق طعام القطط المخصصة بناءً على احتياجات كل قطة الفردية. تم بناؤها باستخدام Next.js 14 و Supabase مع تقنيات حديثة.

## المميزات الرئيسية

### للعملاء
- ✅ تسجيل دخول آمن بالبريد الإلكتروني وكلمة المرور
- ✅ إدارة بيانات القطط الصحية والتغذوية
- ✅ حساب السعرات والكميات المطلوبة تلقائياً
- ✅ خطط اشتراك أسبوعية وشهرية
- ✅ نظام طلبات متكامل مع تتبع الحالة
- ✅ تكامل واتساب للتواصل الفوري
- ✅ رفع ومشاركة الملفات الطبية

### للإدارة
- ✅ لوحة تحكم شاملة لإدارة الطلبات
- ✅ عرض تفاصيل العملاء والقطط
- ✅ تحديث حالة الطلبات
- ✅ إرسال إشعارات واتساب تلقائية
- ✅ نظام هوية بصرية تلقائي من اللوجو
- ✅ تصدير التقارير PDF/CSV
- ✅ إدارة إعدادات النظام

## التقنيات المستخدمة

- **Frontend**: Next.js 14 (App Router) + TypeScript
- **Styling**: Tailwind CSS + shadcn/ui
- **Backend**: Supabase (PostgreSQL + Auth + Storage)
- **Authentication**: Supabase Auth
- **Database**: PostgreSQL مع Row Level Security
- **التخزين**: Supabase Storage للملفات الطبية واللوجو
- **Fonts**: Cairo و Tajawal للنصوص العربية
- **Integration**: WhatsApp Cloud API

## هيكل قاعدة البيانات

### الجداول الرئيسية

#### `profiles`
- معلومات المستخدمين الأساسية
- الاسم، البريد، الهاتف، العنوان
- نوع المستخدم (customer/admin)

#### `cats`
- بيانات القطط التفصيلية
- الوزن، العمر، الجنس، النشاط
- الحساسيات والمشاكل الصحية
- تفضيلات الطعام

#### `plans`
- خطط الاشتراك المتاحة
- Weekly/Monthly مع الأسعار

#### `orders`
- الطلبات مع حالاتها
- معلومات التوصيل والدفع

#### `order_items`
- تفاصيل كل قطة في الطلب
- حسابات السعرات والكميات
- قوائم الطعام والإضافات

#### `notifications`
- سجل الإشعارات المرسلة
- واتساب ومراسلات أخرى

#### `admin_settings`
- إعدادات النظام
- معلومات الاتصال
- إعدادات الهوية البصرية

## إعداد المشروع

### متطلبات النظام
- Node.js 18+
- npm أو yarn
- حساب Supabase
- حساب WhatsApp Business (اختياري)

### التثبيت

1. **استنساخ المشروع**
```bash
git clone <repository-url>
cd bastet-pet-app
```

2. **تثبيت الحزم**
```bash
npm install
```

3. **إعداد متغيرات البيئة**
أنشئ ملف `.env.local`:
```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Admin Configuration
ADMIN_EMAIL=admin@example.com
ADMIN_WHATSAPP_E164=+201234567890

# App Configuration
BASE_URL=http://localhost:3000
NEXT_PUBLIC_BRAND_NAME=بستت
NEXT_PUBLIC_CURRENCY=جنيه

# WhatsApp Cloud API (Optional)
WHATSAPP_CLOUD_API_TOKEN=your_whatsapp_token
WHATSAPP_PHONE_NUMBER_ID=your_phone_number_id
```

4. **إعداد قاعدة البيانات**
```bash
# تثبيت Supabase CLI
npm install -g supabase

# الاتصال بمشروعك
supabase link --project-ref your-project-ref

# تطبيق المايجريشن
supabase db push
```

5. **تشغيل المشروع محلياً**
```bash
npm run dev
```

الموقع سيكون متاح على: http://localhost:3000

## إعداد Supabase

### 1. إنشاء المشروع
1. اذهب إلى [Supabase Dashboard](https://supabase.com/dashboard)
2. أنشئ مشروع جديد
3. انتظر حتى يكتمل الإعداد

### 2. تطبيق المايجريشن
```sql
-- تشغيل الملفات في المجلد supabase/migrations بالترتيب:
-- 001_initial_schema.sql
-- 002_rls_policies.sql
-- 003_storage.sql
-- 004_seed_data.sql
```

### 3. إعداد التخزين
سيتم إنشاء bucket التالية:
- `medical_files`: للملفات الطبية (private)
- `brand_assets`: للوجو والهوية البصرية (private)

### 4. إعداد المستخدم الإداري
```sql
-- إنشاء مستخدم إداري
INSERT INTO auth.users (email, encrypted_password, email_confirmed_at, created_at, updated_at)
VALUES ('admin@example.com', crypt('password123', gen_salt('bf')), now(), now(), now());

-- إضافة الملف الشخصي للمدير
INSERT INTO profiles (id, name, email, role)
SELECT id, 'Administrator', 'admin@example.com', 'admin'
FROM auth.users WHERE email = 'admin@example.com';
```

## نشر المشروع

### نشر على Vercel

1. **رفع الكود إلى GitHub**
```bash
git add .
git commit -m "Initial commit"
git push origin main
```

2. **ربط المشروع بـ Vercel**
- اذهب إلى [Vercel Dashboard](https://vercel.com/dashboard)
- اختر "Import Project"
- اختر مستودع GitHub
- أضف متغيرات البيئة

3. **متغيرات البيئة في Vercel**
أضف جميع المتغيرات من `.env.local` مع تحديث:
```env
BASE_URL=https://your-domain.vercel.app
```

### إعداد النطاق
1. أضف نطاقك المخصص في Vercel
2. حدث `BASE_URL` في متغيرات البيئة
3. حدث إعدادات Supabase Auth للنطاق الجديد

## نظام الهوية البصرية التلقائي

### المميزات
- استخراج الألوان تلقائياً من اللوجو
- توليد سلّم ألوان متكامل
- اقتراح خطوط عربية متناسقة
- فحص التباين للنصوص (WCAG 2.1 AA)
- توليد Favicon و OG Images

### الاستخدام
1. ارفع اللوجو في `/admin/brand`
2. اضغط "توليد الثيم من اللوجو"
3. عاين النتائج في `/admin/brand/preview`
4. عدّل يدوياً حسب الحاجة
5. احفظ الإعدادات

## حسابات التغذية

### المعادلات المستخدمة
```
RER = 70 × (وزن القطة بالكيلو)^0.75
MER = RER × معامل النشاط × معامل التعقيم × معامل العمر
```

### معاملات النشاط
- منخفض: 1.2
- طبيعي: 1.4
- عالي: 1.6

### تعديلات خاصة
- القطط المخصية: تقليل 10%
- القطط الصغيرة: زيادة 1.8-2.5x
- القطط كبيرة السن: تقليل 5%
- زيادة/نقص الوزن: تعديل حسب الحالة

## تكامل واتساب

### WhatsApp Cloud API
```javascript
// إرسال رسالة
const response = await fetch(`https://graph.facebook.com/v17.0/${phoneNumberId}/messages`, {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${accessToken}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    messaging_product: 'whatsapp',
    to: phoneNumber,
    type: 'text',
    text: { body: message }
  })
});
```

### Click-to-Chat Fallback
```
https://wa.me/201234567890?text=رسالة مُعبأة مسبقاً
```

## اختبار الوظائف

### اختبارات الوحدة
```bash
npm run test
```

### اختبارات التغذية
```javascript
// اختبار حساب السعرات
test('calorie calculation for adult cat', () => {
  const catData = {
    weight_kg: 4,
    age_months: 24,
    activity_level: 'normal',
    neutered: true,
    body_condition_score: 5
  };
  
  const result = calculateDailyRequirements(catData);
  expect(result.daily_calories).toBeGreaterThan(200);
  expect(result.daily_calories).toBeLessThan(400);
});
```

## الأمان والخصوصية

### Row Level Security (RLS)
- كل جدول محمي بـ RLS
- المستخدمون يرون بياناتهم فقط
- الإدارة لها صلاحيات كاملة

### التخزين الآمن
- الملفات الطبية مرتبطة بالمالك
- اللوجو والأصول للإدارة فقط
- URLs موقتة للوصول الآمن

### التحقق من البيانات
```typescript
// مثال باستخدام Zod
const catSchema = z.object({
  name: z.string().min(1, 'اسم القطة مطلوب'),
  weight_kg: z.number().min(0.1).max(15),
  age_months: z.number().min(1).max(300)
});
```

## استكشاف الأخطاء

### مشاكل شائعة

#### خطأ في الاتصال بـ Supabase
```bash
# تحقق من المتغيرات
echo $NEXT_PUBLIC_SUPABASE_URL
echo $NEXT_PUBLIC_SUPABASE_ANON_KEY
```

#### مشاكل RLS
```sql
-- فحص السياسات
SELECT * FROM pg_policies WHERE tablename = 'cats';

-- فحص الدور الحالي
SELECT auth.role();
SELECT auth.uid();
```

#### مشاكل التخزين
```javascript
// فحص صلاحيات التخزين
const { data, error } = await supabase.storage
  .from('medical_files')
  .list('test-folder');
```

## المساهمة

### هيكل المشروع
```
src/
├── app/                 # App Router pages
├── components/         # React components
├── lib/               # Utilities & configs
├── types/             # TypeScript types
└── styles/            # Global styles

supabase/
├── migrations/        # Database migrations
└── config.toml       # Supabase config
```

### معايير الكود
- TypeScript strict mode
- ESLint + Prettier
- معايير التسمية العربية للواجهات
- تعليقات شاملة للوظائف المعقدة

## الدعم الفني

### معلومات التواصل
- **البريد الإلكتروني**: support@bastet.com
- **واتساب**: +201234567890
- **الموقع**: https://bastet.vercel.app

### الموارد المفيدة
- [Supabase Docs](https://supabase.com/docs)
- [Next.js Docs](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [shadcn/ui](https://ui.shadcn.com/)

## الترخيص

هذا المشروع مرخص تحت رخصة MIT. راجع ملف `LICENSE` للتفاصيل.

---

**ملاحظة**: هذا مشروع تعليمي وتجريبي. تأكد من مراجعة جميع الإعدادات الأمنية قبل الاستخدام في بيئة الإنتاج.