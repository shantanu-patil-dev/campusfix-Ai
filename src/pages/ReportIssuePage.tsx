import { useState, type ChangeEvent, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { Upload, X, CheckCircle } from 'lucide-react'
import { useApp, type IssueCategory } from '../context/AppContext'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { Input, Select, Textarea, Button, Alert } from '../components/ui'
import { CATEGORY_LABELS, BUILDINGS } from '../utils/helpers'

interface FormData {
  title: string
  category: IssueCategory | ''
  description: string
  building: string
  location: string
}

interface FormErrors {
  title?: string
  category?: string
  description?: string
  building?: string
  location?: string
}

export default function ReportIssuePage() {
  const { createIssue } = useApp()
  const navigate = useNavigate()
  const [form, setForm] = useState<FormData>({ title: '', category: '', description: '', building: '', location: '' })
  const [errors, setErrors] = useState<FormErrors>({})
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [newIssueId, setNewIssueId] = useState('')
  const [submitError, setSubmitError] = useState('')
  const [photoFile, setPhotoFile] = useState<File | null>(null)
  const [photoPreview, setPhotoPreview] = useState<string | null>(null)

  function set(field: keyof FormData, value: string) {
    setForm(f => ({ ...f, [field]: value }))
    if (errors[field]) setErrors(e => ({ ...e, [field]: '' }))
  }

  function handlePhotoChange(ev: ChangeEvent<HTMLInputElement>) {
    const file = ev.target.files?.[0]
    if (!file) return
    if (file.size > 5 * 1024 * 1024) { alert('File size must be under 5MB.'); return }
    setPhotoFile(file)
    const reader = new FileReader()
    reader.onload = e => setPhotoPreview(e.target?.result as string)
    reader.readAsDataURL(file)
  }

  function removePhoto() { setPhotoFile(null); setPhotoPreview(null) }

  function validate(): boolean {
    const e: FormErrors = {}
    if (!form.title.trim()) e.title = 'Issue title is required.'
    else if (form.title.trim().length < 10) e.title = 'Title must be at least 10 characters.'
    if (!form.category) e.category = 'Please select a category.'
    if (!form.description.trim()) e.description = 'Description is required.'
    else if (form.description.trim().length < 30) e.description = 'Provide at least 30 characters of detail to help staff respond effectively.'
    if (!form.building) e.building = 'Please select a building.'
    if (!form.location.trim()) e.location = 'Specific location is required (e.g. Room 204, near east stairwell).'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  async function handleSubmit(ev: FormEvent) {
    ev.preventDefault()
    if (!validate()) return
    setLoading(true); setSubmitError('')
    try {
      const issue = await createIssue({
        title: form.title.trim(),
        category: form.category as IssueCategory,
        description: form.description.trim(),
        building: form.building,
        location: form.location.trim(),
        photoUrl: photoPreview || undefined,
      })
      setNewIssueId(issue.id)
      setSubmitted(true)
    } catch {
      setSubmitError('Failed to submit the issue. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <div style={{ minHeight: '100vh', background: '#f8fafc', display: 'flex', flexDirection: 'column' }}>
        <Navbar />
        <main style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
          <div style={{ textAlign: 'center', maxWidth: 440, width: '100%', background: 'white', borderRadius: 16, border: '1px solid #e2e8f0', padding: 48, boxShadow: '0 4px 20px rgba(0,0,0,0.06)' }}>
            <div style={{ width: 64, height: 64, borderRadius: '50%', background: '#dcfce7', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
              <CheckCircle size={32} color="#15803d" />
            </div>
            <h2 style={{ fontSize: 22, fontWeight: 800, color: '#0f172a', marginBottom: 8 }}>Issue Submitted</h2>
            <p style={{ fontSize: 14, color: '#64748b', lineHeight: 1.7, marginBottom: 6 }}>
              Your issue has been recorded as <strong style={{ color: '#2563eb' }}>{newIssueId}</strong>.
            </p>
            <p style={{ fontSize: 14, color: '#64748b', lineHeight: 1.7, marginBottom: 28 }}>
              An administrator will review and assign it shortly. You can track progress from your dashboard.
            </p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Button variant="primary" onClick={() => navigate('/student')}>Go to Dashboard</Button>
              <Button variant="secondary" onClick={() => navigate(`/issues/${newIssueId}`)}>View Issue</Button>
              <Button variant="ghost" onClick={() => { setSubmitted(false); setForm({ title: '', category: '', description: '', building: '', location: '' }); setPhotoPreview(null); setPhotoFile(null) }}>
                Report Another
              </Button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      <main style={{ flex: 1, maxWidth: 720, margin: '0 auto', width: '100%', padding: '32px 24px' }}>
        <div style={{ marginBottom: 28 }}>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: '#0f172a', marginBottom: 6 }}>Report a Campus Issue</h1>
          <p style={{ fontSize: 14, color: '#64748b' }}>Fill in all required fields. Detailed reports help maintenance staff respond faster.</p>
        </div>

        {submitError && <div style={{ marginBottom: 20 }}><Alert type="error">{submitError}</Alert></div>}

        <form onSubmit={handleSubmit} noValidate>
          <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: 12, padding: 28, display: 'flex', flexDirection: 'column', gap: 22 }}>
            <Input
              id="issue-title" label="Issue title *" type="text"
              placeholder="Brief, descriptive title (e.g. 'Leaking pipe under sink in Lab 2')"
              value={form.title} onChange={e => set('title', e.target.value)}
              error={errors.title} hint="10-100 characters. Be specific."
            />

            <Select id="issue-category" label="Category *" value={form.category}
              onChange={e => set('category', e.target.value)} error={errors.category}>
              <option value="">Select a category...</option>
              {(Object.entries(CATEGORY_LABELS) as [IssueCategory, string][]).map(([val, label]) => (
                <option key={val} value={val}>{label}</option>
              ))}
            </Select>

            <Textarea
              id="issue-description" label="Description *"
              placeholder="Describe the issue in detail. Include what you observed, when it started, how it affects you, and any relevant context."
              value={form.description} onChange={e => set('description', e.target.value)}
              error={errors.description} style={{ minHeight: 130 }}
              hint="Min. 30 characters."
            />

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16 }}>
              <Select id="issue-building" label="Building *" value={form.building}
                onChange={e => set('building', e.target.value)} error={errors.building}>
                <option value="">Select building...</option>
                {BUILDINGS.map(b => <option key={b} value={b}>{b}</option>)}
              </Select>
              <Input id="issue-location" label="Specific location *" type="text"
                placeholder="e.g. Room 204, 2nd floor near elevator"
                value={form.location} onChange={e => set('location', e.target.value)}
                error={errors.location} hint="Be as specific as possible."
              />
            </div>

            {/* Photo upload */}
            <div>
              <label style={{ fontSize: 13, fontWeight: 600, color: '#334155', display: 'block', marginBottom: 8 }}>
                Photo (optional)
              </label>
              {!photoPreview ? (
                <label htmlFor="photo-upload" style={{
                  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                  padding: '24px 16px', border: '2px dashed #e2e8f0', borderRadius: 10,
                  cursor: 'pointer', transition: 'border-color 0.15s', gap: 8,
                }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = '#3b82f6'}
                  onMouseLeave={e => e.currentTarget.style.borderColor = '#e2e8f0'}
                >
                  <Upload size={22} color="#94a3b8" />
                  <span style={{ fontSize: 14, color: '#64748b' }}>Click to upload a photo</span>
                  <span style={{ fontSize: 12, color: '#94a3b8' }}>JPG, PNG or GIF - max 5 MB</span>
                  <input id="photo-upload" type="file" accept="image/*" style={{ display: 'none' }} onChange={handlePhotoChange} />
                </label>
              ) : (
                <div style={{ position: 'relative', display: 'inline-block' }}>
                  <img src={photoPreview} alt="Issue preview" style={{ maxWidth: '100%', maxHeight: 200, borderRadius: 8, border: '1px solid #e2e8f0', objectFit: 'cover' }} />
                  <button type="button" onClick={removePhoto} style={{
                    position: 'absolute', top: 8, right: 8, background: 'rgba(0,0,0,0.6)',
                    border: 'none', borderRadius: '50%', width: 26, height: 26,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
                  }} aria-label="Remove photo">
                    <X size={14} color="white" />
                  </button>
                  <div style={{ fontSize: 12, color: '#64748b', marginTop: 6 }}>{photoFile?.name}</div>
                </div>
              )}
            </div>

            <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', paddingTop: 4, flexWrap: 'wrap' }}>
              <Button type="button" variant="secondary" onClick={() => navigate(-1)}>Cancel</Button>
              <Button type="submit" variant="primary" size="lg" loading={loading}>
                Submit Issue Report
              </Button>
            </div>
          </div>
        </form>
      </main>
      <Footer />
    </div>
  )
}
