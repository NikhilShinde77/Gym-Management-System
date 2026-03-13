import { useState, useEffect } from 'react'
import Sidebar from '../../components/Sidebar'
import api from '../../api/axios'

export default function AdminDash() {
  const [members,  setMembers]  = useState([])
  const [trainers, setTrainers] = useState([])
  const [revenue,  setRevenue]  = useState(null)
  const [attend,   setAttend]   = useState([])
  const [loading,  setLoading]  = useState(true)

  useEffect(() => {
    Promise.all([
      api.get('/admin/members'), api.get('/admin/trainers'),
      api.get('/admin/revenue'), api.get('/admin/attendance'),
    ]).then(([m,t,r,a]) => {
      setMembers(m.data); setTrainers(t.data); setRevenue(r.data); setAttend(a.data)
    }).finally(() => setLoading(false))
  }, [])

  return (
    <div className="layout dashboard-bg">
      <Sidebar />
      <main className="main">
        <div className="page-title">ADMIN DASHBOARD</div>
        <div className="page-sub">Full system overview</div>
        {loading ? <div className="loading-center"><span className="spinner"/></div> : (
          <>
            <div className="stats-grid">
              <div className="stat-card"><div className="stat-label">Total Members</div><div className="stat-value red">{members.length}</div></div>
              <div className="stat-card"><div className="stat-label">Active Members</div><div className="stat-value green">{members.filter(m=>m.status==='Active').length}</div></div>
              <div className="stat-card"><div className="stat-label">Trainers</div><div className="stat-value gold">{trainers.length}</div></div>
              <div className="stat-card"><div className="stat-label">Total Revenue</div><div className="stat-value red">₹{revenue?.totalRevenue||0}</div></div>
            </div>
            <div className="two-col" style={{marginBottom:24}}>
              <div className="card">
                <div style={{fontFamily:'var(--font-display)',fontSize:20,marginBottom:16}}>REVENUE BY METHOD</div>
                {revenue?.byMethod && Object.keys(revenue.byMethod).length > 0 ? (
                  <div style={{display:'flex',flexDirection:'column',gap:12}}>
                    {Object.entries(revenue.byMethod).map(([method,amt]) => (
                      <div key={method} style={{display:'flex',justifyContent:'space-between',alignItems:'center',background:'#111',padding:'12px 16px',borderRadius:8}}>
                        <span style={{fontWeight:600}}>{method}</span>
                        <span style={{color:'var(--green)',fontFamily:'var(--font-display)',fontSize:22}}>₹{amt}</span>
                      </div>
                    ))}
                  </div>
                ) : <div className="empty-state">No revenue yet.</div>}
              </div>
              <div className="card">
                <div style={{fontFamily:'var(--font-display)',fontSize:20,marginBottom:16}}>RECENT ATTENDANCE</div>
                {attend.length === 0 ? <div className="empty-state">No records.</div> : (
                  <div className="table-wrap">
                    <table>
                      <thead><tr><th>Member</th><th>Date</th><th>In</th></tr></thead>
                      <tbody>
                        {attend.slice(0,6).map(a => (
                          <tr key={a._id}>
                            <td style={{fontWeight:600}}>{a.member?.name||'—'}</td>
                            <td style={{fontSize:12,color:'var(--muted)'}}>{new Date(a.date).toLocaleDateString()}</td>
                            <td style={{fontSize:12}}>{a.checkInTime ? new Date(a.checkInTime).toLocaleTimeString() : '—'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
            <div className="card">
              <div style={{fontFamily:'var(--font-display)',fontSize:20,marginBottom:16}}>ALL MEMBERS</div>
              <div className="table-wrap">
                <table>
                  <thead><tr><th>Name</th><th>Email</th><th>Phone</th><th>Status</th><th>Joined</th></tr></thead>
                  <tbody>
                    {members.map(m => (
                      <tr key={m._id}>
                        <td style={{fontWeight:600}}>{m.name}</td>
                        <td style={{color:'var(--muted)',fontSize:13}}>{m.email}</td>
                        <td style={{color:'var(--muted)',fontSize:13}}>{m.phone}</td>
                        <td><span className={`badge badge-${m.status?.toLowerCase()}`}>{m.status}</span></td>
                        <td style={{fontSize:12,color:'var(--muted)'}}>{new Date(m.joinDate).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  )
}