'use client'

import { Button } from "@/components/ui/button"
import { createBrowserClient } from "@supabase/ssr"
import { useRouter } from "next/navigation"
import { MoonIcon, SunIcon } from "lucide-react"
import { useTheme } from "next-themes"

export default function SettingsPage() {
  const router = useRouter()
  const { theme, setTheme } = useTheme()
  
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/auth/login')
    router.refresh()
  }

  return (
    <div className="container max-w-2xl mx-auto p-6 space-y-8">
      <h1 className="text-3xl font-bold">Settings</h1>
      
      <div className="space-y-6">
        <div className="flex items-center justify-between p-4 border rounded-lg">
          <div>
            <h2 className="font-semibold">Theme</h2>
            <p className="text-sm text-gray-500">Change the appearance of the app</p>
          </div>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          >
            {theme === 'dark' ? (
              <SunIcon className="h-5 w-5" />
            ) : (
              <MoonIcon className="h-5 w-5" />
            )}
          </Button>
        </div>

        <div className="flex items-center justify-between p-4 border rounded-lg">
          <div>
            <h2 className="font-semibold">Account</h2>
            <p className="text-sm text-gray-500">Sign out of your account</p>
          </div>
          <Button
            variant="destructive"
            onClick={handleLogout}
          >
            Log out
          </Button>
        </div>
      </div>
    </div>
  )
} 