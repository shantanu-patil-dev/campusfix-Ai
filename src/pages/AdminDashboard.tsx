import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import {
  Users,
  Building2,
  ClipboardList,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Search,
  Filter,
  ArrowUpRight,
  UserCheck,
  Check,
  Shield
} from 'lucide-react'
import { useApp } from '../context/AppContext'
import type { IssueStatus, IssuePriority, Role } from '../context/AppContext'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { PriorityBadge, StatCard, EmptyState, Button, Card } from '../components/ui'
import { formatDate, timeAgo, CATEGORY_LABELS, STATUS_LABELS, PRIORITY_LABELS, ROLE_LABELS, BUILDINGS } from '../utils/helpers'

export default function AdminDashboard() {
  const {
    currentUser,
    users,
    issues,
    assignIssue,
    updateIssueStatus,
    updateIssuePriority,
    updateUserRole
  } = useApp()

  const [activeTab, setActiveTab] = useState<'analytics' | 'issues' | 'users' | 'locations'>('analytics')

  // Issue Management Filters
  const [issueSearch, setIssueSearch] = useState('')
  const [issueStatusFilter, setIssueStatusFilter] = useState<IssueStatus | 'all'>('all')
  const [issuePriorityFilter, setIssuePriorityFilter] = useState<IssuePriority | 'all'>('all')
  const [issueBuildingFilter, setIssueBuildingFilter] = useState<string>('all')
  const [issueCategoryFilter, setIssueCategoryFilter] = useState<string>('all')

  // User Management Filters
  const [userSearch, setUserSearch] = useState('')
  const [userRoleFilter, setUserRoleFilter] = useState<Role | 'all'>('all')

  // Feedback notifications
  const [actionNotice, setActionNotice] = useState<string | null>(null)

  function showNotice(msg: string) {
    setActionNotice(msg)
    setTimeout(() => setActionNotice(null), 3000)
  }

  // Staff members list
  const staffMembers = useMemo(() => users.filter(u => u.role === 'staff'), [users])

  // Real Analytics calculations
  const totalCount = issues.length
  const openCount = useMemo(() => issues.filter(i => i.status === 'open').length, [issues])
  const inProgressCount = useMemo(() => issues.filter(i => i.status === 'in_progress').length, [issues])
  const resolvedCount = useMemo(() => issues.filter(i => i.status === 'resolved' || i.status === 'closed').length, [issues])
  const unassignedCount = useMemo(() => issues.filter(i => !i.assignedTo).length, [issues])
  const urgentCount = useMemo(
    () => issues.filter(i => (i.priority === 'critical' || i.priority === 'high') && i.status !== 'resolved' && i.status !== 'closed').length,
    [issues]
  )

  // Real category breakdown
  const categoryStats = useMemo(() => {
    const map = new Map<string, number>()
    issues.forEach(i => {
      map.set(i.category, (map.get(i.category) || 0) + 1)
    })
    return Array.from(map.entries()).map(([cat, count]) => ({
      category: cat,
      label: CATEGORY_LABELS[cat as keyof typeof CATEGORY_LABELS] || cat,
      count,
      percentage: totalCount > 0 ? Math.round((count / totalCount) * 100) : 0
    })).sort((a, b) => b.count - a.count)
  }, [issues, totalCount])

  // Real priority breakdown
  const priorityStats = useMemo(() => {
    const priorities: IssuePriority[] = ['critical', 'high', 'medium', 'low']
    return priorities.map(p => ({
      priority: p,
      label: PRIORITY_LABELS[p],
      count: issues.filter(i => i.priority === p).length,
      percentage: totalCount > 0 ? Math.round((issues.filter(i => i.priority === p).length / totalCount) * 100) : 0
    }))
  }, [issues, totalCount])

  // Real building breakdown
  const buildingStats = useMemo(() => {
    return BUILDINGS.map(b => {
      const bIssues = issues.filter(i => i.building === b)
      const open = bIssues.filter(i => i.status === 'open' || i.status === 'in_progress').length
      const resolved = bIssues.filter(i => i.status === 'resolved' || i.status === 'closed').length
      return {
        building: b,
        total: bIssues.length,
        active: open,
        resolved
      }
    }).sort((a, b) => b.total - a.total)
  }, [issues])

  // Filtered Issues for table
  const filteredIssues = useMemo(() => {
    let list = issues
    if (issueSearch.trim()) {
      const q = issueSearch.toLowerCase()
      list = list.filter(i =>
        i.title.toLowerCase().includes(q) ||
        i.id.toLowerCase().includes(q) ||
        i.building.toLowerCase().includes(q) ||
        i.location.toLowerCase().includes(q) ||
        i.reportedByName.toLowerCase().includes(q)
      )
    }
    if (issueStatusFilter !== 'all') list = list.filter(i => i.status === issueStatusFilter)
    if (issuePriorityFilter !== 'all') list = list.filter(i => i.priority === issuePriorityFilter)
    if (issueBuildingFilter !== 'all') list = list.filter(i => i.building === issueBuildingFilter)
    if (issueCategoryFilter !== 'all') list = list.filter(i => i.category === issueCategoryFilter)
    return list
  }, [issues, issueSearch, issueStatusFilter, issuePriorityFilter, issueBuildingFilter, issueCategoryFilter])

  // Filtered Users for table
  const filteredUsers = useMemo(() => {
    let list = users
    if (userSearch.trim()) {
      const q = userSearch.toLowerCase()
      list = list.filter(u =>
        u.name.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        (u.department && u.department.toLowerCase().includes(q))
      )
    }
    if (userRoleFilter !== 'all') list = list.filter(u => u.role === userRoleFilter)
    return list
  }, [users, userSearch, userRoleFilter])

  function handleAssign(issueId: string, staffId: string) {
    assignIssue(issueId, staffId)
    const staffName = users.find(u => u.id === staffId)?.name || 'staff'
    showNotice(`Assigned ticket ${issueId} to ${staffName}.`)
  }

  function handleStatusChange(issueId: string, newStatus: IssueStatus) {
    updateIssueStatus(issueId, newStatus, `Status updated to ${STATUS_LABELS[newStatus]} by administrator`)
    showNotice(`Ticket ${issueId} updated to ${STATUS_LABELS[newStatus]}.`)
  }

  function handlePriorityChange(issueId: string, newPriority: IssuePriority) {
    updateIssuePriority(issueId, newPriority)
    showNotice(`Ticket ${issueId} priority set to ${PRIORITY_LABELS[newPriority]}.`)
  }

  function handleRoleChange(userId: string, newRole: Role) {
    updateUserRole(userId, newRole)
    const targetUser = users.find(u => u.id === userId)
    showNotice(`Updated role for ${targetUser?.name || 'user'} to ${ROLE_LABELS[newRole]}.`)
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', display: 'flex', flexDirection: 'column' }}>
      <Navbar />

      <main style={{ flex: 1, maxWidth: 1200, margin: '0 auto', width: '100%', padding: '32px 24px' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 28, flexWrap: 'wrap', gap: 16 }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '4px 10px', background: '#e2e8f0', borderRadius: 6, fontSize: 12, fontWeight: 600, color: '#334155', marginBottom: 8 }}>
              <Shield size={13} /> Institutional Administration
            </div>
            <h1 style={{ fontSize: 26, fontWeight: 800, color: '#0f172a', marginBottom: 4 }}>
              Facilities Administration Console
            </h1>
            <p style={{ color: '#64748b', fontSize: 14 }}>
              Logged in as {currentUser?.name}. Manage campus-wide tickets, staff dispatches, account roles, and facility metrics.
            </p>
          </div>

          {/* Tab Navigation */}
          <div style={{ display: 'flex', gap: 6, background: '#e2e8f0', padding: 4, borderRadius: 8, flexWrap: 'wrap' }}>
            <button
              onClick={() => setActiveTab('analytics')}
              style={{
                display: 'flex', alignItems: 'center', gap: 6,
                padding: '8px 14px', borderRadius: 6, border: 'none', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit',
                background: activeTab === 'analytics' ? '#ffffff' : 'transparent',
                color: activeTab === 'analytics' ? '#0f2044' : '#475569',
                boxShadow: activeTab === 'analytics' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none'
              }}
            >
              <ClipboardList size={14} /> Real Analytics
            </button>
            <button
              onClick={() => setActiveTab('issues')}
              style={{
                display: 'flex', alignItems: 'center', gap: 6,
                padding: '8px 14px', borderRadius: 6, border: 'none', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit',
                background: activeTab === 'issues' ? '#ffffff' : 'transparent',
                color: activeTab === 'issues' ? '#0f2044' : '#475569',
                boxShadow: activeTab === 'issues' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none'
              }}
            >
              <Clock size={14} /> Issue Management ({issues.length})
            </button>
            <button
              onClick={() => setActiveTab('users')}
              style={{
                display: 'flex', alignItems: 'center', gap: 6,
                padding: '8px 14px', borderRadius: 6, border: 'none', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit',
                background: activeTab === 'users' ? '#ffffff' : 'transparent',
                color: activeTab === 'users' ? '#0f2044' : '#475569',
                boxShadow: activeTab === 'users' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none'
              }}
            >
              <Users size={14} /> Users & Roles ({users.length})
            </button>
            <button
              onClick={() => setActiveTab('locations')}
              style={{
                display: 'flex', alignItems: 'center', gap: 6,
                padding: '8px 14px', borderRadius: 6, border: 'none', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit',
                background: activeTab === 'locations' ? '#ffffff' : 'transparent',
                color: activeTab === 'locations' ? '#0f2044' : '#475569',
                boxShadow: activeTab === 'locations' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none'
              }}
            >
              <Building2 size={14} /> Locations ({BUILDINGS.length})
            </button>
          </div>
        </div>

        {/* Global Action Banner */}
        {actionNotice && (
          <div style={{
            marginBottom: 20, padding: '12px 18px', background: '#dcfce7', border: '1px solid #86efac',
            borderRadius: 8, color: '#15803d', fontSize: 14, display: 'flex', alignItems: 'center', gap: 8
          }}>
            <Check size={16} /> {actionNotice}
          </div>
        )}

        {/* TAB 1: ANALYTICS & OVERVIEW */}
        {activeTab === 'analytics' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            {/* Real Stats Metrics */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 14 }}>
              <StatCard label="Total Tickets" value={totalCount} icon={<ClipboardList size={20} />} color="#2563eb" />
              <StatCard label="Open" value={openCount} icon={<Clock size={20} />} color="#0284c7" />
              <StatCard label="In Progress" value={inProgressCount} icon={<Clock size={20} />} color="#d97706" />
              <StatCard label="Resolved" value={resolvedCount} icon={<CheckCircle2 size={20} />} color="#16a34a" />
              <StatCard label="Unassigned" value={unassignedCount} icon={<UserCheck size={20} />} color="#7c3aed" />
              <StatCard label="Critical / High" value={urgentCount} icon={<AlertTriangle size={20} />} color="#dc2626" />
            </div>

            {/* Grid of Breakdowns */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: 20 }}>
              {/* Category Breakdown */}
              <Card>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                  <h3 style={{ fontSize: 16, fontWeight: 700, color: '#0f172a' }}>Issue Distribution by Category</h3>
                  <span style={{ fontSize: 12, color: '#64748b' }}>Actual Counts</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {categoryStats.map(item => (
                    <div key={item.category}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 5 }}>
                        <span style={{ fontWeight: 600, color: '#334155' }}>{item.label}</span>
                        <span style={{ color: '#64748b' }}>{item.count} tickets ({item.percentage}%)</span>
                      </div>
                      <div style={{ height: 7, background: '#f1f5f9', borderRadius: 4, overflow: 'hidden' }}>
                        <div style={{ width: `${item.percentage}%`, height: '100%', background: '#2563eb', borderRadius: 4 }} />
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Priority Distribution */}
              <Card>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                  <h3 style={{ fontSize: 16, fontWeight: 700, color: '#0f172a' }}>Priority Severity Breakdown</h3>
                  <span style={{ fontSize: 12, color: '#64748b' }}>Actual Counts</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  {priorityStats.map(item => {
                    const barColor =
                      item.priority === 'critical' ? '#dc2626' :
                      item.priority === 'high' ? '#ea580c' :
                      item.priority === 'medium' ? '#2563eb' : '#64748b'
                    return (
                      <div key={item.priority}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 5 }}>
                          <span style={{ fontWeight: 600, color: '#334155' }}>{item.label}</span>
                          <span style={{ color: '#64748b' }}>{item.count} tickets ({item.percentage}%)</span>
                        </div>
                        <div style={{ height: 7, background: '#f1f5f9', borderRadius: 4, overflow: 'hidden' }}>
                          <div style={{ width: `${item.percentage}%`, height: '100%', background: barColor, borderRadius: 4 }} />
                        </div>
                      </div>
                    )
                  })}
                </div>
              </Card>
            </div>

            {/* Unassigned Issues Quick Action Queue */}
            <Card>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, flexWrap: 'wrap', gap: 10 }}>
                <div>
                  <h3 style={{ fontSize: 16, fontWeight: 700, color: '#0f172a' }}>Unassigned Tickets Queue ({unassignedCount})</h3>
                  <p style={{ fontSize: 13, color: '#64748b' }}>Directly assign maintenance technicians to open work orders.</p>
                </div>
                <Button variant="secondary" size="sm" onClick={() => setActiveTab('issues')}>
                  View All Tickets
                </Button>
              </div>

              {unassignedCount === 0 ? (
                <div style={{ padding: '24px 0', textAlign: 'center', color: '#16a34a', fontSize: 14, fontWeight: 500 }}>
                  <CheckCircle2 size={24} style={{ display: 'block', margin: '0 auto 8px', color: '#16a34a' }} />
                  All current campus tickets have been assigned to maintenance staff.
                </div>
              ) : (
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                    <thead>
                      <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                        <th style={{ padding: '10px 12px', textAlign: 'left', fontWeight: 600, color: '#64748b', fontSize: 12 }}>ID</th>
                        <th style={{ padding: '10px 12px', textAlign: 'left', fontWeight: 600, color: '#64748b', fontSize: 12 }}>Title & Location</th>
                        <th style={{ padding: '10px 12px', textAlign: 'left', fontWeight: 600, color: '#64748b', fontSize: 12 }}>Priority</th>
                        <th style={{ padding: '10px 12px', textAlign: 'left', fontWeight: 600, color: '#64748b', fontSize: 12 }}>Dispatch To Staff</th>
                        <th style={{ padding: '10px 12px', textAlign: 'right', fontWeight: 600, color: '#64748b', fontSize: 12 }}>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {issues.filter(i => !i.assignedTo).map((issue, idx) => (
                        <tr key={issue.id} style={{ borderBottom: idx < unassignedCount - 1 ? '1px solid #f1f5f9' : 'none' }}>
                          <td style={{ padding: '10px 12px', fontWeight: 700, color: '#0f2044' }}>{issue.id}</td>
                          <td style={{ padding: '10px 12px' }}>
                            <div style={{ fontWeight: 600, color: '#0f172a' }}>{issue.title}</div>
                            <div style={{ fontSize: 12, color: '#64748b' }}>{issue.building} - {issue.location}</div>
                          </td>
                          <td style={{ padding: '10px 12px' }}><PriorityBadge priority={issue.priority} /></td>
                          <td style={{ padding: '10px 12px' }}>
                            <select
                              id={`dispatch-${issue.id}`}
                              defaultValue=""
                              onChange={e => {
                                if (e.target.value) handleAssign(issue.id, e.target.value)
                              }}
                              style={{ padding: '6px 10px', borderRadius: 6, border: '1.5px solid #e2e8f0', fontSize: 13, background: 'white', fontFamily: 'inherit' }}
                            >
                              <option value="" disabled>Select technician...</option>
                              {staffMembers.map(s => (
                                <option key={s.id} value={s.id}>{s.name} ({s.department || 'Maintenance'})</option>
                              ))}
                            </select>
                          </td>
                          <td style={{ padding: '10px 12px', textAlign: 'right' }}>
                            <Link to={`/issues/${issue.id}`} style={{ textDecoration: 'none' }}>
                              <Button variant="ghost" size="sm" style={{ color: '#2563eb' }}>Details</Button>
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </Card>
          </div>
        )}

        {/* TAB 2: COMPLETE ISSUE MANAGEMENT */}
        {activeTab === 'issues' && (
          <div>
            {/* Filter controls */}
            <div style={{
              background: 'white', border: '1px solid #e2e8f0', borderRadius: 10,
              padding: '14px 16px', marginBottom: 16,
              display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap',
            }}>
              <div style={{ position: 'relative', flex: '1 1 220px', minWidth: 200 }}>
                <Search size={14} style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                <input
                  id="admin-issue-search"
                  placeholder="Search by ID, title, building, reporter..."
                  value={issueSearch}
                  onChange={e => setIssueSearch(e.target.value)}
                  style={{
                    width: '100%', paddingLeft: 32, paddingRight: 12, paddingTop: 8, paddingBottom: 8,
                    border: '1.5px solid #e2e8f0', borderRadius: 8, fontSize: 13, outline: 'none', fontFamily: 'inherit'
                  }}
                />
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                <Filter size={14} color="#94a3b8" />

                <select
                  id="admin-issue-status-filter"
                  value={issueStatusFilter}
                  onChange={e => setIssueStatusFilter(e.target.value as IssueStatus | 'all')}
                  style={{ padding: '7px 10px', border: '1.5px solid #e2e8f0', borderRadius: 8, fontSize: 13, outline: 'none', fontFamily: 'inherit', background: 'white' }}
                >
                  <option value="all">All Statuses</option>
                  {(['open', 'in_progress', 'resolved', 'closed'] as IssueStatus[]).map(s => (
                    <option key={s} value={s}>{STATUS_LABELS[s]}</option>
                  ))}
                </select>

                <select
                  id="admin-issue-priority-filter"
                  value={issuePriorityFilter}
                  onChange={e => setIssuePriorityFilter(e.target.value as IssuePriority | 'all')}
                  style={{ padding: '7px 10px', border: '1.5px solid #e2e8f0', borderRadius: 8, fontSize: 13, outline: 'none', fontFamily: 'inherit', background: 'white' }}
                >
                  <option value="all">All Priorities</option>
                  {(['low', 'medium', 'high', 'critical'] as IssuePriority[]).map(p => (
                    <option key={p} value={p}>{PRIORITY_LABELS[p]}</option>
                  ))}
                </select>

                <select
                  id="admin-issue-building-filter"
                  value={issueBuildingFilter}
                  onChange={e => setIssueBuildingFilter(e.target.value)}
                  style={{ padding: '7px 10px', border: '1.5px solid #e2e8f0', borderRadius: 8, fontSize: 13, outline: 'none', fontFamily: 'inherit', background: 'white', maxWidth: 160 }}
                >
                  <option value="all">All Buildings</option>
                  {BUILDINGS.map(b => (
                    <option key={b} value={b}>{b}</option>
                  ))}
                </select>

                <select
                  id="admin-issue-category-filter"
                  value={issueCategoryFilter}
                  onChange={e => setIssueCategoryFilter(e.target.value)}
                  style={{ padding: '7px 10px', border: '1.5px solid #e2e8f0', borderRadius: 8, fontSize: 13, outline: 'none', fontFamily: 'inherit', background: 'white' }}
                >
                  <option value="all">All Categories</option>
                  {Object.entries(CATEGORY_LABELS).map(([k, label]) => (
                    <option key={k} value={k}>{label}</option>
                  ))}
                </select>

                {(issueSearch || issueStatusFilter !== 'all' || issuePriorityFilter !== 'all' || issueBuildingFilter !== 'all' || issueCategoryFilter !== 'all') && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setIssueSearch('')
                      setIssueStatusFilter('all')
                      setIssuePriorityFilter('all')
                      setIssueBuildingFilter('all')
                      setIssueCategoryFilter('all')
                    }}
                    style={{ fontSize: 12, color: '#64748b' }}
                  >
                    Reset
                  </Button>
                )}
              </div>
            </div>

            {/* Table */}
            <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: 12, overflow: 'hidden' }}>
              {filteredIssues.length === 0 ? (
                <EmptyState
                  icon={<ClipboardList size={40} />}
                  title="No issues found"
                  message="No tickets matched your current search and filter settings."
                />
              ) : (
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                    <thead>
                      <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                        <th style={{ padding: '12px 14px', textAlign: 'left', fontWeight: 600, color: '#64748b', fontSize: 12 }}>ID</th>
                        <th style={{ padding: '12px 14px', textAlign: 'left', fontWeight: 600, color: '#64748b', fontSize: 12 }}>Title & Location</th>
                        <th style={{ padding: '12px 14px', textAlign: 'left', fontWeight: 600, color: '#64748b', fontSize: 12 }}>Status</th>
                        <th style={{ padding: '12px 14px', textAlign: 'left', fontWeight: 600, color: '#64748b', fontSize: 12 }}>Priority</th>
                        <th style={{ padding: '12px 14px', textAlign: 'left', fontWeight: 600, color: '#64748b', fontSize: 12 }}>Assigned Staff</th>
                        <th style={{ padding: '12px 14px', textAlign: 'left', fontWeight: 600, color: '#64748b', fontSize: 12 }}>Reported</th>
                        <th style={{ padding: '12px 14px', textAlign: 'right', fontWeight: 600, color: '#64748b', fontSize: 12 }}>View</th>
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
                          <td style={{ padding: '12px 14px', maxWidth: 320 }}>
                            <div style={{ fontWeight: 600, color: '#0f172a', marginBottom: 2 }}>{issue.title}</div>
                            <div style={{ fontSize: 12, color: '#64748b' }}>
                              {issue.building} - {issue.location}
                            </div>
                          </td>
                          <td style={{ padding: '12px 14px' }}>
                            <select
                              id={`status-select-${issue.id}`}
                              value={issue.status}
                              onChange={e => handleStatusChange(issue.id, e.target.value as IssueStatus)}
                              style={{ padding: '5px 8px', borderRadius: 6, border: '1px solid #cbd5e1', fontSize: 12, background: 'white', fontFamily: 'inherit' }}
                            >
                              {(['open', 'in_progress', 'resolved', 'closed'] as IssueStatus[]).map(s => (
                                <option key={s} value={s}>{STATUS_LABELS[s]}</option>
                              ))}
                            </select>
                          </td>
                          <td style={{ padding: '12px 14px' }}>
                            <select
                              id={`priority-select-${issue.id}`}
                              value={issue.priority}
                              onChange={e => handlePriorityChange(issue.id, e.target.value as IssuePriority)}
                              style={{ padding: '5px 8px', borderRadius: 6, border: '1px solid #cbd5e1', fontSize: 12, background: 'white', fontFamily: 'inherit' }}
                            >
                              {(['low', 'medium', 'high', 'critical'] as IssuePriority[]).map(p => (
                                <option key={p} value={p}>{PRIORITY_LABELS[p]}</option>
                              ))}
                            </select>
                          </td>
                          <td style={{ padding: '12px 14px' }}>
                            <select
                              id={`assignee-select-${issue.id}`}
                              value={issue.assignedTo || ''}
                              onChange={e => {
                                if (e.target.value) handleAssign(issue.id, e.target.value)
                              }}
                              style={{ padding: '5px 8px', borderRadius: 6, border: '1px solid #cbd5e1', fontSize: 12, background: 'white', fontFamily: 'inherit', maxWidth: 170 }}
                            >
                              <option value="">(Unassigned)</option>
                              {staffMembers.map(s => (
                                <option key={s.id} value={s.id}>{s.name}</option>
                              ))}
                            </select>
                          </td>
                          <td style={{ padding: '12px 14px', color: '#64748b', fontSize: 12, whiteSpace: 'nowrap' }}>
                            <span title={formatDate(issue.createdAt)}>{timeAgo(issue.createdAt)}</span>
                          </td>
                          <td style={{ padding: '12px 14px', textAlign: 'right', whiteSpace: 'nowrap' }}>
                            <Link to={`/issues/${issue.id}`} style={{ textDecoration: 'none' }}>
                              <Button variant="ghost" size="sm" style={{ color: '#2563eb' }}>
                                <ArrowUpRight size={14} />
                              </Button>
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 3: USER & ROLE MANAGEMENT */}
        {activeTab === 'users' && (
          <div>
            <div style={{
              background: 'white', border: '1px solid #e2e8f0', borderRadius: 10,
              padding: '14px 16px', marginBottom: 16,
              display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap',
            }}>
              <div style={{ position: 'relative', flex: '1 1 240px', minWidth: 200 }}>
                <Search size={14} style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                <input
                  id="admin-user-search"
                  placeholder="Search user by name, email, department..."
                  value={userSearch}
                  onChange={e => setUserSearch(e.target.value)}
                  style={{
                    width: '100%', paddingLeft: 32, paddingRight: 12, paddingTop: 8, paddingBottom: 8,
                    border: '1.5px solid #e2e8f0', borderRadius: 8, fontSize: 13, outline: 'none', fontFamily: 'inherit'
                  }}
                />
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Filter size={14} color="#94a3b8" />
                <select
                  id="admin-user-role-filter"
                  value={userRoleFilter}
                  onChange={e => setUserRoleFilter(e.target.value as Role | 'all')}
                  style={{ padding: '7px 10px', border: '1.5px solid #e2e8f0', borderRadius: 8, fontSize: 13, outline: 'none', fontFamily: 'inherit', background: 'white' }}
                >
                  <option value="all">All Roles</option>
                  {(['student', 'faculty', 'staff', 'admin'] as Role[]).map(r => (
                    <option key={r} value={r}>{ROLE_LABELS[r]}</option>
                  ))}
                </select>
              </div>
            </div>

            <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: 12, overflow: 'hidden' }}>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                  <thead>
                    <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                      <th style={{ padding: '12px 14px', textAlign: 'left', fontWeight: 600, color: '#64748b', fontSize: 12 }}>User Name</th>
                      <th style={{ padding: '12px 14px', textAlign: 'left', fontWeight: 600, color: '#64748b', fontSize: 12 }}>Campus Email</th>
                      <th style={{ padding: '12px 14px', textAlign: 'left', fontWeight: 600, color: '#64748b', fontSize: 12 }}>Department</th>
                      <th style={{ padding: '12px 14px', textAlign: 'left', fontWeight: 600, color: '#64748b', fontSize: 12 }}>Current Role</th>
                      <th style={{ padding: '12px 14px', textAlign: 'left', fontWeight: 600, color: '#64748b', fontSize: 12 }}>Change Role</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map((user, idx) => {
                      const isSelf = user.id === currentUser?.id
                      return (
                        <tr
                          key={user.id}
                          style={{
                            borderBottom: idx < filteredUsers.length - 1 ? '1px solid #f1f5f9' : 'none',
                            transition: 'background 0.1s'
                          }}
                          onMouseEnter={e => (e.currentTarget.style.background = '#f8fafc')}
                          onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                        >
                          <td style={{ padding: '12px 14px', fontWeight: 600, color: '#0f172a' }}>
                            {user.name} {isSelf && <span style={{ fontSize: 11, color: '#2563eb', fontWeight: 700 }}>(You)</span>}
                          </td>
                          <td style={{ padding: '12px 14px', color: '#475569' }}>
                            {user.email}
                          </td>
                          <td style={{ padding: '12px 14px', color: '#64748b' }}>
                            {user.department || 'General'}
                          </td>
                          <td style={{ padding: '12px 14px' }}>
                            <span style={{
                              display: 'inline-block', padding: '3px 8px', borderRadius: 4, fontSize: 12, fontWeight: 600,
                              background: user.role === 'admin' ? '#eff6ff' : user.role === 'staff' ? '#fef3c7' : '#f1f5f9',
                              color: user.role === 'admin' ? '#1d4ed8' : user.role === 'staff' ? '#b45309' : '#334155'
                            }}>
                              {ROLE_LABELS[user.role]}
                            </span>
                          </td>
                          <td style={{ padding: '12px 14px' }}>
                            <select
                              id={`role-select-${user.id}`}
                              value={user.role}
                              disabled={isSelf}
                              onChange={e => handleRoleChange(user.id, e.target.value as Role)}
                              style={{
                                padding: '6px 10px', borderRadius: 6, border: '1.5px solid #cbd5e1',
                                fontSize: 12, background: isSelf ? '#f1f5f9' : 'white', fontFamily: 'inherit',
                                cursor: isSelf ? 'not-allowed' : 'pointer'
                              }}
                            >
                              {(['student', 'faculty', 'staff', 'admin'] as Role[]).map(r => (
                                <option key={r} value={r}>{ROLE_LABELS[r]}</option>
                              ))}
                            </select>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: CAMPUS LOCATIONS */}
        {activeTab === 'locations' && (
          <div>
            <div style={{ marginBottom: 16 }}>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: '#0f172a' }}>Campus Facilities & Building Workload</h3>
              <p style={{ fontSize: 13, color: '#64748b' }}>Real ticket workload and resolution statistics across official campus facilities.</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
              {buildingStats.map(b => (
                <Card key={b.building} style={{ padding: 20 }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 12 }}>
                    <div>
                      <h4 style={{ fontSize: 15, fontWeight: 700, color: '#0f172a' }}>{b.building}</h4>
                      <span style={{ fontSize: 12, color: '#64748b' }}>{b.total} Total Recorded Tickets</span>
                    </div>
                    <div style={{ width: 32, height: 32, borderRadius: 6, background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#2563eb' }}>
                      <Building2 size={16} />
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: 10, margin: '12px 0' }}>
                    <div style={{ flex: 1, background: '#f8fafc', padding: '8px 10px', borderRadius: 6 }}>
                      <div style={{ fontSize: 11, color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase' }}>Active</div>
                      <div style={{ fontSize: 16, fontWeight: 700, color: b.active > 0 ? '#ea580c' : '#64748b' }}>{b.active}</div>
                    </div>
                    <div style={{ flex: 1, background: '#f8fafc', padding: '8px 10px', borderRadius: 6 }}>
                      <div style={{ fontSize: 11, color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase' }}>Resolved</div>
                      <div style={{ fontSize: 16, fontWeight: 700, color: '#16a34a' }}>{b.resolved}</div>
                    </div>
                  </div>

                  <Button
                    variant="secondary"
                    size="sm"
                    style={{ width: '100%', marginTop: 6 }}
                    onClick={() => {
                      setIssueBuildingFilter(b.building)
                      setActiveTab('issues')
                    }}
                  >
                    View Tickets for {b.building}
                  </Button>
                </Card>
              ))}
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}
