import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';

export type Role = 'student' | 'faculty' | 'staff' | 'admin';
export type IssueStatus = 'open' | 'in_progress' | 'resolved' | 'closed';
export type IssuePriority = 'low' | 'medium' | 'high' | 'critical';
export type IssueCategory = 'electrical' | 'plumbing' | 'hvac' | 'structural' | 'it_network' | 'cleaning' | 'safety' | 'furniture' | 'other';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  department?: string;
  avatar?: string;
}

export interface IssueActivity {
  id: string;
  issueId: string;
  userId: string;
  userName: string;
  userRole: Role;
  type: 'status_change' | 'comment' | 'assignment' | 'priority_change' | 'created';
  content: string;
  timestamp: string;
}

export interface Issue {
  id: string;
  title: string;
  category: IssueCategory;
  description: string;
  building: string;
  location: string;
  status: IssueStatus;
  priority: IssuePriority;
  reportedBy: string;
  reportedByName: string;
  assignedTo?: string;
  assignedToName?: string;
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string;
  photoUrl?: string;
  activity: IssueActivity[];
}

export interface AppState {
  currentUser: User | null;
  users: User[];
  issues: Issue[];
  isAuthenticated: boolean;
}

interface AppContextValue extends AppState {
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  register: (data: RegisterData) => Promise<{ success: boolean; error?: string }>;
  createIssue: (data: CreateIssueData) => Promise<Issue>;
  updateIssueStatus: (issueId: string, status: IssueStatus, note: string) => void;
  updateIssuePriority: (issueId: string, priority: IssuePriority) => void;
  assignIssue: (issueId: string, staffId: string) => void;
  addComment: (issueId: string, content: string) => void;
  updateUserRole: (userId: string, role: Role) => void;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  role: Role;
  department?: string;
}

export interface CreateIssueData {
  title: string;
  category: IssueCategory;
  description: string;
  building: string;
  location: string;
  photoUrl?: string;
}

const SEED_USERS: User[] = [
  { id: 'u1', name: 'Alex Johnson', email: 'student@campus.edu', role: 'student', department: 'Computer Science' },
  { id: 'u2', name: 'Dr. Sarah Mitchell', email: 'faculty@campus.edu', role: 'faculty', department: 'Physics' },
  { id: 'u3', name: 'Mike Torres', email: 'staff@campus.edu', role: 'staff', department: 'Maintenance' },
  { id: 'u4', name: 'Linda Chen', email: 'admin@campus.edu', role: 'admin', department: 'Facilities Administration' },
];

const SEED_ISSUES: Issue[] = [
  {
    id: 'ISS-001', title: 'Leaking faucet in men\'s restroom', category: 'plumbing',
    description: 'The faucet in the second stall of the men\'s restroom on the 2nd floor has been dripping continuously for three days. Water is pooling on the floor creating a slip hazard.',
    building: 'Science Hall', location: '2nd Floor Men\'s Restroom', status: 'in_progress', priority: 'high',
    reportedBy: 'u1', reportedByName: 'Alex Johnson', assignedTo: 'u3', assignedToName: 'Mike Torres',
    createdAt: '2026-10-10T09:00:00Z', updatedAt: '2026-10-12T14:30:00Z',
    activity: [
      { id: 'a1', issueId: 'ISS-001', userId: 'u1', userName: 'Alex Johnson', userRole: 'student', type: 'created', content: 'Issue reported.', timestamp: '2026-10-10T09:00:00Z' },
      { id: 'a2', issueId: 'ISS-001', userId: 'u4', userName: 'Linda Chen', userRole: 'admin', type: 'assignment', content: 'Assigned to Mike Torres.', timestamp: '2026-10-10T11:00:00Z' },
      { id: 'a3', issueId: 'ISS-001', userId: 'u3', userName: 'Mike Torres', userRole: 'staff', type: 'status_change', content: 'Status changed to In Progress. Parts ordered, repair scheduled for tomorrow.', timestamp: '2026-10-12T14:30:00Z' },
    ]
  },
  {
    id: 'ISS-002', title: 'Projector not working in Room 204', category: 'it_network',
    description: 'The ceiling-mounted projector in Room 204 displays a distorted image. It has been an issue since Monday morning. Lectures are being disrupted.',
    building: 'Engineering Building', location: 'Room 204', status: 'open', priority: 'medium',
    reportedBy: 'u2', reportedByName: 'Dr. Sarah Mitchell',
    createdAt: '2026-10-13T08:15:00Z', updatedAt: '2026-10-13T08:15:00Z',
    activity: [
      { id: 'a4', issueId: 'ISS-002', userId: 'u2', userName: 'Dr. Sarah Mitchell', userRole: 'faculty', type: 'created', content: 'Issue reported.', timestamp: '2026-10-13T08:15:00Z' },
    ]
  },
  {
    id: 'ISS-003', title: 'Broken outdoor bench near Library entrance', category: 'structural',
    description: 'One of the wooden benches near the main library entrance has a broken slat. There is a risk of injury to students who sit on it.',
    building: 'Library', location: 'Main Entrance, Outdoor Area', status: 'open', priority: 'low',
    reportedBy: 'u1', reportedByName: 'Alex Johnson',
    createdAt: '2026-10-11T16:45:00Z', updatedAt: '2026-10-11T16:45:00Z',
    activity: [
      { id: 'a5', issueId: 'ISS-003', userId: 'u1', userName: 'Alex Johnson', userRole: 'student', type: 'created', content: 'Issue reported.', timestamp: '2026-10-11T16:45:00Z' },
    ]
  },
  {
    id: 'ISS-004', title: 'HVAC not cooling Lecture Hall A', category: 'hvac',
    description: 'The air conditioning in Lecture Hall A has stopped working. The temperature is uncomfortable for students and faculty, especially during afternoon sessions.',
    building: 'Main Academic Block', location: 'Lecture Hall A, Ground Floor', status: 'resolved', priority: 'critical',
    reportedBy: 'u2', reportedByName: 'Dr. Sarah Mitchell', assignedTo: 'u3', assignedToName: 'Mike Torres',
    createdAt: '2026-10-08T10:00:00Z', updatedAt: '2026-10-09T17:00:00Z', resolvedAt: '2026-10-09T17:00:00Z',
    activity: [
      { id: 'a6', issueId: 'ISS-004', userId: 'u2', userName: 'Dr. Sarah Mitchell', userRole: 'faculty', type: 'created', content: 'Issue reported.', timestamp: '2026-10-08T10:00:00Z' },
      { id: 'a7', issueId: 'ISS-004', userId: 'u4', userName: 'Linda Chen', userRole: 'admin', type: 'priority_change', content: 'Priority escalated to Critical.', timestamp: '2026-10-08T10:30:00Z' },
      { id: 'a8', issueId: 'ISS-004', userId: 'u3', userName: 'Mike Torres', userRole: 'staff', type: 'status_change', content: 'Repaired compressor unit. HVAC system fully operational.', timestamp: '2026-10-09T17:00:00Z' },
    ]
  },
  {
    id: 'ISS-005', title: 'Flickering lights in Computer Lab 3', category: 'electrical',
    description: 'Several fluorescent lights in Computer Lab 3 have been flickering for the past week. This is causing eye strain for students.',
    building: 'IT Block', location: 'Computer Lab 3, 1st Floor', status: 'in_progress', priority: 'medium',
    reportedBy: 'u1', reportedByName: 'Alex Johnson', assignedTo: 'u3', assignedToName: 'Mike Torres',
    createdAt: '2026-10-07T14:20:00Z', updatedAt: '2026-10-13T09:00:00Z',
    activity: [
      { id: 'a9', issueId: 'ISS-005', userId: 'u1', userName: 'Alex Johnson', userRole: 'student', type: 'created', content: 'Issue reported.', timestamp: '2026-10-07T14:20:00Z' },
      { id: 'a10', issueId: 'ISS-005', userId: 'u3', userName: 'Mike Torres', userRole: 'staff', type: 'status_change', content: 'Ballasts need replacement. Replacement parts on order.', timestamp: '2026-10-13T09:00:00Z' },
    ]
  },
];

const AppContext = createContext<AppContextValue | null>(null);

function generateId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [users, setUsers] = useState<User[]>(SEED_USERS);
  const [issues, setIssues] = useState<Issue[]>(SEED_ISSUES);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const login = useCallback(async (email: string, _password: string): Promise<{ success: boolean; error?: string }> => {
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (!user) return { success: false, error: 'No account found with this email address.' };
    setCurrentUser(user);
    setIsAuthenticated(true);
    return { success: true };
  }, [users]);

  const logout = useCallback(() => {
    setCurrentUser(null);
    setIsAuthenticated(false);
  }, []);

  const register = useCallback(async (data: RegisterData): Promise<{ success: boolean; error?: string }> => {
    if (users.find(u => u.email.toLowerCase() === data.email.toLowerCase())) {
      return { success: false, error: 'An account with this email already exists.' };
    }
    const newUser: User = {
      id: generateId('u'),
      name: data.name,
      email: data.email,
      role: data.role,
      department: data.department,
    };
    setUsers(prev => [...prev, newUser]);
    setCurrentUser(newUser);
    setIsAuthenticated(true);
    return { success: true };
  }, [users]);

  const createIssue = useCallback(async (data: CreateIssueData): Promise<Issue> => {
    if (!currentUser) throw new Error('Not authenticated');
    const now = new Date().toISOString();
    const id = `ISS-${String(issues.length + 1).padStart(3, '0')}`;
    const newIssue: Issue = {
      id,
      ...data,
      status: 'open',
      priority: 'medium',
      reportedBy: currentUser.id,
      reportedByName: currentUser.name,
      createdAt: now,
      updatedAt: now,
      activity: [
        {
          id: generateId('a'),
          issueId: id,
          userId: currentUser.id,
          userName: currentUser.name,
          userRole: currentUser.role,
          type: 'created',
          content: 'Issue reported.',
          timestamp: now,
        }
      ]
    };
    setIssues(prev => [newIssue, ...prev]);
    return newIssue;
  }, [currentUser, issues.length]);

  const updateIssueStatus = useCallback((issueId: string, status: IssueStatus, note: string) => {
    if (!currentUser) return;
    const now = new Date().toISOString();
    setIssues(prev => prev.map(issue => {
      if (issue.id !== issueId) return issue;
      const activity: IssueActivity = {
        id: generateId('a'),
        issueId,
        userId: currentUser.id,
        userName: currentUser.name,
        userRole: currentUser.role,
        type: 'status_change',
        content: note || `Status changed to ${status.replace('_', ' ')}.`,
        timestamp: now,
      };
      return {
        ...issue,
        status,
        updatedAt: now,
        resolvedAt: status === 'resolved' ? now : issue.resolvedAt,
        activity: [...issue.activity, activity],
      };
    }));
  }, [currentUser]);

  const updateIssuePriority = useCallback((issueId: string, priority: IssuePriority) => {
    if (!currentUser) return;
    const now = new Date().toISOString();
    setIssues(prev => prev.map(issue => {
      if (issue.id !== issueId) return issue;
      const activity: IssueActivity = {
        id: generateId('a'),
        issueId,
        userId: currentUser.id,
        userName: currentUser.name,
        userRole: currentUser.role,
        type: 'priority_change',
        content: `Priority changed to ${priority}.`,
        timestamp: now,
      };
      return { ...issue, priority, updatedAt: now, activity: [...issue.activity, activity] };
    }));
  }, [currentUser]);

  const assignIssue = useCallback((issueId: string, staffId: string) => {
    if (!currentUser) return;
    const now = new Date().toISOString();
    const staffUser = users.find(u => u.id === staffId);
    if (!staffUser) return;
    setIssues(prev => prev.map(issue => {
      if (issue.id !== issueId) return issue;
      const activity: IssueActivity = {
        id: generateId('a'),
        issueId,
        userId: currentUser.id,
        userName: currentUser.name,
        userRole: currentUser.role,
        type: 'assignment',
        content: `Assigned to ${staffUser.name}.`,
        timestamp: now,
      };
      return {
        ...issue,
        assignedTo: staffId,
        assignedToName: staffUser.name,
        updatedAt: now,
        activity: [...issue.activity, activity],
      };
    }));
  }, [currentUser, users]);

  const addComment = useCallback((issueId: string, content: string) => {
    if (!currentUser) return;
    const now = new Date().toISOString();
    setIssues(prev => prev.map(issue => {
      if (issue.id !== issueId) return issue;
      const activity: IssueActivity = {
        id: generateId('a'),
        issueId,
        userId: currentUser.id,
        userName: currentUser.name,
        userRole: currentUser.role,
        type: 'comment',
        content,
        timestamp: now,
      };
      return { ...issue, updatedAt: now, activity: [...issue.activity, activity] };
    }));
  }, [currentUser]);

  const updateUserRole = useCallback((userId: string, role: Role) => {
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, role } : u));
  }, []);

  return (
    <AppContext.Provider value={{
      currentUser, users, issues, isAuthenticated,
      login, logout, register, createIssue, updateIssueStatus,
      updateIssuePriority, assignIssue, addComment, updateUserRole,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
