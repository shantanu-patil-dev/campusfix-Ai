import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Building2, ArrowLeft, Mail } from 'lucide-react'
import { Input, Button, Alert } from '../components/ui'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(ev: React.FormEvent) {
    ev.preventDefault()
    if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) {
      setError('Please enter a valid email address.')
      return
    }
    setLoading(true)
    // Simulated delay - no real email in this prototype
    await new Promise(r => setTimeout(r, 1200))
    setLoading(false)
    setSubmitted(true)
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div style={{ width: '100%', maxWidth: 420 }}>
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 10, textDecoration: 'none', marginBottom: 20 }}>
            <div style={{ background: '#1e3a5f', borderRadius: 10, width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Building2 size={20} color="white" />
            </div>
            <span style={{ color: '#0f2044', fontWeight: 800, fontSize: 19 }}>CampusFix <span style={{ color: '#2563eb' }}>AI</span></span>
          </Link>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: '#0f172a', marginBottom: 6 }}>Reset your password</h1>
          <p style={{ fontSize: 14, color: '#64748b' }}>We'll send reset instructions to your email.</p>
        </div>

        <div style={{ background: 'white', borderRadius: 14, border: '1px solid #e2e8f0', padding: 30, boxShadow: '0 2px 12px rgba(0,0,0,0.05)' }}>
          {!submitted ? (
            <>
              {error && <div style={{ marginBottom: 16 }}><Alert type="error">{error}</Alert></div>}
              <div style={{ marginBottom: 16 }}>
                <Alert type="info">
                  This is a prototype. Password reset emails are not sent - this form demonstrates the UI flow only.
                </Alert>
              </div>
              <form onSubmit={handleSubmit} noValidate style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <Input id="forgot-email" label="Email address" type="email" placeholder="you@campus.edu"
                  value={email} onChange={e => { setEmail(e.target.value); setError('') }} autoComplete="email" />
                <Button type="submit" variant="primary" loading={loading} style={{ width: '100%' }}>
                  <Mail size={15} /> Send Reset Instructions
                </Button>
              </form>
            </>
          ) : (
            <div style={{ textAlign: 'center', padding: '8px 0' }}>
              <div style={{ width: 48, height: 48, borderRadius: '50%', background: '#dcfce7', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                <Mail size={22} color="#15803d" />
              </div>
              <h2 style={{ fontSize: 17, fontWeight: 700, color: '#0f172a', marginBottom: 8 }}>Instructions sent</h2>
              <p style={{ fontSize: 14, color: '#64748b', lineHeight: 1.6 }}>
                If an account exists for <strong>{email}</strong>, you will receive password reset instructions shortly.
              </p>
              <p style={{ fontSize: 12, color: '#94a3b8', marginTop: 12 }}>
                (Prototype: no email is actually sent.)
              </p>
            </div>
          )}
        </div>

        <div style={{ textAlign: 'center', marginTop: 18 }}>
          <Link to="/login" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: '#64748b', textDecoration: 'none', fontSize: 14, fontWeight: 500 }}>
            <ArrowLeft size={14} /> Back to Sign In
          </Link>
        </div>
      </div>
    </div>
  )
}
