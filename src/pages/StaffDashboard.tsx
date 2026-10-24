import React, { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import {
  Wrench,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Search,
  Filter,
  Building2,
  MapPin,
  MessageSquare,
  ArrowUpRight,
  UserCheck,
  Check
} from 'lucide-react'
import { useApp } from '../context/AppContext'
import type { IssueStatus, IssuePriority } from '../context/AppContext'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { StatusBadge, PriorityBadge, StatCard, EmptyState, Button, Select } from '../components/ui'
import { formatDate, timeAgo, CATEGORY_LABELS, STATUS_LABELS, PRIORITY_LABELS, BUILDINGS } from '../utils/helpers'

export default function StaffDashboard() {
  const { currentUser, issues, updateIssueStatus, addComment } = useApp()

  const [assignmentFilter, setAssignmentFilter] = useState<'mine' | 'all' | 'unassigned'>('mine')
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState<IssueStatus | 'all'>('all')
  const [filterPriority, setFilterPriority] = useState<IssuePriority | 'all'>('all')
  const [filterBuilding, setFilterBuilding] = useState<string>('all')

  // Quick Action Modal state
  const [activeModalIssueId, setActiveModalIssueId] = useState<string | null>(null)
  const [modalActionType, setModalActionType] = useState<'status' | 'comment'>('status')
  const [modalStatus, setModalStatus] = useState<IssueStatus>('in_progress')
  const [modalNote, setModalNote] = useState('')
  const [actionSuccess, setActionSuccess] = useState('')

  const activeIssue = useMemo(
    () => issues.find(i => i.id === activeModalIssueId),
    [issues, activeModalIssueId]
  )

  const staffIssues = useMemo(() => {
    if (assignmentFilter === 'mine') {
      return issues.filter(i => i.assignedTo === currentUser?.id)
    }
    if (assignmentFilter === 'unassigned') {
      return issues.filter(i => !i.assignedTo)
    }
    return issues
  }, [issues, currentUser, assignmentFilter])

  const filteredIssues = useMemo(() => {
    let list = staffIssues
    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter(i =>
        i.title.toLowerCase().includes(q) ||
        i.building.toLowerCase().includes(q) ||
        i.location.toLowerCase().includes(q) ||
        i.id.toLowerCase().includes(q) ||
        i.reportedByName.toLowerCase().includes(q)
      )
    }
    if (filterStatus !== 'all') list = list.filter(i => i.status === filterStatus)
    if (filterPriority !== 'all') list = list.filter(i => i.priority === filterPriority)
    if (filterBuilding !== 'all') list = list.filter(i => i.building === filterBuilding)
    return list
  }, [staffIssues, search, filterStatus, filterPriority, filterBuilding])

  // Real statistics based on assigned issues
  const myAssignedIssues = useMemo(
    () => issues.filter(i => i.assignedTo === currentUser?.id),
    [issues, currentUser]
  )

  const stats = useMemo(() => ({
    assignedCount: myAssignedIssues.length,
    inProgressCount: myAssignedIssues.filter(i => i.status === 'in_progress').length,
    criticalCount: myAssignedIssues.filter(i => (i.priority === 'critical' || i.priority === 'high') && i.status !== 'resolved' && i.status !== 'closed').length,
    resolvedCount: myAssignedIssues.filter(i => i.status === 'resolved' || i.status === 'closed').length,
  }), [myAssignedIssues])

  function openStatusModal(issueId: string, defaultStatus: IssueStatus = 'in_progress') {
    setActiveModalIssueId(issueId)
    setModalActionType('status')
    setModalStatus(defaultStatus)
    setModalNote('')
    setActionSuccess('')
  }

  function openCommentModal(issueId: string) {
    setActiveModalIssueId(issueId)
    setModalActionType('comment')
    setModalNote('')
    setActionSuccess('')
  }

  function handleSaveModal(e: React.FormEvent) {
    e.preventDefault()
    if (!activeModalIssueId) return

    if (modalActionType === 'status') {
      updateIssueStatus(activeModalIssueId, modalStatus, modalNote.trim() || `Status updated to ${STATUS_LABELS[modalStatus]}`)
      setActionSuccess(`Issue ${activeModalIssueId} status updated to ${STATUS_LABELS[modalStatus]}.`)
    } else {
      if (!modalNote.trim()) return
      addComment(activeModalIssueId, modalNote.trim())
      setActionSuccess(`Progress note added to ${activeModalIssueId}.`)
    }

    setTimeout(() => {
      setActiveModalIssueId(null)
      setActionSuccess('')
    }, 1200)
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', display: 'flex', flexDirection: 'column' }}>
      <Navbar />

      <main style={{ flex: 1, maxWidth: 1200, margin: '0 auto', width: '100%', padding: '32px 24px' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 28, flexWrap: 'wrap', gap: 16 }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '4px 10px', background: '#e2e8f0', borderRadius: 6, fontSize: 12, fontWeight: 600, color: '#334155', marginBottom: 8 }}>
              <Wrench size={13} /> Facilities Maintenance Staff
            </div>
            <h1 style={{ fontSize: 26, fontWeight: 800, color: '#0f172a', marginBottom: 4 }}>
              Maintenance Work Orders
            </h1>
            <p style={{ color: '#64748b', fontSize: 14 }}>
              Logged in as {currentUser?.name} {currentUser?.department ? `(${currentUser.department})` : ''}. Review assigned tickets and log maintenance resolutions.
            </p>
          </div>

          <div style={{ display: 'flex', gap: 8, background: '#e2e8f0', padding: 3, borderRadius: 8 }}>
            <button
              onClick={() => setAssignmentFilter('mine')}
              style={{
                padding: '7px 14px', borderRadius: 6, border: 'none', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit',
                background: assignmentFilter === 'mine' ? '#ffffff' : 'transparent',
                color: assignmentFilter === 'mine' ? '#0f2044' : '#475569',
                boxShadow: assignmentFilter === 'mine' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none'
              }}
            >
              Assigned to Me ({myAssignedIssues.length})
            </button>
            <button
              onClick={() => setAssignmentFilter('unassigned')}
              style={{
                padding: '7px 14px', borderRadius: 6, border: 'none', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit',
                background: assignmentFilter === 'unassigned' ? '#ffffff' : 'transparent',
                color: assignmentFilter === 'unassigned' ? '#0f2044' : '#475569',
                boxShadow: assignmentFilter === 'unassigned' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none'
              }}
            >
              Unassigned ({issues.filter(i => !i.assignedTo).length})
            </button>
            <button
              onClick={() => setAssignmentFilter('all')}
              style={{
                padding: '7px 14px', borderRadius: 6, border: 'none', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit',
                background: assignmentFilter === 'all' ? '#ffffff' : 'transparent',
                color: assignmentFilter === 'all' ? '#0f2044' : '#475569',
                boxShadow: assignmentFilter === 'all' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none'
              }}
            >
              All Work Orders ({issues.length})
            </button>
          </div>
        </div>

        {/* Real Metrics Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 14, marginBottom: 28 }}>
          <StatCard
            label="My Assigned Work Orders"
            value={stats.assignedCount}
            icon={<UserCheck size={20} />}
            color="#2563eb"
          />
          <StatCard
            label="In Progress Repairs"
            value={stats.inProgressCount}
            icon={<Clock size={20} />}
            color="#d97706"
          />
          <StatCard
            label="High / Critical Pending"
            value={stats.criticalCount}
            icon={<AlertTriangle size={20} />}
            color="#dc2626"
          />
          <StatCard
            label="Completed Work Orders"
            value={stats.resolvedCount}
            icon={<CheckCircle2 size={20} />}
            color="#16a34a"
          />
        </div>

        {/* Filters and Search Bar */}
        <div style={{
          background: 'white', border: '1px solid #e2e8f0', borderRadius: 10,
          padding: '14px 16px', marginBottom: 16,
          display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap',
        }}>
          <div style={{ position: 'relative', flex: '1 1 240px', minWidth: 200 }}>
            <Search size={14} style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
            <input
              id="staff-search-input"
              placeholder="Search by ID, title, building, room, or reporter..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{
                width: '100%', paddingLeft: 32, paddingRight: 12, paddingTop: 8, paddingBottom: 8,
                border: '1.5px solid #e2e8f0', borderRadius: 8, fontSize: 13, outline: 'none', fontFamily: 'inherit'
              }}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
            <Filter size={14} color="#94a3b8" />

            <select
              id="staff-filter-status"
              value={filterStatus}
              onChange={e => setFilterStatus(e.target.value as IssueStatus | 'all')}
              style={{ padding: '7px 10px', border: '1.5px solid #e2e8f0', borderRadius: 8, fontSize: 13, outline: 'none', fontFamily: 'inherit', background: 'white' }}
            >
              <option value="all">All Statuses</option>
              {(['open', 'in_progress', 'resolved', 'closed'] as IssueStatus[]).map(s => (
                <option key={s} value={s}>{STATUS_LABELS[s]}</option>
              ))}
            </select>

            <select
              id="staff-filter-priority"
              value={filterPriority}
              onChange={e => setFilterPriority(e.target.value as IssuePriority | 'all')}
              style={{ padding: '7px 10px', border: '1.5px solid #e2e8f0', borderRadius: 8, fontSize: 13, outline: 'none', fontFamily: 'inherit', background: 'white' }}
            >
              <option value="all">All Priorities</option>
              {(['low', 'medium', 'high', 'critical'] as IssuePriority[]).map(p => (
                <option key={p} value={p}>{PRIORITY_LABELS[p]}</option>
              ))}
            </select>

            <select
              id="staff-filter-building"
              value={filterBuilding}
              onChange={e => setFilterBuilding(e.target.value)}
              style={{ padding: '7px 10px', border: '1.5px solid #e2e8f0', borderRadius: 8, fontSize: 13, outline: 'none', fontFamily: 'inherit', background: 'white', maxWidth: 170 }}
            >
              <option value="all">All Buildings</option>
              {BUILDINGS.map(b => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>

            {(search || filterStatus !== 'all' || filterPriority !== 'all' || filterBuilding !== 'all') && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSearch('')
                  setFilterStatus('all')
                  setFilterPriority('all')
                  setFilterBuilding('all')
                }}
                style={{ fontSize: 12, color: '#64748b' }}
              >
                Reset Filters
              </Button>
            )}
          </div>
        </div>

        {/* Work Orders List */}
        <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: 12, overflow: 'hidden' }}>
          {filteredIssues.length === 0 ? (
            <EmptyState
              icon={<Wrench size={40} />}
              title={
                assignmentFilter === 'mine'
                  ? 'No work orders currently assigned to you'
                  : 'No matching work orders found'
              }
              message="Check unassigned tickets or clear your active filters to review other campus maintenance tickets."
              action={
                assignmentFilter === 'mine' ? (
                  <Button variant="secondary" onClick={() => setAssignmentFilter('all')}>
                    View All Work Orders
                  </Button>
                ) : undefined
              }
            />
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                <thead>
                  <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                    <th style={{ padding: '12px 14px', textAlign: 'left', fontWeight: 600, color: '#64748b', fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.04em' }}>ID</th>
                    <th style={{ padding: '12px 14px', textAlign: 'left', fontWeight: 600, color: '#64748b', fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Issue Title & Location</th>
                    <th style={{ padding: '12px 14px', textAlign: 'left', fontWeight: 600, color: '#64748b', fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Category</th>
                    <th style={{ padding: '12px 14px', textAlign: 'left', fontWeight: 600, color: '#64748b', fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Priority</th>
                    <th style={{ padding: '12px 14px', textAlign: 'left', fontWeight: 600, color: '#64748b', fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Status</th>
                    <th style={{ padding: '12px 14px', textAlign: 'left', fontWeight: 600, color: '#64748b', fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Assignee</th>
                    <th style={{ padding: '12px 14px', textAlign: 'left', fontWeight: 600, color: '#64748b', fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Updated</th>
                    <th style={{ padding: '12px 14px', textAlign: 'right', fontWeight: 600, color: '#64748b', fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredIssues.map((issue, idx) => (
                    <tr
                      key={issue.id}
                      style={{
                        borderBottom: idx < filteredIssues.length - 1 ? '1px solid #f1f5f9' : 'none',
                        transition: 'background 0.1s'
                      }}
                      onMouseEnter={e => (e.currentTarget.style.background = '#f8fafc')}
                      onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                    >
                      <td style={{ padding: '12px 14px', fontWeight: 700, color: '#0f2044', whiteSpace: 'nowrap' }}>
                        {issue.id}
                      </td>
                      <td style={{ padding: '12px 14px', minWidth: 260, maxWidth: 360 }}>
                        <div style={{ fontWeight: 600, color: '#0f172a', marginBottom: 4, lineHeight: 1.3 }}>
                          {issue.title}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#64748b' }}>
                          <Building2 size={12} />
                          <span>{issue.building}</span>
                          <span style={{ color: '#cbd5e1' }}>•</span>
                          <MapPin size={12} />
                          <span>{issue.location}</span>
                        </div>
                      </td>
                      <td style={{ padding: '12px 14px', color: '#475569', whiteSpace: 'nowrap' }}>
                        {CATEGORY_LABELS[issue.category]}
                      </td>
                      <td style={{ padding: '12px 14px', whiteSpace: 'nowrap' }}>
                        <PriorityBadge priority={issue.priority} />
                      </td>
                      <td style={{ padding: '12px 14px', whiteSpace: 'nowrap' }}>
                        <StatusBadge status={issue.status} />
                      </td>
                      <td style={{ padding: '12px 14px', whiteSpace: 'nowrap' }}>
                        {issue.assignedToName ? (
                          <span style={{ fontSize: 13, color: '#334155', fontWeight: 500 }}>
                            {issue.assignedTo === currentUser?.id ? 'You' : issue.assignedToName}
                          </span>
                        ) : (
                          <span style={{ fontSize: 12, color: '#94a3b8', fontStyle: 'italic' }}>Unassigned</span>
                        )}
                      </td>
                      <td style={{ padding: '12px 14px', color: '#64748b', whiteSpace: 'nowrap', fontSize: 12 }}>
                        <span title={formatDate(issue.updatedAt)}>{timeAgo(issue.updatedAt)}</span>
                      </td>
                      <td style={{ padding: '12px 14px', textAlign: 'right', whiteSpace: 'nowrap' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 6 }}>
                          {issue.status !== 'resolved' && issue.status !== 'closed' && (
                            <Button
                              variant="secondary"
                              size="sm"
                              onClick={() => openStatusModal(issue.id, issue.status === 'open' ? 'in_progress' : 'resolved')}
                              title="Update ticket status"
                            >
                              <Clock size={12} />
                              {issue.status === 'open' ? 'Start' : 'Resolve'}
                            </Button>
                          )}

                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openCommentModal(issue.id)}
                            title="Add progress note"
                          >
                            <MessageSquare size={13} />
                          </Button>

                          <Link to={`/issues/${issue.id}`} style={{ textDecoration: 'none' }}>
                            <Button variant="ghost" size="sm" style={{ color: '#2563eb' }} title="View full ticket">
                              <ArrowUpRight size={14} />
                            </Button>
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {/* Quick Action Modal */}
      {activeModalIssueId && activeIssue && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(15, 23, 42, 0.5)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: 20, zIndex: 100
        }}>
          <div style={{
            background: 'white', borderRadius: 12, border: '1px solid #e2e8f0',
            maxWidth: 480, width: '100%', padding: 24, boxShadow: '0 10px 25px rgba(0,0,0,0.15)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
              <div>
                <span style={{ fontSize: 12, fontWeight: 700, color: '#2563eb' }}>{activeIssue.id}</span>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: '#0f172a', marginTop: 2 }}>
                  {modalActionType === 'status' ? 'Update Work Order Status' : 'Add Maintenance Progress Note'}
                </h3>
              </div>
              <button
                onClick={() => setActiveModalIssueId(null)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', fontSize: 18, lineHeight: 1 }}
              >
                ×
              </button>
            </div>

            <p style={{ fontSize: 13, color: '#64748b', marginBottom: 16 }}>
              {activeIssue.title} ({activeIssue.building} - {activeIssue.location})
            </p>

            {actionSuccess ? (
              <div style={{ padding: '12px 16px', background: '#dcfce7', border: '1px solid #86efac', borderRadius: 8, color: '#15803d', fontSize: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
                <Check size={16} /> {actionSuccess}
              </div>
            ) : (
              <form onSubmit={handleSaveModal} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {modalActionType === 'status' && (
                  <Select
                    id="modal-status-select"
                    label="New Work Order Status"
                    value={modalStatus}
                    onChange={e => setModalStatus(e.target.value as IssueStatus)}
                  >
                    <option value="open">Open (Acknowledged)</option>
                    <option value="in_progress">In Progress (Active Work)</option>
                    <option value="resolved">Resolved (Completed)</option>
                    <option value="closed">Closed (Archived)</option>
                  </Select>
                )}

                <div>
                  <label htmlFor="modal-note-input" style={{ fontSize: 13, fontWeight: 600, color: '#334155', display: 'block', marginBottom: 6 }}>
                    {modalActionType === 'status' ? 'Resolution or Status Note (Optional)' : 'Progress Note Content'}
                  </label>
                  <textarea
                    id="modal-note-input"
                    value={modalNote}
                    onChange={e => setModalNote(e.target.value)}
                    placeholder={modalActionType === 'status' ? 'Example: Replaced damaged pipe valve. Inspected for leaks.' : 'Example: Parts ordered from vendor; expected delivery tomorrow morning.'}
                    style={{
                      width: '100%', minHeight: 90, padding: '9px 12px', borderRadius: 8,
                      border: '1.5px solid #e2e8f0', fontSize: 13, outline: 'none', fontFamily: 'inherit', resize: 'vertical'
                    }}
                    required={modalActionType === 'comment'}
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 8 }}>
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    onClick={() => setActiveModalIssueId(null)}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                    size="sm"
                  >
                    {modalActionType === 'status' ? 'Apply Status Update' : 'Save Note'}
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      <Footer />
    </div>
  )
}
