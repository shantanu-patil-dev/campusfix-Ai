import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Building2, Eye, EyeOff } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { Input, Button, Alert } from '../components/ui'

export default function LoginPage() {
  const { login } = useApp()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({})

  function validate() {
    const e: typeof errors = {}
    if (!email.trim()) e.email = 'Email is required.'
    else if (!/\S+@\S+\.\S+/.test(email)) e.email = 'Enter a valid email address.'
    if (!password) e.password = 'Password is required.'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  async function handleSubmit(ev: React.FormEvent) {
    ev.preventDefault()
    if (!validate()) return
    setLoading(true); setError('')
    const result = await login(email, password)
    setLoading(false)
    if (result.success) navigate('/dashboard')
    else setError(result.error || 'Login failed.')
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', display: 'flex', flexDirection: 'column' }}>
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
        <div style={{ width: '100%', maxWidth: 420 }}>
          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 10, textDecoration: 'none', marginBottom: 24 }}>
              <div style={{ background: '#1e3a5f', borderRadius: 10, width: 42, height: 42, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Building2 size={22} color="white" />
              </div>
              <span style={{ color: '#0f2044', fontWeight: 800, fontSize: 20 }}>CampusFix <span style={{ color: '#2563eb' }}>AI</span></span>
            </Link>
            <h1 style={{ fontSize: 24, fontWeight: 800, color: '#0f172a', marginBottom: 6 }}>Sign in to your account</h1>
            <p style={{ fontSize: 14, color: '#64748b' }}>Enter your campus credentials to continue.</p>
          </div>

          <div style={{ background: 'white', borderRadius: 14, border: '1px solid #e2e8f0', padding: 32, boxShadow: '0 2px 12px rgba(0,0,0,0.05)' }}>
            {error && <div style={{ marginBottom: 20 }}><Alert type="error">{error}</Alert></div>}
            <form onSubmit={handleSubmit} noValidate style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
              <Input
                id="login-email" label="Email address" type="email" placeholder="you@campus.edu"
                value={email} onChange={e => setEmail(e.target.value)} error={errors.email}
                autoComplete="email"
              />
              <div>
                <div style={{ position: 'relative' }}>
                  <Input
                    id="login-password" label="Password" type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password" value={password}
                    onChange={e => setPassword(e.target.value)} error={errors.password}
                    autoComplete="current-password"
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)}
                    style={{ position: 'absolute', right: 12, top: 34, background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', padding: 0 }}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                <div style={{ textAlign: 'right', marginTop: 6 }}>
                  <Link to="/forgot-password" style={{ fontSize: 13, color: '#2563eb', textDecoration: 'none', fontWeight: 500 }}>
                    Forgot password?
                  </Link>
                </div>
              </div>
              <Button type="submit" variant="primary" size="lg" loading={loading} style={{ width: '100%', marginTop: 4 }}>
                Sign In
              </Button>
            </form>
          </div>

          <p style={{ textAlign: 'center', fontSize: 14, color: '#64748b', marginTop: 20 }}>
            Don't have an account?{' '}
            <Link to="/register" style={{ color: '#2563eb', fontWeight: 600, textDecoration: 'none' }}>Create one</Link>
          </p>

          <div style={{ marginTop: 24, padding: 16, background: '#eff6ff', borderRadius: 10, border: '1px solid #bfdbfe' }}>
            <p style={{ fontSize: 12, color: '#1d4ed8', fontWeight: 600, marginBottom: 8 }}>Demo Accounts (any password):</p>
            {[
              ['student@campus.edu', 'Student'],
              ['faculty@campus.edu', 'Faculty'],
              ['staff@campus.edu', 'Maintenance Staff'],
              ['admin@campus.edu', 'Administrator'],
            ].map(([em, role]) => (
              <div key={em} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 4 }}>
                <button
                  type="button"
                  onClick={() => { setEmail(em); setPassword('demo'); setErrors({}) }}
                  style={{ color: '#1d4ed8', background: 'none', border: 'none', cursor: 'pointer', fontSize: 12, padding: 0, textDecoration: 'underline', fontFamily: 'inherit' }}
                >
                  {em}
                </button>
                <span style={{ color: '#3b82f6' }}>{role}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
