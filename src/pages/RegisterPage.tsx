import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Building2, Eye, EyeOff } from 'lucide-react'
import { useApp, type Role } from '../context/AppContext'
import { Input, Button, Select, Alert } from '../components/ui'
import { ROLE_LABELS } from '../utils/helpers'

export default function RegisterPage() {
  const { register } = useApp()
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '', role: 'student' as Role, department: '' })
  const [showPwd, setShowPwd] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [errs, setErrs] = useState<Partial<typeof form & { confirmPassword: string }>>({})

  function set(field: keyof typeof form, value: string) {
    setForm(f => ({ ...f, [field]: value }))
    if (errs[field]) setErrs(e => ({ ...e, [field]: '' }))
  }

  function validate() {
    const e: typeof errs = {}
    if (!form.name.trim()) e.name = 'Full name is required.'
    if (!form.email.trim()) e.email = 'Email is required.'
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Enter a valid email address.'
    if (!form.password) e.password = 'Password is required.'
    else if (form.password.length < 6) e.password = 'Password must be at least 6 characters.'
    if (form.password !== form.confirmPassword) e.confirmPassword = 'Passwords do not match.'
    setErrs(e)
    return Object.keys(e).length === 0
  }

  async function handleSubmit(ev: FormEvent) {
    ev.preventDefault()
    if (!validate()) return
    setLoading(true); setError('')
    const result = await register(form)
    setLoading(false)
    if (result.success) navigate('/dashboard')
    else setError(result.error || 'Registration failed.')
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div style={{ width: '100%', maxWidth: 460 }}>
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 10, textDecoration: 'none', marginBottom: 20 }}>
            <div style={{ background: '#1e3a5f', borderRadius: 10, width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Building2 size={20} color="white" />
            </div>
            <span style={{ color: '#0f2044', fontWeight: 800, fontSize: 19 }}>CampusFix <span style={{ color: '#2563eb' }}>AI</span></span>
          </Link>
          <h1 style={{ fontSize: 23, fontWeight: 800, color: '#0f172a', marginBottom: 6 }}>Create your account</h1>
          <p style={{ fontSize: 14, color: '#64748b' }}>Join your campus on CampusFix AI.</p>
        </div>

        <div style={{ background: 'white', borderRadius: 14, border: '1px solid #e2e8f0', padding: 30, boxShadow: '0 2px 12px rgba(0,0,0,0.05)' }}>
          {error && <div style={{ marginBottom: 18 }}><Alert type="error">{error}</Alert></div>}
          <form onSubmit={handleSubmit} noValidate style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <Input id="reg-name" label="Full name" type="text" placeholder="Your full name"
              value={form.name} onChange={e => set('name', e.target.value)} error={errs.name} autoComplete="name" />
            <Input id="reg-email" label="Email address" type="email" placeholder="you@campus.edu"
              value={form.email} onChange={e => set('email', e.target.value)} error={errs.email} autoComplete="email" />
            <Select id="reg-role" label="Role" value={form.role} onChange={e => set('role', e.target.value as Role)}>
              {(Object.entries(ROLE_LABELS) as [Role, string][]).map(([val, label]) => (
                <option key={val} value={val}>{label}</option>
              ))}
            </Select>
            <Input id="reg-dept" label="Department (optional)" type="text" placeholder="e.g. Computer Science"
              value={form.department} onChange={e => set('department', e.target.value)} />
            <div style={{ position: 'relative' }}>
              <Input id="reg-password" label="Password" type={showPwd ? 'text' : 'password'} placeholder="Min. 6 characters"
                value={form.password} onChange={e => set('password', e.target.value)} error={errs.password} autoComplete="new-password" />
              <button type="button" onClick={() => setShowPwd(!showPwd)}
                style={{ position: 'absolute', right: 12, top: 34, background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', padding: 0 }}
                aria-label={showPwd ? 'Hide password' : 'Show password'}
              >
                {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            <Input id="reg-confirm" label="Confirm password" type="password" placeholder="Repeat your password"
              value={form.confirmPassword} onChange={e => set('confirmPassword', e.target.value)} error={errs.confirmPassword} autoComplete="new-password" />
            <Button type="submit" variant="primary" size="lg" loading={loading} style={{ width: '100%', marginTop: 4 }}>
              Create Account
            </Button>
          </form>
        </div>

        <p style={{ textAlign: 'center', fontSize: 14, color: '#64748b', marginTop: 18 }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: '#2563eb', fontWeight: 600, textDecoration: 'none' }}>Sign in</Link>
        </p>
        <p style={{ textAlign: 'center', fontSize: 12, color: '#94a3b8', marginTop: 12 }}>
          By creating an account, you agree to our{' '}
          <Link to="/terms" style={{ color: '#64748b' }}>Terms of Service</Link> and{' '}
          <Link to="/privacy" style={{ color: '#64748b' }}>Privacy Policy</Link>.
        </p>
      </div>
    </div>
  )
}
