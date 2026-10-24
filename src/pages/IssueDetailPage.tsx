import { useState, type ReactNode } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  ArrowLeft, MapPin, Calendar, User, Tag, Building2, Clock,
  MessageSquare, AlertTriangle, CheckCircle, Circle, Loader
} from 'lucide-react'
import { useApp, type IssueStatus, type IssuePriority } from '../context/AppContext'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { StatusBadge, PriorityBadge, Button, Select, Alert, Card } from '../components/ui'
import { formatDateTime, timeAgo, CATEGORY_LABELS, ROLE_LABELS } from '../utils/helpers'

const activityIcon: Record<string, ReactNode> = {
  created: <Circle size={14} style={{ color: '#2563eb' }} />,
  status_change: <Loader size={14} style={{ color: '#f97316' }} />,
  assignment: <User size={14} style={{ color: '#7c3aed' }} />,
  priority_change: <AlertTriangle size={14} style={{ color: '#eab308' }} />,
  comment: <MessageSquare size={14} style={{ color: '#64748b' }} />,
}

export default function IssueDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { issues, currentUser, updateIssueStatus, updateIssuePriority, assignIssue, addComment, users } = useApp()
  const navigate = useNavigate()

  const issue = issues.find(i => i.id === id)
  const [comment, setComment] = useState('')
  const [statusNote, setStatusNote] = useState('')
  const [newStatus, setNewStatus] = useState<IssueStatus | ''>('')
  const [newPriority, setNewPriority] = useState<IssuePriority | ''>('')
  const [assignTo, setAssignTo] = useState('')
  const [commentError, setCommentError] = useState('')
  const [successMsg, setSuccessMsg] = useState('')

  if (!issue) {
    return (
      <div style={{ minHeight: '100vh', background: '#f8fafc', display: 'flex', flexDirection: 'column' }}>
        <Navbar />
        <main style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, flexDirection: 'column', gap: 16 }}>
          <div style={{ fontSize: 16, fontWeight: 600, color: '#475569' }}>Issue not found.</div>
          <Button variant="secondary" onClick={() => navigate(-1)}><ArrowLeft size={14} /> Go Back</Button>
        </main>
        <Footer />
      </div>
    )
  }

  const isStaff = currentUser?.role === 'staff'
  const isAdmin = currentUser?.role === 'admin'
  const canManage = isStaff || isAdmin
  const staffUsers = users.filter(u => u.role === 'staff')

  function flash(msg: string) {
    setSuccessMsg(msg)
    setTimeout(() => setSuccessMsg(''), 3000)
  }

  function handleStatusUpdate() {
    if (!newStatus || !issue) return
    updateIssueStatus(issue.id, newStatus, statusNote)
    setNewStatus(''); setStatusNote('')
    flash('Status updated successfully.')
  }

  function handlePriorityUpdate() {
    if (!newPriority || !issue) return
    updateIssuePriority(issue.id, newPriority)
    setNewPriority('')
    flash('Priority updated.')
  }

  function handleAssign() {
    if (!assignTo || !issue) return
    assignIssue(issue.id, assignTo)
    setAssignTo('')
    flash('Issue assigned.')
  }

  function handleComment() {
    if (!issue) return
    if (!comment.trim()) { setCommentError('Comment cannot be empty.'); return }
    addComment(issue.id, comment.trim())
    setComment(''); setCommentError('')
    flash('Comment added.')
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      <main style={{ flex: 1, maxWidth: 1100, margin: '0 auto', width: '100%', padding: '32px 24px' }}>
        {/* Back */}
        <button onClick={() => navigate(-1)} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', fontSize: 14, fontWeight: 500, marginBottom: 20, padding: 0, fontFamily: 'inherit' }}>
          <ArrowLeft size={14} /> Back
        </button>

        {successMsg && <div style={{ marginBottom: 16 }}><Alert type="success">{successMsg}</Alert></div>}

        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) 320px', gap: 24 }}
          className="issue-detail-grid">

          {/* Main */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <Card>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12, flexWrap: 'wrap', marginBottom: 16 }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: '#2563eb', letterSpacing: '0.04em' }}>{issue.id}</div>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  <StatusBadge status={issue.status} />
                  <PriorityBadge priority={issue.priority} />
                </div>
              </div>
              <h1 style={{ fontSize: 20, fontWeight: 800, color: '#0f172a', marginBottom: 16, lineHeight: 1.4 }}>{issue.title}</h1>
              <p style={{ fontSize: 14, color: '#475569', lineHeight: 1.75, marginBottom: 20 }}>{issue.description}</p>

              {issue.photoUrl && (
                <img src={issue.photoUrl} alt="Issue attachment" style={{ maxWidth: '100%', borderRadius: 8, border: '1px solid #e2e8f0', maxHeight: 280, objectFit: 'cover', marginBottom: 16 }} />
              )}

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 12 }}>
                {[
                  { icon: <Tag size={13} />, label: 'Category', value: CATEGORY_LABELS[issue.category] },
                  { icon: <Building2 size={13} />, label: 'Building', value: issue.building },
                  { icon: <MapPin size={13} />, label: 'Location', value: issue.location },
                  { icon: <User size={13} />, label: 'Reported by', value: issue.reportedByName },
                  { icon: <Calendar size={13} />, label: 'Reported', value: formatDateTime(issue.createdAt) },
                  ...(issue.assignedToName ? [{ icon: <User size={13} />, label: 'Assigned to', value: issue.assignedToName }] : []),
                  ...(issue.resolvedAt ? [{ icon: <CheckCircle size={13} />, label: 'Resolved', value: formatDateTime(issue.resolvedAt) }] : []),
                ].map(({ icon, label, value }) => (
                  <div key={label} style={{ background: '#f8fafc', borderRadius: 8, padding: '10px 12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 5, color: '#94a3b8', marginBottom: 3, fontSize: 11, textTransform: 'uppercase', fontWeight: 600, letterSpacing: '0.05em' }}>
                      {icon} {label}
                    </div>
                    <div style={{ fontSize: 13, color: '#0f172a', fontWeight: 500 }}>{value}</div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Activity */}
            <Card>
              <h2 style={{ fontSize: 15, fontWeight: 700, color: '#0f172a', marginBottom: 18 }}>Activity Timeline</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                {[...issue.activity].reverse().map((act, idx) => (
                  <div key={act.id} style={{ display: 'flex', gap: 12, paddingBottom: idx < issue.activity.length - 1 ? 16 : 0, marginBottom: idx < issue.activity.length - 1 ? 0 : 0 }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      <div style={{ width: 28, height: 28, borderRadius: '50%', background: '#f1f5f9', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        {activityIcon[act.type] || <Circle size={12} />}
                      </div>
                      {idx < issue.activity.length - 1 && <div style={{ width: 1, flex: 1, background: '#e2e8f0', margin: '4px 0' }} />}
                    </div>
                    <div style={{ paddingBottom: idx < issue.activity.length - 1 ? 16 : 0, flex: 1 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 8, flexWrap: 'wrap' }}>
                        <span style={{ fontSize: 13, fontWeight: 600, color: '#0f172a' }}>{act.userName}</span>
                        <span style={{ fontSize: 11, color: '#94a3b8' }} title={formatDateTime(act.timestamp)}>{timeAgo(act.timestamp)}</span>
                      </div>
                      <div style={{ fontSize: 11, color: '#64748b', marginBottom: 4 }}>{ROLE_LABELS[act.userRole]}</div>
                      <div style={{ fontSize: 13, color: '#475569', lineHeight: 1.6 }}>{act.content}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Add comment */}
              <div style={{ marginTop: 20, paddingTop: 20, borderTop: '1px solid #f1f5f9' }}>
                <label style={{ fontSize: 13, fontWeight: 600, color: '#334155', display: 'block', marginBottom: 8 }}>Add a comment</label>
                <textarea
                  id="add-comment" value={comment} onChange={e => { setComment(e.target.value); setCommentError('') }}
                  placeholder="Write a comment or update..."
                  style={{ width: '100%', minHeight: 80, padding: '9px 13px', borderRadius: 8, border: `1.5px solid ${commentError ? '#ef4444' : '#e2e8f0'}`, fontSize: 14, resize: 'vertical', fontFamily: 'inherit', outline: 'none' }}
                  onFocus={e => { if (!commentError) e.currentTarget.style.borderColor = '#3b82f6' }}
                  onBlur={e => { if (!commentError) e.currentTarget.style.borderColor = '#e2e8f0' }}
                />
                {commentError && <p style={{ fontSize: 12, color: '#ef4444', marginTop: 4 }}>{commentError}</p>}
                <div style={{ marginTop: 10, display: 'flex', justifyContent: 'flex-end' }}>
                  <Button variant="primary" size="sm" onClick={handleComment}>
                    <MessageSquare size={13} /> Post Comment
                  </Button>
                </div>
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {canManage && (
              <>
                {/* Status update */}
                <Card style={{ padding: 20 }}>
                  <h3 style={{ fontSize: 14, fontWeight: 700, color: '#0f172a', marginBottom: 14 }}>Update Status</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    <Select id="status-select" value={newStatus} onChange={e => setNewStatus(e.target.value as IssueStatus)}>
                      <option value="">Select new status...</option>
                      {(['open', 'in_progress', 'resolved', 'closed'] as IssueStatus[]).map(s => (
                        <option key={s} value={s}>{s === 'in_progress' ? 'In Progress' : s.charAt(0).toUpperCase() + s.slice(1)}</option>
                      ))}
                    </Select>
                    <textarea
                      value={statusNote} onChange={e => setStatusNote(e.target.value)}
                      placeholder="Add a note (optional)..."
                      style={{ padding: '8px 12px', borderRadius: 8, border: '1.5px solid #e2e8f0', fontSize: 13, resize: 'vertical', fontFamily: 'inherit', minHeight: 70, outline: 'none' }}
                    />
                    <Button variant="primary" size="sm" onClick={handleStatusUpdate} disabled={!newStatus}>
                      <Clock size={13} /> Update Status
                    </Button>
                  </div>
                </Card>

                {/* Priority */}
                <Card style={{ padding: 20 }}>
                  <h3 style={{ fontSize: 14, fontWeight: 700, color: '#0f172a', marginBottom: 14 }}>Change Priority</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    <Select id="priority-select" value={newPriority} onChange={e => setNewPriority(e.target.value as IssuePriority)}>
                      <option value="">Select priority...</option>
                      {(['low', 'medium', 'high', 'critical'] as IssuePriority[]).map(p => (
                        <option key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</option>
                      ))}
                    </Select>
                    <Button variant="secondary" size="sm" onClick={handlePriorityUpdate} disabled={!newPriority}>
                      Set Priority
                    </Button>
                  </div>
                </Card>

                {/* Assign */}
                {isAdmin && (
                  <Card style={{ padding: 20 }}>
                    <h3 style={{ fontSize: 14, fontWeight: 700, color: '#0f172a', marginBottom: 14 }}>Assign to Staff</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                      <Select id="assign-select" value={assignTo} onChange={e => setAssignTo(e.target.value)}>
                        <option value="">Select staff member...</option>
                        {staffUsers.map(u => (
                          <option key={u.id} value={u.id}>{u.name}</option>
                        ))}
                      </Select>
                      <Button variant="secondary" size="sm" onClick={handleAssign} disabled={!assignTo}>
                        <User size={13} /> Assign
                      </Button>
                    </div>
                  </Card>
                )}
              </>
            )}

            {/* Quick info */}
            <Card style={{ padding: 20 }}>
              <h3 style={{ fontSize: 14, fontWeight: 700, color: '#0f172a', marginBottom: 14 }}>Issue Summary</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <InfoRow label="ID" value={issue.id} />
                <InfoRow label="Status" value={<StatusBadge status={issue.status} />} />
                <InfoRow label="Priority" value={<PriorityBadge priority={issue.priority} />} />
                <InfoRow label="Last updated" value={<span style={{ fontSize: 12, color: '#64748b' }}>{timeAgo(issue.updatedAt)}</span>} />
              </div>
            </Card>
          </div>
        </div>
      </main>
      <style>{`
        @media (max-width: 768px) {
          .issue-detail-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
      <Footer />
    </div>
  )
}

function InfoRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8 }}>
      <span style={{ fontSize: 12, color: '#64748b', fontWeight: 500 }}>{label}</span>
      <span style={{ fontSize: 13, color: '#0f172a', fontWeight: 600 }}>{value}</span>
    </div>
  )
}
