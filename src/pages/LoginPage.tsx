import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'

// Simple demo credential - easy to remember!
const DEMO_USERNAME = 'demo'
const DEMO_PASSWORD = 'zscale'

export default function LoginPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    // Simulate a brief loading state
    await new Promise(resolve => setTimeout(resolve, 500))

    // Check credentials
    const isValid =
      username.toLowerCase() === DEMO_USERNAME.toLowerCase() &&
      password === DEMO_PASSWORD

    if (isValid) {
      // Store auth state in sessionStorage (clears when browser closes)
      sessionStorage.setItem('zscale_authenticated', 'true')
      navigate('/demo-login')
    } else {
      setError('Invalid username or password')
    }

    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-ink flex items-center justify-center p-6">
      <div className="max-w-md w-full">
        {/* Logo & Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-block mb-6">
            <img
              src="/images/zscale-capital-logo.png"
              alt="zScale Capital"
              className="h-14 w-auto mx-auto"
            />
          </Link>
          <h1 className="text-h3 text-white mb-2">
            Platform Access
          </h1>
          <p className="text-body text-neutral-400">
            Sign in to access the intelligence dashboards
          </p>
        </div>

        {/* Login Form */}
        <div className="card-skeuomorphic rounded-2xl p-8">
          <form onSubmit={handleLogin} className="space-y-6">
            {/* Error Message */}
            {error && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 text-center">
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}

            {/* Username Field */}
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-neutral-400 mb-2">
                Username
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter username"
                required
                autoComplete="username"
                className="w-full px-4 py-3 bg-ink-medium border border-ink-border rounded-xl text-white placeholder-neutral-600 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors"
              />
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-neutral-400 mb-2">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                required
                autoComplete="current-password"
                className="w-full px-4 py-3 bg-ink-medium border border-ink-border rounded-xl text-white placeholder-neutral-600 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-accent hover:bg-accent-hover text-ink font-semibold rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-ink border-t-transparent rounded-full animate-spin"></div>
                  <span>Signing in...</span>
                </>
              ) : (
                <span>Sign In</span>
              )}
            </button>
          </form>
        </div>

        {/* Footer Links */}
        <div className="mt-8 text-center space-y-3">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-neutral-500 hover:text-accent text-sm transition-colors"
          >
            <span>←</span>
            <span>Back to Homepage</span>
          </Link>
        </div>

        {/* Request Access */}
        <div className="mt-6 text-center">
          <p className="text-neutral-600 text-sm">
            Need access?{' '}
            <a href="mailto:hello@zscalecapital.com" className="text-accent hover:text-accent-hover transition-colors">
              Request a demo
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
