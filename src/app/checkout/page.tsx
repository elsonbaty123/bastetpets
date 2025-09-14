import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import CheckoutForm from '@/components/checkout/CheckoutForm'

export default async function CheckoutPage({
  searchParams,
}: {
  searchParams: Promise<{ plan?: string }>
}) {
  const resolvedSearchParams = await searchParams
  const supabase = await createClient()
  
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/sign-in')
  }

  if (!resolvedSearchParams.plan) {
    redirect('/plans')
  }

  // Get selected plan
  const { data: plan } = await supabase
    .from('plans')
    .select('*')
    .eq('id', resolvedSearchParams.plan)
    .eq('is_active', true)
    .single()

  if (!plan) {
    redirect('/plans')
  }

  // Get user profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  // Get user's cats
  const { data: cats } = await supabase
    .from('cats')
    .select('*')
    .eq('user_id', user.id)

  if (!cats || cats.length === 0) {
    redirect('/cats/new')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-2xl font-bold text-brand font-cairo">إتمام الطلب</h1>
          </div>
        </div>
      </header>

      <CheckoutForm 
        plan={plan}
        profile={profile}
        cats={cats}
      />
    </div>
  )
}