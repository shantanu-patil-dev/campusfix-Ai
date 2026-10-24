import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Building2, LogOut, User, ChevronDown, Menu, X } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { ROLE_LABELS } from '../utils/helpers'

export default function Navbar() {
  const { isAuthenticated, currentUser, logout } = useApp()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = React.useState(false)
  const [profileOpen, setProfileOpen] = React.useState(false)

  function handleLogout() {
    setProfileOpen(false)
    logout()
    navigate('/')
  }

  function getDashboardPath() {
    if (!currentUser) return '/dashboard'
    if (currentUser.role === 'admin') return '/admin'
    if (currentUser.role === 'staff') return '/staff'
    return '/student'
  }

  return (
    <nav style={{
      background: '#0f2044',
      borderBottom: '1px solid rgba(255,255,255,0.08)',
      position: 'sticky', top: 0, zIndex: 50,
    }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px', display: 'flex', alignItems: 'center', height: 64, gap: 24 }}>
        {/* Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none', flexShrink: 0 }}>
          <div style={{
            background: '#2563eb', borderRadius: 8, width: 36, height: 36,
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <Building2 size={20} color="white" />
          </div>
          <span style={{ color: 'white', fontWeight: 700, fontSize: 18, letterSpacing: '-0.02em' }}>
            CampusFix <span style={{ color: '#60a5fa' }}>AI</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 8, marginLeft: 16 }} className="desktop-nav">
          {isAuthenticated && (
            <Link to={getDashboardPath()} style={navLinkStyle}>Dashboard</Link>
          )}
          {isAuthenticated && (currentUser?.role === 'student' || currentUser?.role === 'faculty') && (
            <Link to="/report" style={navLinkStyle}>Report Issue</Link>
          )}
        </div>

        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 12 }}>
          {!isAuthenticated ? (
            <>
              <Link to="/login" style={ghostBtnStyle}>Sign In</Link>
              <Link to="/register" style={primaryBtnStyle}>Get Started</Link>
            </>
          ) : (
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 8, background: 'rgba(255,255,255,0.08)',
                  border: '1px solid rgba(255,255,255,0.12)', borderRadius: 8, padding: '6px 12px',
                  color: 'white', cursor: 'pointer', fontSize: 14,
                }}
                aria-label="User menu"
              >
                <div style={{
                  width: 28, height: 28, borderRadius: '50%', background: '#2563eb',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
                }}>
                  <User size={14} color="white" />
                </div>
                <span style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', lineHeight: 1.2 }}>
                  <span style={{ fontWeight: 600, fontSize: 13 }}>{currentUser?.name}</span>
                  <span style={{ color: '#94a3b8', fontSize: 11 }}>{currentUser ? ROLE_LABELS[currentUser.role] : ''}</span>
                </span>
                <ChevronDown size={14} color="#94a3b8" />
              </button>
              {profileOpen && (
                <div style={{
                  position: 'absolute', top: '100%', right: 0, marginTop: 6,
                  background: 'white', border: '1px solid #e2e8f0', borderRadius: 10,
                  boxShadow: '0 8px 24px rgba(0,0,0,0.12)', minWidth: 180, zIndex: 100, overflow: 'hidden'
                }}>
                  <div style={{ padding: '12px 16px', borderBottom: '1px solid #f1f5f9' }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: '#0f172a' }}>{currentUser?.name}</div>
                    <div style={{ fontSize: 12, color: '#64748b' }}>{currentUser?.email}</div>
                  </div>
                  <button onClick={handleLogout} style={{
                    width: '100%', display: 'flex', alignItems: 'center', gap: 8,
                    padding: '10px 16px', background: 'none', border: 'none',
                    color: '#ef4444', cursor: 'pointer', fontSize: 14, textAlign: 'left'
                  }}>
                    <LogOut size={14} /> Sign Out
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Mobile burger */}
          <button
            className="mobile-menu-btn"
            onClick={() => setMenuOpen(!menuOpen)}
            style={{ display: 'none', background: 'none', border: 'none', color: 'white', cursor: 'pointer', padding: 4 }}
            aria-label="Toggle menu"
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div style={{
          background: '#0a1628', borderTop: '1px solid rgba(255,255,255,0.08)',
          padding: '16px 24px', display: 'flex', flexDirection: 'column', gap: 8
        }}>
          {isAuthenticated && (
            <div style={{ paddingBottom: 8, borderBottom: '1px solid rgba(255,255,255,0.08)', marginBottom: 4 }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: 'white' }}>{currentUser?.name}</div>
              <div style={{ fontSize: 12, color: '#94a3b8' }}>{currentUser ? ROLE_LABELS[currentUser.role] : ''}</div>
            </div>
          )}
          {isAuthenticated && (
            <Link to={getDashboardPath()} style={mobileNavLink} onClick={() => setMenuOpen(false)}>Dashboard</Link>
          )}
          {isAuthenticated && (currentUser?.role === 'student' || currentUser?.role === 'faculty') && (
            <Link to="/report" style={mobileNavLink} onClick={() => setMenuOpen(false)}>Report Issue</Link>
          )}
          {isAuthenticated && (
            <button
              onClick={() => { setMenuOpen(false); handleLogout(); }}
              style={{ ...mobileNavLink, background: 'none', border: 'none', textAlign: 'left', cursor: 'pointer', color: '#f87171', display: 'flex', alignItems: 'center', gap: 8 }}
            >
              <LogOut size={16} /> Sign Out
            </button>
          )}
          {!isAuthenticated && (
            <>
              <Link to="/login" style={mobileNavLink} onClick={() => setMenuOpen(false)}>Sign In</Link>
              <Link to="/register" style={{ ...mobileNavLink, color: '#60a5fa' }} onClick={() => setMenuOpen(false)}>Get Started</Link>
            </>
          )}
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mobile-menu-btn { display: flex !important; }
        }
      `}</style>
    </nav>
  )
}

const navLinkStyle: React.CSSProperties = {
  color: '#cbd5e1', textDecoration: 'none', fontSize: 14, fontWeight: 500,
  padding: '6px 12px', borderRadius: 6, transition: 'color 0.15s, background 0.15s',
}
const ghostBtnStyle: React.CSSProperties = {
  color: '#cbd5e1', textDecoration: 'none', fontSize: 14, fontWeight: 500,
  padding: '7px 16px', borderRadius: 7, border: '1px solid rgba(255,255,255,0.15)',
  background: 'transparent', transition: 'background 0.15s',
}
const primaryBtnStyle: React.CSSProperties = {
  color: 'white', textDecoration: 'none', fontSize: 14, fontWeight: 600,
  padding: '7px 16px', borderRadius: 7, background: '#2563eb',
  border: '1px solid #2563eb', transition: 'background 0.15s',
}
const mobileNavLink: React.CSSProperties = {
  color: '#cbd5e1', textDecoration: 'none', fontSize: 15, fontWeight: 500, padding: '8px 0',
}
