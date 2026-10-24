import { Link, useNavigate } from 'react-router-dom'
import {
  ClipboardList, Search, Shield, Users, Zap,
  ArrowRight, Bell, ChevronRight
} from 'lucide-react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

export default function LandingPage() {
  const navigate = useNavigate()

  return (
    <div style={{ minHeight: '100vh', background: 'white' }}>
      <Navbar />

      {/* HERO */}
      <section style={{ background: 'linear-gradient(160deg, #0a1628 0%, #0f2044 55%, #1e3a5f 100%)', padding: '96px 24px 80px', textAlign: 'center' }}>
        <div style={{ maxWidth: 760, margin: '0 auto' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: 'rgba(96,165,250,0.12)', border: '1px solid rgba(96,165,250,0.25)',
            borderRadius: 8, padding: '5px 14px', marginBottom: 28,
          }}>
            <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#22c55e', display: 'inline-block' }} />
            <span style={{ color: '#93c5fd', fontSize: 13, fontWeight: 500 }}>Campus Issue Management Platform</span>
          </div>
          <h1 style={{ color: 'white', fontSize: 'clamp(32px, 5vw, 52px)', fontWeight: 800, lineHeight: 1.15, letterSpacing: '-0.03em', marginBottom: 20 }}>
            Report campus issues.<br />
            Track progress.<br />
            <span style={{ color: '#60a5fa' }}>Get them resolved.</span>
          </h1>
          <p style={{ color: '#94a3b8', fontSize: 18, lineHeight: 1.7, marginBottom: 36, maxWidth: 560, margin: '0 auto 36px' }}>
            CampusFix AI connects students and faculty with maintenance staff and administrators, turning scattered issue reports into coordinated, trackable resolutions.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <button
              onClick={() => navigate('/register')}
              style={heroPrimaryBtn}
              onMouseEnter={e => e.currentTarget.style.background = '#1d4ed8'}
              onMouseLeave={e => e.currentTarget.style.background = '#2563eb'}
            >
              Get Started <ArrowRight size={16} />
            </button>
            <button
              onClick={() => navigate('/login')}
              style={heroSecondaryBtn}
            >
              Sign In
            </button>
          </div>
          <p style={{ color: '#475569', fontSize: 12, marginTop: 16 }}>
            Demo credentials: student@campus.edu / faculty@campus.edu / staff@campus.edu / admin@campus.edu (any password)
          </p>
        </div>
      </section>

      {/* PRODUCT PREVIEW */}
      <section style={{ background: '#f8fafc', padding: '72px 24px' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 40 }}>
            <h2 style={sectionTitle}>A unified view for every role</h2>
            <p style={sectionSubtitle}>From first report to final resolution: everything visible, nothing lost.</p>
          </div>
          <div style={{
            background: '#0f2044', borderRadius: 16, overflow: 'hidden',
            border: '1px solid rgba(255,255,255,0.08)',
            boxShadow: '0 24px 64px rgba(0,0,0,0.25)',
          }}>
            {/* Fake browser chrome */}
            <div style={{ background: '#0a1628', padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 8, borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
              <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#ef4444' }} />
              <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#eab308' }} />
              <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#22c55e' }} />
              <div style={{ flex: 1, background: 'rgba(255,255,255,0.06)', borderRadius: 6, padding: '4px 12px', marginLeft: 8, fontSize: 12, color: '#64748b' }}>campusfix.ai/student</div>
            </div>
            {/* Dashboard preview */}
            <div style={{ padding: '24px 20px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 10, marginBottom: 16 }}>
                {[['Total Issues', '5', '#2563eb'], ['In Progress', '2', '#f97316'], ['Resolved', '1', '#22c55e'], ['Open', '2', '#eab308']].map(([label, val, col]) => (
                  <div key={label} style={{ background: 'rgba(255,255,255,0.05)', borderRadius: 10, padding: '14px 16px', border: '1px solid rgba(255,255,255,0.06)' }}>
                    <div style={{ fontSize: 22, fontWeight: 700, color: col as string }}>{val}</div>
                    <div style={{ fontSize: 12, color: '#64748b', marginTop: 2 }}>{label}</div>
                  </div>
                ))}
              </div>
              <div style={{ background: 'rgba(255,255,255,0.04)', borderRadius: 10, padding: '12px 16px', border: '1px solid rgba(255,255,255,0.06)' }}>
                {[
                  { id: 'ISS-001', title: 'Leaking faucet in men\'s restroom', status: 'In Progress', priority: 'High' },
                  { id: 'ISS-002', title: 'Projector not working in Room 204', status: 'Open', priority: 'Medium' },
                  { id: 'ISS-004', title: 'HVAC not cooling Lecture Hall A', status: 'Resolved', priority: 'Critical' },
                ].map(issue => (
                  <div key={issue.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.04)', fontSize: 12, color: '#94a3b8' }}>
                    <span style={{ color: '#60a5fa', fontWeight: 600, marginRight: 12, flexShrink: 0 }}>{issue.id}</span>
                    <span style={{ flex: 1, color: '#cbd5e1' }}>{issue.title}</span>
                    <span style={{ color: '#64748b', marginLeft: 12 }}>{issue.priority}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section style={{ padding: '72px 24px', background: 'white' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <h2 style={sectionTitle}>Built for every stakeholder</h2>
            <p style={sectionSubtitle}>CampusFix AI gives each role exactly what they need.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
            {features.map(f => (
              <div key={f.title} style={{
                padding: 24, borderRadius: 12, border: '1px solid #e2e8f0',
                background: 'white', transition: 'box-shadow 0.2s',
              }}
                onMouseEnter={e => e.currentTarget.style.boxShadow = '0 4px 20px rgba(37,99,235,0.1)'}
                onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}
              >
                <div style={{
                  width: 44, height: 44, borderRadius: 10, background: '#eff6ff',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14, color: '#2563eb',
                }}>
                  {f.icon}
                </div>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: '#0f172a', marginBottom: 8 }}>{f.title}</h3>
                <p style={{ fontSize: 14, color: '#64748b', lineHeight: 1.6 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section style={{ padding: '72px 24px', background: '#f8fafc' }}>
        <div style={{ maxWidth: 900, margin: '0 auto', textAlign: 'center' }}>
          <h2 style={sectionTitle}>How it works</h2>
          <p style={{ ...sectionSubtitle, marginBottom: 48 }}>Three steps from report to resolution.</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 24 }}>
            {steps.map((step, i) => (
              <div key={step.title} style={{ position: 'relative' }}>
                <div style={{
                  width: 44, height: 44, borderRadius: '50%', background: '#1e3a5f',
                  color: 'white', fontSize: 18, fontWeight: 700,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px',
                }}>
                  {i + 1}
                </div>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: '#0f172a', marginBottom: 8 }}>{step.title}</h3>
                <p style={{ fontSize: 14, color: '#64748b', lineHeight: 1.6 }}>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '72px 24px', background: '#0f2044', textAlign: 'center' }}>
        <h2 style={{ color: 'white', fontSize: 'clamp(24px,4vw,36px)', fontWeight: 800, marginBottom: 16, letterSpacing: '-0.02em' }}>
          Ready to fix your campus?
        </h2>
        <p style={{ color: '#94a3b8', fontSize: 16, marginBottom: 32, maxWidth: 480, margin: '0 auto 32px' }}>
          Create your account and start reporting issues in under two minutes.
        </p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/register" style={{ ...heroPrimaryBtn, textDecoration: 'none' }}>
            Create Account <ChevronRight size={16} />
          </Link>
          <Link to="/login" style={{ ...heroSecondaryBtn, textDecoration: 'none' }}>
            Sign In
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  )
}

const sectionTitle: React.CSSProperties = { fontSize: 'clamp(22px,3.5vw,32px)', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em', marginBottom: 12 }
const sectionSubtitle: React.CSSProperties = { fontSize: 16, color: '#64748b', lineHeight: 1.7, maxWidth: 520, margin: '0 auto' }
const heroPrimaryBtn: React.CSSProperties = {
  display: 'inline-flex', alignItems: 'center', gap: 8,
  background: '#2563eb', color: 'white', border: 'none',
  padding: '12px 24px', borderRadius: 9, fontWeight: 700, fontSize: 15,
  cursor: 'pointer', transition: 'background 0.15s', fontFamily: 'inherit',
}
const heroSecondaryBtn: React.CSSProperties = {
  display: 'inline-flex', alignItems: 'center', gap: 8,
  background: 'rgba(255,255,255,0.08)', color: 'white',
  border: '1px solid rgba(255,255,255,0.15)',
  padding: '12px 24px', borderRadius: 9, fontWeight: 600, fontSize: 15,
  cursor: 'pointer', fontFamily: 'inherit',
}

const features = [
  { icon: <ClipboardList size={20} />, title: 'Structured Issue Reporting', desc: 'Students and faculty submit detailed reports with category, building, location, and optional photos.' },
  { icon: <Bell size={20} />, title: 'Assignment & Tracking', desc: 'Administrators assign issues to the right maintenance staff and track progress through real-time status updates.' },
  { icon: <Users size={20} />, title: 'Role-Based Dashboards', desc: 'Each role gets a tailored view: students see their reports, staff see their queue, admins see the full picture.' },
  { icon: <Search size={20} />, title: 'Search & Filters', desc: 'Find any issue by keyword, status, category, building, or priority instantly.' },
  { icon: <Shield size={20} />, title: 'Accountability & Audit Trail', desc: 'Every status change, assignment, and comment is timestamped and attributed for full accountability.' },
  { icon: <Zap size={20} />, title: 'Priority Management', desc: 'Critical safety issues are flagged for immediate attention. Priority levels ensure the right response speed.' },
]

const steps = [
  { title: 'Report the Issue', desc: 'Submit a structured report with title, category, location, description, and an optional photo.' },
  { title: 'Assign & Prioritize', desc: 'An administrator reviews the report, sets priority, and assigns it to the appropriate maintenance staff.' },
  { title: 'Resolve & Close', desc: 'Staff work on the issue and update status. The reporter is kept informed through the activity timeline.' },
]
