import { SignUpForm } from '@/components/auth/SignUpForm'
import Link from 'next/link'

// Force dynamic rendering to avoid static generation issues with Supabase
export const dynamic = 'force-dynamic'

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-8">
      <div className="max-w-md w-full space-y-8 p-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-brand">
            {process.env.NEXT_PUBLIC_BRAND_NAME || 'بستت'}
          </h1>
          <p className="mt-2 text-gray-600">
            متجر صناديق أكل القطط الشهرية
          </p>
        </div>
        
        <SignUpForm />
        
        <div className="text-center">
          <p className="text-sm text-gray-600">
            لديك حساب بالفعل؟{' '}
            <Link
              href="/auth/sign-in"
              className="font-medium text-brand hover:underline"
            >
              تسجيل الدخول
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}