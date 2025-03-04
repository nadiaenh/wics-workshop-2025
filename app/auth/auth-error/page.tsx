import Link from 'next/link'

export default function AuthErrorPage() {
  return (
    <div className="text-center">
      <h3 className="text-xl font-semibold mb-4">Authentication Error</h3>
      <p className="text-gray-600 mb-4">
        There was an error processing your authentication request.
        <br />
        Please try again.
      </p>
      <Link
        href="/auth/login"
        className="text-blue-500 hover:underline"
      >
        Return to login
      </Link>
    </div>
  )
} 