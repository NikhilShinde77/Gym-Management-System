import { useState, useEffect } from 'react'
import Sidebar from '../../components/Sidebar'
import { useAuth } from '../../context/AuthContext'
import api from '../../api/axios'

export default function TrainerDash() {
  const { user } = useAuth()
  const [members, setMembers] = useState([])
  const [plans,   setPlans]   = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([api.get('/trainer/members'), api.get('/trainer/workout')])
      .then(([m, p]) => { setMembers(m.data); setPlans(p.data) })
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="layout dashboard-bg">
      <Sidebar />
      <main className="main">
        <div className="page-title">TRAINER DASHBOARD</div>
        <div className="page-sub">Welcome, {user?.name} 🏃</div>
        {loading ? <div className="loading-center"><span className="spinner"/></div> : (
          <>
            <div className="stats-grid" style={{gridTemplateColumns:'repeat(3,1fr)'}}>
              <div className="stat-card"><div className="stat-label">Assigned Members</div><div className="stat-value red">{members.length}</div></div>
              <div className="stat-card"><div className="stat-label">Workout Plans</div><div className="stat-value gold">{plans.length}</div></div>
              <div className="stat-card"><div className="stat-label">Active Members</div><div className="stat-value green">{members.filter(m=>m.status==='Active').length}</div></div>
            </div>
            <div className="two-col" style={{marginTop:24}}>
              <div className="card">
                <div style={{fontFamily:'var(--font-display)',fontSize:20,marginBottom:16}}>ASSIGNED MEMBERS</div>
                {members.length === 0 ? <div className="empty-state">No members yet.</div> : (
                  <div className="table-wrap">
                    <table>
                      <thead><tr><th>Name</th><th>Email</th><th>Status</th></tr></thead>
                      <tbody>
                        {members.map(m => (
                          <tr key={m._id}>
                            <td style={{fontWeight:600}}>{m.name}</td>
                            <td style={{color:'var(--muted)',fontSize:12}}>{m.email}</td>
                            <td><span className={`badge badge-${m.status?.toLowerCase()}`}>{m.status}</span></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
              <div className="card">
                <div style={{fontFamily:'var(--font-display)',fontSize:20,marginBottom:16}}>RECENT PLANS</div>
                {plans.length === 0 ? <div className="empty-state">No plans yet.</div> : (
                  <div style={{display:'flex',flexDirection:'column',gap:12}}>
                    {plans.slice(0,4).map(p => (
                      <div key={p._id} style={{background:'#111',borderRadius:8,padding:14}}>
                        <div style={{fontWeight:600,marginBottom:4}}>{p.member?.name}</div>
                        <div style={{fontSize:12,color:'var(--muted)',marginBottom:6}}>{new Date(p.createdDate).toLocaleDateString()}</div>
                        <div style={{fontSize:13,color:'#bbb',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{p.planDetails}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  )
}
