import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const navConfig = {
  member: [
    { icon: '⬡', label: 'Dashboard',    path: '/member' },
    { icon: '📋', label: 'My Plans',     path: '/member/plans' },
    { icon: '✅', label: 'Attendance',   path: '/member/attendance' },
    { icon: '💳', label: 'Payments',     path: '/member/payments' },
    { icon: '🏋️', label: 'Workout Plan', path: '/member/workout' },
  ],
  trainer: [
    { icon: '⬡', label: 'Dashboard',     path: '/trainer' },
    { icon: '👥', label: 'My Members',    path: '/trainer/members' },
    { icon: '📝', label: 'Workout Plans', path: '/trainer/workout' },
  ],
  admin: [
    { icon: '⬡', label: 'Dashboard',  path: '/admin' },
    { icon: '👥', label: 'Members',    path: '/admin/members' },
    { icon: '🏃', label: 'Trainers',   path: '/admin/trainers' },
    { icon: '📦', label: 'Plans',      path: '/admin/plans' },
    { icon: '✅', label: 'Attendance', path: '/admin/attendance' },
    { icon: '💰', label: 'Revenue',    path: '/admin/revenue' },
  ],
}

export default function Sidebar() {
  const { user, logout } = useAuth()
  const navigate  = useNavigate()
  const location  = useLocation()
  const items     = navConfig[user?.role] || []
  const initials  = user?.name ? user.name.split(' ').map(w=>w[0]).join('').toUpperCase().slice(0,2) : 'U'

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        IRONFORGE
        <div className="sidebar-role">{user?.role} panel</div>
      </div>
      <nav className="sidebar-nav">
        {items.map(item => (
          <button key={item.path}
            className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
            onClick={() => navigate(item.path)}>
            <span className="nav-icon">{item.icon}</span>
            {item.label}
          </button>
        ))}
      </nav>
      <div className="sidebar-footer">
        <div className="sidebar-user">
          <div className="avatar">{initials}</div>
          <div className="user-info">
            <div className="name">{user?.name || user?.username}</div>
            <div className="role">{user?.role}</div>
          </div>
        </div>
        <button className="btn btn-outline btn-sm btn-block"
          style={{marginTop:12}} onClick={() => { logout(); navigate('/') }}>
          Logout
        </button>
      </div>
    </aside>
  )
}