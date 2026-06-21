import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import authBg from '../../assets/auth-bg.jpeg'
import { useState, useEffect } from 'react'

export default function Login() {
  const [email, setEmail]     = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [remember, setRemember] = useState(false)
  const [error, setError]     = useState('')
  const [loading, setLoading] = useState(false)

  const { login } = useAuth()
  const navigate  = useNavigate()


  useEffect(() => {
  const bannedMsg = localStorage.getItem('bannedMessage')
  if (bannedMsg) {
    setError(bannedMsg)
    localStorage.removeItem('bannedMessage')
  }
}, [])
 const handleSubmit = async (e) => {
  e.preventDefault()
  setError('')
  setLoading(true)
  try {
    const user = await login(email, password)
    if (user.role === 'admin')        navigate('/admin/dashboard')
    else if (user.role === 'brand')   navigate('/brand/dashboard')
    else                              navigate('/creator/dashboard')
  } catch (err) {
    const data = err.response?.data
    // ✅ Email verify nahi hua
    if (data?.needsVerification) {
      navigate('/verify-email', { state: { userId: data.userId } })
      return
    }
    setError(data?.message || 'Login failed.')
  } finally {
    setLoading(false)
  }
}

  return (
    <div className="min-h-screen flex">
      {/* LEFT SIDE */}
      <div
        className="hidden lg:flex w-1/2 relative flex-col justify-between p-10"
        style={{ backgroundImage: `url(${authBg})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
      >
        <div className="absolute inset-0 bg-primary/60" />
        <div className="relative z-10">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center">
              <span className="text-primary font-black text-lg">T</span>
            </div>
            <span className="text-white font-black text-xl tracking-wide">TRENDORA</span>
          </div>
        </div>
        <div className="relative z-10">
          <h2 className="text-4xl font-black text-white leading-tight mb-4">
            Create.<br />Connect.<br />
            <span className="text-purple-200">Grow.</span>
          </h2>
          <p className="text-purple-100 text-sm leading-relaxed max-w-xs">
            The all-in-one platform to connect brands with top creators and grow together.
          </p>
        </div>
        <div className="relative z-10 flex gap-2">
          {[...Array(5)].map((_, i) => (
            <div key={i} className={`h-1.5 rounded-full bg-white ${i === 0 ? 'w-6' : 'w-1.5'} opacity-60`} />
          ))}
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-12 bg-purple-50">
        <div className="w-full max-w-md">

          {/* Mobile Logo */}
          <div className="flex lg:hidden items-center gap-2 mb-8 justify-center">
            <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center">
              <span className="text-white font-black text-base">T</span>
            </div>
            <span className="text-primary font-black text-xl">TRENDORA</span>
          </div>

          <div className="bg-white rounded-3xl shadow-purple p-8 md:p-10">
            <div className="text-center mb-8">
              <h1 className="text-2xl font-black text-secondary mb-1">Welcome Back</h1>
              <p className="text-sm text-muted">Login to continue to your Trendora account</p>
            </div>

            {/* Error */}
            {error && (
              <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-secondary mb-1.5">Email</label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted">✉️</span>
                  <input
                    type="email" required placeholder="Enter your email"
                    value={email} onChange={e => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 text-sm border border-border rounded-xl focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary-light bg-surface"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-secondary mb-1.5">Password</label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted">🔒</span>
                  <input
                    type={showPass ? 'text' : 'password'} required placeholder="Enter your password"
                    value={password} onChange={e => setPassword(e.target.value)}
                    className="w-full pl-10 pr-12 py-3 text-sm border border-border rounded-xl focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary-light bg-surface"
                  />
                  <button type="button" onClick={() => setShowPass(!showPass)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted hover:text-primary text-sm">
                    {showPass ? '🙈' : '👁️'}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={remember}
                    onChange={e => setRemember(e.target.checked)}
                    className="w-4 h-4 accent-primary" />
                  <span className="text-sm text-muted">Remember me</span>
                </label>
                <Link to="/forgot-password" className="text-sm font-semibold text-primary hover:text-primary-dark">
                  Forgot Password?
                </Link>
              </div>

              <button
                type="submit" disabled={loading}
                className="w-full py-3.5 bg-primary hover:bg-primary-dark text-white font-bold rounded-xl transition-colors shadow-purple text-sm disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? 'Logging in...' : 'Login'}
              </button>

              <p className="text-center text-sm text-muted">
                Don't have an account?{' '}
                <Link to="/signup" className="text-primary font-bold hover:text-primary-dark">Sign Up</Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}