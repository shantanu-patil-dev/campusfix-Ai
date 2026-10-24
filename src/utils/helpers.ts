import type { IssueCategory, IssuePriority, IssueStatus, Role } from '../context/AppContext';

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric'
  });
}

export function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric',
    hour: '2-digit', minute: '2-digit'
  });
}

export function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days}d ago`;
  return formatDate(iso);
}

export const STATUS_LABELS: Record<IssueStatus, string> = {
  open: 'Open',
  in_progress: 'In Progress',
  resolved: 'Resolved',
  closed: 'Closed',
};

export const STATUS_COLORS: Record<IssueStatus, { bg: string; text: string; border: string }> = {
  open: { bg: '#dbeafe', text: '#1d4ed8', border: '#bfdbfe' },
  in_progress: { bg: '#fef9c3', text: '#a16207', border: '#fde68a' },
  resolved: { bg: '#dcfce7', text: '#15803d', border: '#bbf7d0' },
  closed: { bg: '#f1f5f9', text: '#475569', border: '#e2e8f0' },
};

export const PRIORITY_LABELS: Record<IssuePriority, string> = {
  low: 'Low',
  medium: 'Medium',
  high: 'High',
  critical: 'Critical',
};

export const PRIORITY_COLORS: Record<IssuePriority, { bg: string; text: string; dot: string }> = {
  low: { bg: '#f1f5f9', text: '#475569', dot: '#94a3b8' },
  medium: { bg: '#dbeafe', text: '#1d4ed8', dot: '#3b82f6' },
  high: { bg: '#ffedd5', text: '#c2410c', dot: '#f97316' },
  critical: { bg: '#fee2e2', text: '#b91c1c', dot: '#ef4444' },
};

export const CATEGORY_LABELS: Record<IssueCategory, string> = {
  electrical: 'Electrical',
  plumbing: 'Plumbing',
  hvac: 'HVAC / Climate',
  structural: 'Structural / Furniture',
  it_network: 'IT / Network',
  cleaning: 'Cleaning / Sanitation',
  safety: 'Safety / Security',
  furniture: 'Furniture',
  other: 'Other',
};

export const ROLE_LABELS: Record<Role, string> = {
  student: 'Student',
  faculty: 'Faculty',
  staff: 'Maintenance Staff',
  admin: 'Administrator',
};

export const BUILDINGS = [
  'Main Academic Block',
  'Science Hall',
  'Engineering Building',
  'Library',
  'IT Block',
  'Student Center',
  'Sports Complex',
  'Administration Building',
  'Hostel Block A',
  'Hostel Block B',
  'Cafeteria',
];
