import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'

import Landing      from './pages/Landing'
import Login        from './pages/Login'
import Register     from './pages/Register'

import MemberDash     from './pages/member/Dashboard'
import MemberPlans    from './pages/member/Plans'
import MemberAttend   from './pages/member/Attendance'
import MemberPayments from './pages/member/Payments'
import MemberWorkout  from './pages/member/Workout'

import TrainerDash    from './pages/trainer/Dashboard'
import TrainerMembers from './pages/trainer/Members'
import TrainerWorkout from './pages/trainer/Workout'

import AdminDash      from './pages/admin/Dashboard'
import AdminMembers   from './pages/admin/Members'
import AdminTrainers  from './pages/admin/Trainers'
import AdminPlans     from './pages/admin/Plans'
import AdminAttend    from './pages/admin/Attendance'
import AdminRevenue   from './pages/admin/Revenue'

function ProtectedRoute({ children, role }) {
  const { user } = useAuth()
  if (!user) return <Navigate to="/login" replace />
  if (role && user.role !== role) return <Navigate to="/" replace />
  return children
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/"         element={<Landing />} />
          <Route path="/login"    element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route path="/member"             element={<ProtectedRoute role="member"><MemberDash /></ProtectedRoute>} />
          <Route path="/member/plans"       element={<ProtectedRoute role="member"><MemberPlans /></ProtectedRoute>} />
          <Route path="/member/attendance"  element={<ProtectedRoute role="member"><MemberAttend /></ProtectedRoute>} />
          <Route path="/member/payments"    element={<ProtectedRoute role="member"><MemberPayments /></ProtectedRoute>} />
          <Route path="/member/workout"     element={<ProtectedRoute role="member"><MemberWorkout /></ProtectedRoute>} />

          <Route path="/trainer"            element={<ProtectedRoute role="trainer"><TrainerDash /></ProtectedRoute>} />
          <Route path="/trainer/members"    element={<ProtectedRoute role="trainer"><TrainerMembers /></ProtectedRoute>} />
          <Route path="/trainer/workout"    element={<ProtectedRoute role="trainer"><TrainerWorkout /></ProtectedRoute>} />

          <Route path="/admin"              element={<ProtectedRoute role="admin"><AdminDash /></ProtectedRoute>} />
          <Route path="/admin/members"      element={<ProtectedRoute role="admin"><AdminMembers /></ProtectedRoute>} />
          <Route path="/admin/trainers"     element={<ProtectedRoute role="admin"><AdminTrainers /></ProtectedRoute>} />
          <Route path="/admin/plans"        element={<ProtectedRoute role="admin"><AdminPlans /></ProtectedRoute>} />
          <Route path="/admin/attendance"   element={<ProtectedRoute role="admin"><AdminAttend /></ProtectedRoute>} />
          <Route path="/admin/revenue"      element={<ProtectedRoute role="admin"><AdminRevenue /></ProtectedRoute>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}