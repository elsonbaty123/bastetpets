import { CatForm } from '@/components/cats/CatForm'

// Force dynamic rendering to avoid static generation issues with Supabase
export const dynamic = 'force-dynamic'

export default function NewCatPage() {
  return <CatForm />
}