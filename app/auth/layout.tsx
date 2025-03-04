/**
 * Auth layout component that wraps all authentication pages.
 * Provides a centered, clean layout for login/signup forms.
 * 
 * Features:
 * - Responsive design
 * - Centered content
 * - Clean, minimal styling
 * 
 * @param children - The auth page content to be rendered
 */
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-bold">
            Welcome to Chat
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Sign in to start chatting with AI
          </p>
        </div>
        {children}
      </div>
    </div>
  )
} 