import { SignInForm } from '@/components/auth/SignInForm'
import Link from 'next/link'

export default function SignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-brand">
            {process.env.NEXT_PUBLIC_BRAND_NAME || 'بستت'}
          </h1>
          <p className="mt-2 text-gray-600">
            متجر صناديق أكل القطط الشهرية
          </p>
        </div>
        
        <SignInForm />
        
        <div className="text-center">
          <p className="text-sm text-gray-600">
            ليس لديك حساب؟{' '}
            <Link
              href="/auth/sign-up"
              className="font-medium text-brand hover:underline"
            >
              إنشاء حساب جديد
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}