import React from 'react'
import type { IssueStatus, IssuePriority } from '../context/AppContext'
import { STATUS_LABELS, STATUS_COLORS, PRIORITY_LABELS, PRIORITY_COLORS } from '../utils/helpers'

export function StatusBadge({ status }: { status: IssueStatus }) {
  const colors = STATUS_COLORS[status]
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center',
      padding: '3px 10px', borderRadius: 6, fontSize: 12, fontWeight: 600,
      background: colors.bg, color: colors.text, border: `1px solid ${colors.border}`,
      whiteSpace: 'nowrap',
    }}>
      {STATUS_LABELS[status]}
    </span>
  )
}

export function PriorityBadge({ priority }: { priority: IssuePriority }) {
  const colors = PRIORITY_COLORS[priority]
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      padding: '3px 10px', borderRadius: 6, fontSize: 12, fontWeight: 600,
      background: colors.bg, color: colors.text, whiteSpace: 'nowrap',
    }}>
      <span style={{ width: 6, height: 6, borderRadius: '50%', background: colors.dot, flexShrink: 0 }} />
      {PRIORITY_LABELS[priority]}
    </span>
  )
}

interface CardProps {
  children: React.ReactNode
  style?: React.CSSProperties
  className?: string
}
export function Card({ children, style }: CardProps) {
  return (
    <div style={{
      background: 'white', border: '1px solid #e2e8f0',
      borderRadius: 12, padding: 24, ...style,
    }}>
      {children}
    </div>
  )
}

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
  children: React.ReactNode
}
export function Button({ variant = 'primary', size = 'md', loading, children, disabled, style, ...rest }: ButtonProps) {
  const base: React.CSSProperties = {
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 6,
    fontWeight: 600, borderRadius: 8, border: 'none', cursor: disabled || loading ? 'not-allowed' : 'pointer',
    transition: 'background 0.15s, opacity 0.15s', fontFamily: 'inherit',
    opacity: disabled || loading ? 0.6 : 1,
    fontSize: size === 'sm' ? 13 : size === 'lg' ? 16 : 14,
    padding: size === 'sm' ? '6px 14px' : size === 'lg' ? '12px 24px' : '9px 18px',
  }
  const variants: Record<string, React.CSSProperties> = {
    primary: { background: '#2563eb', color: 'white' },
    secondary: { background: '#f1f5f9', color: '#334155', border: '1px solid #e2e8f0' },
    danger: { background: '#fee2e2', color: '#b91c1c', border: '1px solid #fecaca' },
    ghost: { background: 'transparent', color: '#334155' },
  }
  return (
    <button disabled={disabled || loading} style={{ ...base, ...variants[variant], ...style }} {...rest}>
      {loading ? <span style={{ display: 'inline-block', width: 14, height: 14, border: '2px solid currentColor', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} /> : null}
      {children}
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </button>
  )
}

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  hint?: string
}
export function Input({ label, error, hint, id, style, ...rest }: InputProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      {label && <label htmlFor={id} style={{ fontSize: 13, fontWeight: 600, color: '#334155' }}>{label}</label>}
      <input
        id={id}
        style={{
          padding: '9px 13px', borderRadius: 8, border: `1.5px solid ${error ? '#ef4444' : '#e2e8f0'}`,
          fontSize: 14, color: '#0f172a', background: 'white', outline: 'none',
          transition: 'border-color 0.15s', fontFamily: 'inherit', width: '100%', ...style,
        }}
        onFocus={e => { if (!error) e.currentTarget.style.borderColor = '#3b82f6' }}
        onBlur={e => { if (!error) e.currentTarget.style.borderColor = '#e2e8f0' }}
        {...rest}
      />
      {error && <span style={{ fontSize: 12, color: '#ef4444' }}>{error}</span>}
      {hint && !error && <span style={{ fontSize: 12, color: '#64748b' }}>{hint}</span>}
    </div>
  )
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  error?: string
  hint?: string
}
export function Select({ label, error, hint, id, children, style, ...rest }: SelectProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      {label && <label htmlFor={id} style={{ fontSize: 13, fontWeight: 600, color: '#334155' }}>{label}</label>}
      <select
        id={id}
        style={{
          padding: '9px 13px', borderRadius: 8, border: `1.5px solid ${error ? '#ef4444' : '#e2e8f0'}`,
          fontSize: 14, color: '#0f172a', background: 'white', outline: 'none',
          transition: 'border-color 0.15s', fontFamily: 'inherit', width: '100%', ...style,
        }}
        {...rest}
      >
        {children}
      </select>
      {error && <span style={{ fontSize: 12, color: '#ef4444' }}>{error}</span>}
      {hint && !error && <span style={{ fontSize: 12, color: '#64748b' }}>{hint}</span>}
    </div>
  )
}

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
  hint?: string
}
export function Textarea({ label, error, hint, id, style, ...rest }: TextareaProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      {label && <label htmlFor={id} style={{ fontSize: 13, fontWeight: 600, color: '#334155' }}>{label}</label>}
      <textarea
        id={id}
        style={{
          padding: '9px 13px', borderRadius: 8, border: `1.5px solid ${error ? '#ef4444' : '#e2e8f0'}`,
          fontSize: 14, color: '#0f172a', background: 'white', outline: 'none', resize: 'vertical',
          transition: 'border-color 0.15s', fontFamily: 'inherit', width: '100%', minHeight: 100, ...style,
        }}
        onFocus={e => { if (!error) e.currentTarget.style.borderColor = '#3b82f6' }}
        onBlur={e => { if (!error) e.currentTarget.style.borderColor = '#e2e8f0' }}
        {...rest}
      />
      {error && <span style={{ fontSize: 12, color: '#ef4444' }}>{error}</span>}
      {hint && !error && <span style={{ fontSize: 12, color: '#64748b' }}>{hint}</span>}
    </div>
  )
}

export function StatCard({ label, value, icon, color = '#2563eb' }: { label: string; value: number | string; icon: React.ReactNode; color?: string }) {
  return (
    <div style={{
      background: 'white', border: '1px solid #e2e8f0', borderRadius: 12, padding: '20px 24px',
      display: 'flex', alignItems: 'center', gap: 16,
    }}>
      <div style={{
        width: 44, height: 44, borderRadius: 10, background: `${color}15`,
        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
        color,
      }}>
        {icon}
      </div>
      <div>
        <div style={{ fontSize: 24, fontWeight: 700, color: '#0f172a', lineHeight: 1.2 }}>{value}</div>
        <div style={{ fontSize: 13, color: '#64748b', marginTop: 2 }}>{label}</div>
      </div>
    </div>
  )
}

export function EmptyState({ icon, title, message, action }: {
  icon: React.ReactNode; title: string; message: string; action?: React.ReactNode
}) {
  return (
    <div style={{ textAlign: 'center', padding: '48px 24px', color: '#64748b' }}>
      <div style={{ color: '#cbd5e1', marginBottom: 12, display: 'flex', justifyContent: 'center' }}>{icon}</div>
      <div style={{ fontSize: 16, fontWeight: 600, color: '#475569', marginBottom: 6 }}>{title}</div>
      <div style={{ fontSize: 14, maxWidth: 360, margin: '0 auto', lineHeight: 1.6 }}>{message}</div>
      {action && <div style={{ marginTop: 20 }}>{action}</div>}
    </div>
  )
}

export function PageLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc' }}>
      {children}
    </div>
  )
}

export function PageContainer({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px', ...style }}>
      {children}
    </div>
  )
}

export function Alert({ type, children }: { type: 'error' | 'success' | 'warning' | 'info'; children: React.ReactNode }) {
  const styles = {
    error: { bg: '#fee2e2', border: '#fca5a5', text: '#b91c1c' },
    success: { bg: '#dcfce7', border: '#86efac', text: '#15803d' },
    warning: { bg: '#fef9c3', border: '#fde68a', text: '#a16207' },
    info: { bg: '#dbeafe', border: '#bfdbfe', text: '#1d4ed8' },
  }[type]
  return (
    <div style={{
      background: styles.bg, border: `1px solid ${styles.border}`, borderRadius: 8,
      padding: '10px 14px', fontSize: 14, color: styles.text, lineHeight: 1.5,
    }}>
      {children}
    </div>
  )
}
