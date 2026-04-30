import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { redirect } from 'next/navigation'

async function signOut() {
  'use server'
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/login')
}

export default async function Navbar() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <nav className="border-b bg-white px-6 py-4">
      <div className="mx-auto flex items-center justify-between">
        <Link href="/" className="text-xl font-bold text-blue-600">SurveyIQ</Link>
        
        <div className="flex items-center gap-4">
          {user ? (
            <>
              <Link href="/dashboard" className="text-sm font-medium text-gray-700 hover:text-blue-600">
                Dashboard
              </Link>
              
              {/* ✅ Enhanced Upload button: primary style + icon */}
              <Link 
                href="/dashboard/upload" 
                className="flex items-center gap-1.5 rounded-md bg-blue-600 px-3.5 py-2 text-sm font-semibold text-white hover:bg-blue-500 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                  <polyline points="17 8 12 3 7 8"/>
                  <line x1="12" x2="12" y1="3" y2="15"/>
                </svg>
                Upload
              </Link>
              
              <form action={signOut}>
                <button type="submit" className="text-sm font-medium text-red-600 hover:text-red-700">
                  Logout
                </button>
              </form>
            </>
          ) : (
            <>
              {/* Optional: hint for guests to encourage sign-up */}
              <Link href="/login" className="text-sm font-medium text-gray-700 hover:text-blue-600">
                Login
              </Link>
              <Link href="/signup" className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-500">
                Sign Up to Upload
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}