import { useState, useEffect } from 'react'
import Sidebar from '../../components/Sidebar'
import { useAuth } from '../../context/AuthContext'
import api from '../../api/axios'

export default function MemberDash() {
  const { user } = useAuth()
  const [sub,  setSub]  = useState(null)
  const [att,  setAtt]  = useState([])
  const [pays, setPays] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      api.get('/member/subscription').catch(() => ({ data: null })),
      api.get('/member/attendance'),
      api.get('/member/payments'),
    ]).then(([s, a, p]) => {
      setSub(s.data?.data || s.data)
      setAtt(a.data)
      setPays(p.data)
    }).finally(() => setLoading(false))
  }, [])

  return (
    <div className="layout dashboard-bg">
      <Sidebar />
      <main className="main">
        <div className="page-title">DASHBOARD</div>
        <div className="page-sub">Welcome back, {user?.name} 💪</div>
        {loading ? <div className="loading-center"><span className="spinner"/></div> : (
          <>
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-label">Subscription</div>
                <div className={`stat-value ${sub ? 'green' : 'red'}`} style={{fontSize:28}}>{sub ? sub.status : 'None'}</div>
              </div>
              <div className="stat-card">
                <div className="stat-label">Plan</div>
                <div className="stat-value" style={{fontSize:22}}>{sub?.plan?.planName || '—'}</div>
              </div>
              <div className="stat-card">
                <div className="stat-label">Total Attendance</div>
                <div className="stat-value red">{att.length}</div>
              </div>
              <div className="stat-card">
                <div className="stat-label">Total Payments</div>
                <div className="stat-value gold">{pays.length}</div>
              </div>
            </div>
            {sub && (
              <div className="card" style={{marginBottom:24}}>
                <div style={{fontFamily:'var(--font-display)',fontSize:20,marginBottom:16}}>ACTIVE SUBSCRIPTION</div>
                <div className="two-col">
                  <div><div style={{color:'var(--muted)',fontSize:12}}>PLAN</div><div style={{fontSize:16,fontWeight:600}}>{sub.plan?.planName}</div></div>
                  <div><div style={{color:'var(--muted)',fontSize:12}}>PRICE</div><div style={{fontSize:16,fontWeight:600,color:'var(--red)'}}>₹{sub.plan?.price}</div></div>
                  <div><div style={{color:'var(--muted)',fontSize:12}}>START</div><div style={{fontSize:14}}>{new Date(sub.startDate).toLocaleDateString()}</div></div>
                  <div><div style={{color:'var(--muted)',fontSize:12}}>EXPIRES</div><div style={{fontSize:14}}>{new Date(sub.endDate).toLocaleDateString()}</div></div>
                </div>
              </div>
            )}
            <div className="card">
              <div style={{fontFamily:'var(--font-display)',fontSize:20,marginBottom:16}}>RECENT ATTENDANCE</div>
              {att.length === 0 ? <div className="empty-state">No attendance records yet.</div> : (
                <div className="table-wrap">
                  <table>
                    <thead><tr><th>Date</th><th>Check In</th><th>Check Out</th></tr></thead>
                    <tbody>
                      {att.slice(0,5).map(a => (
                        <tr key={a._id}>
                          <td>{new Date(a.date).toLocaleDateString()}</td>
                          <td>{a.checkInTime ? new Date(a.checkInTime).toLocaleTimeString() : '—'}</td>
                          <td>{a.checkOutTime ? new Date(a.checkOutTime).toLocaleTimeString() : <span className="badge badge-active">Active</span>}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
        )}
      </main>
    </div>
  )
}