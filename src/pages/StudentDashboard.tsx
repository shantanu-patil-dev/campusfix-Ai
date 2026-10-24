import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Search, Filter, ClipboardList } from 'lucide-react'
import { useApp } from '../context/AppContext'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { StatusBadge, PriorityBadge, StatCard, EmptyState, Button } from '../components/ui'
import { formatDate, timeAgo, CATEGORY_LABELS, STATUS_LABELS, PRIORITY_LABELS } from '../utils/helpers'
import type { IssueStatus, IssuePriority } from '../context/AppContext'

export default function StudentDashboard() {
  const { currentUser, issues } = useApp()
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState<IssueStatus | 'all'>('all')
  const [filterPriority, setFilterPriority] = useState<IssuePriority | 'all'>('all')

  const myIssues = useMemo(() =>
    issues.filter(i => i.reportedBy === currentUser?.id),
    [issues, currentUser]
  )

  const filtered = useMemo(() => {
    let list = myIssues
    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter(i =>
        i.title.toLowerCase().includes(q) ||
        i.building.toLowerCase().includes(q) ||
        i.location.toLowerCase().includes(q) ||
        i.id.toLowerCase().includes(q)
      )
    }
    if (filterStatus !== 'all') list = list.filter(i => i.status === filterStatus)
    if (filterPriority !== 'all') list = list.filter(i => i.priority === filterPriority)
    return list
  }, [myIssues, search, filterStatus, filterPriority])

  const counts = useMemo(() => ({
    total: myIssues.length,
    open: myIssues.filter(i => i.status === 'open').length,
    in_progress: myIssues.filter(i => i.status === 'in_progress').length,
    resolved: myIssues.filter(i => i.status === 'resolved').length,
  }), [myIssues])

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      <main style={{ flex: 1, maxWidth: 1100, margin: '0 auto', width: '100%', padding: '32px 24px' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 28, flexWrap: 'wrap', gap: 16 }}>
          <div>
            <h1 style={{ fontSize: 26, fontWeight: 800, color: '#0f172a', marginBottom: 4 }}>
              Welcome back, {currentUser?.name?.split(' ')[0]}
            </h1>
            <p style={{ color: '#64748b', fontSize: 14 }}>
              {currentUser?.department ? `${currentUser.department} - ` : ''}{currentUser?.role === 'faculty' ? 'Faculty' : 'Student'} Dashboard
            </p>
          </div>
          <Link to="/report" style={{ textDecoration: 'none' }}>
            <Button variant="primary" size="md">
              <Plus size={15} /> Report an Issue
            </Button>
          </Link>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 14, marginBottom: 28 }}>
          <StatCard label="Total Reported" value={counts.total} icon={<ClipboardList size={20} />} color="#2563eb" />
          <StatCard label="Open" value={counts.open} icon={<div style={{ width: 20, height: 20, borderRadius: '50%', border: '2.5px solid currentColor' }} />} color="#eab308" />
          <StatCard label="In Progress" value={counts.in_progress} icon={<div style={{ width: 20, height: 3, background: 'currentColor', borderRadius: 2 }} />} color="#f97316" />
          <StatCard label="Resolved" value={counts.resolved} icon={<div style={{ width: 20, height: 20, borderRadius: '50%', background: 'currentColor' }} />} color="#22c55e" />
        </div>

        {/* Filters */}
        <div style={{
          background: 'white', border: '1px solid #e2e8f0', borderRadius: 10,
          padding: '14px 16px', marginBottom: 16,
          display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap',
        }}>
          <div style={{ position: 'relative', flex: '1 1 200px', minWidth: 180 }}>
            <Search size={14} style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
            <input
              id="student-search"
              placeholder="Search by title, building, ID..."
              value={search} onChange={e => setSearch(e.target.value)}
              style={{ width: '100%', paddingLeft: 32, paddingRight: 12, paddingTop: 8, paddingBottom: 8, border: '1.5px solid #e2e8f0', borderRadius: 8, fontSize: 14, outline: 'none', fontFamily: 'inherit' }}
            />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
            <Filter size={14} color="#94a3b8" />
            <select id="student-status-filter" value={filterStatus} onChange={e => setFilterStatus(e.target.value as IssueStatus | 'all')}
              style={{ padding: '7px 12px', border: '1.5px solid #e2e8f0', borderRadius: 8, fontSize: 13, outline: 'none', fontFamily: 'inherit', background: 'white' }}>
              <option value="all">All Statuses</option>
              {(['open', 'in_progress', 'resolved', 'closed'] as IssueStatus[]).map(s => (
                <option key={s} value={s}>{STATUS_LABELS[s]}</option>
              ))}
            </select>
            <select id="student-priority-filter" value={filterPriority} onChange={e => setFilterPriority(e.target.value as IssuePriority | 'all')}
              style={{ padding: '7px 12px', border: '1.5px solid #e2e8f0', borderRadius: 8, fontSize: 13, outline: 'none', fontFamily: 'inherit', background: 'white' }}>
              <option value="all">All Priorities</option>
              {(['low', 'medium', 'high', 'critical'] as IssuePriority[]).map(p => (
                <option key={p} value={p}>{PRIORITY_LABELS[p]}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Issue Table */}
        <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: 12, overflow: 'hidden' }}>
          {filtered.length === 0 ? (
            <EmptyState
              icon={<ClipboardList size={40} />}
              title={myIssues.length === 0 ? 'No issues reported yet' : 'No matching issues'}
              message={myIssues.length === 0 ? 'Submit your first campus issue report using the button above.' : 'Try adjusting your search or filters.'}
              action={myIssues.length === 0 ? (
                <Link to="/report"><Button variant="primary">Report an Issue</Button></Link>
              ) : undefined}
            />
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
                <thead>
                  <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                    {['Issue ID', 'Title', 'Category', 'Building', 'Priority', 'Status', 'Reported', ''].map(h => (
                      <th key={h} style={{ padding: '10px 14px', textAlign: 'left', fontSize: 12, fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.04em', whiteSpace: 'nowrap' }}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((issue, idx) => (
                    <tr key={issue.id} style={{ borderBottom: idx < filtered.length - 1 ? '1px solid #f1f5f9' : 'none', transition: 'background 0.1s' }}
                      onMouseEnter={e => (e.currentTarget.style.background = '#f8fafc')}
                      onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                    >
                      <td style={{ padding: '12px 14px', fontWeight: 600, color: '#2563eb', whiteSpace: 'nowrap' }}>{issue.id}</td>
                      <td style={{ padding: '12px 14px', color: '#0f172a', maxWidth: 240 }}>
                        <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{issue.title}</div>
                      </td>
                      <td style={{ padding: '12px 14px', color: '#475569', whiteSpace: 'nowrap' }}>{CATEGORY_LABELS[issue.category]}</td>
                      <td style={{ padding: '12px 14px', color: '#475569', whiteSpace: 'nowrap' }}>{issue.building}</td>
                      <td style={{ padding: '12px 14px' }}><PriorityBadge priority={issue.priority} /></td>
                      <td style={{ padding: '12px 14px' }}><StatusBadge status={issue.status} /></td>
                      <td style={{ padding: '12px 14px', color: '#64748b', whiteSpace: 'nowrap', fontSize: 13 }}>
                        <span title={formatDate(issue.createdAt)}>{timeAgo(issue.createdAt)}</span>
                      </td>
                      <td style={{ padding: '12px 14px' }}>
                        <Link to={`/issues/${issue.id}`} style={{ textDecoration: 'none' }}>
                          <Button variant="ghost" size="sm" style={{ color: '#2563eb' }}>View</Button>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}
