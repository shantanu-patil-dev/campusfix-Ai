import { Link } from 'react-router-dom'
import { Building2 } from 'lucide-react'

const CURRENT_YEAR = 2026

export default function Footer() {
  const year = CURRENT_YEAR
  return (
    <footer style={{
      background: '#0a1628',
      borderTop: '1px solid rgba(255,255,255,0.08)',
      color: '#94a3b8',
      padding: '48px 24px 32px',
    }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 40, marginBottom: 40 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
              <div style={{ background: '#2563eb', borderRadius: 8, width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Building2 size={17} color="white" />
              </div>
              <span style={{ color: 'white', fontWeight: 700, fontSize: 16 }}>
                CampusFix <span style={{ color: '#60a5fa' }}>AI</span>
              </span>
            </div>
            <p style={{ fontSize: 13, lineHeight: 1.7, maxWidth: 240 }}>
              A campus issue reporting and management platform for students, faculty, maintenance staff, and administrators.
            </p>
            <p style={{ fontSize: 12, marginTop: 12, color: '#64748b', fontStyle: 'italic' }}>
              Prototype - data is stored in-session only.
            </p>
          </div>
          <div>
            <h4 style={{ color: 'white', fontSize: 13, fontWeight: 600, marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Platform</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <FooterLink to="/login">Sign In</FooterLink>
              <FooterLink to="/register">Create Account</FooterLink>
              <FooterLink to="/report">Report an Issue</FooterLink>
            </div>
          </div>
          <div>
            <h4 style={{ color: 'white', fontSize: 13, fontWeight: 600, marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Legal</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <FooterLink to="/privacy">Privacy Policy</FooterLink>
              <FooterLink to="/terms">Terms of Service</FooterLink>
            </div>
          </div>
        </div>
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: 24, fontSize: 13, display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
          <span>&copy; {year} CampusFix AI. All rights reserved.</span>
          <span style={{ fontSize: 12, color: '#475569' }}>Version 1.0 - Prototype Build</span>
        </div>
      </div>
    </footer>
  )
}

function FooterLink({ to, children }: { to: string; children: React.ReactNode }) {
  return (
    <Link to={to} style={{ color: '#94a3b8', textDecoration: 'none', fontSize: 14, transition: 'color 0.15s' }}
      onMouseEnter={e => (e.currentTarget.style.color = '#60a5fa')}
      onMouseLeave={e => (e.currentTarget.style.color = '#94a3b8')}
    >{children}</Link>
  )
}
