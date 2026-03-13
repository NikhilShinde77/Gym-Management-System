import { useState, useEffect } from 'react'
import Sidebar from '../../components/Sidebar'
import api from '../../api/axios'

export default function TrainerMembers() {
  const [members, setMembers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/trainer/members').then(r => setMembers(r.data)).finally(() => setLoading(false))
  }, [])

  return (
    <div className="layout dashboard-bg">
      <Sidebar />
      <main className="main">
        <div className="page-title">MY MEMBERS</div>
        <div className="page-sub">Members assigned to you via workout plans</div>
        <div className="card">
          {loading ? <div className="loading-center"><span className="spinner"/></div> :
            members.length === 0 ? <div className="empty-state"><div style={{fontSize:48,marginBottom:12}}>👥</div>No members assigned yet.</div> : (
            <div className="table-wrap">
              <table>
                <thead><tr><th>Name</th><th>Email</th><th>Phone</th><th>Status</th></tr></thead>
                <tbody>
                  {members.map(m => (
                    <tr key={m._id}>
                      <td>
                        <div style={{display:'flex',alignItems:'center',gap:10}}>
                          <div className="avatar" style={{width:32,height:32,fontSize:12}}>
                            {m.name?.split(' ').map(w=>w[0]).join('').toUpperCase().slice(0,2)}
                          </div>
                          <span style={{fontWeight:600}}>{m.name}</span>
                        </div>
                      </td>
                      <td style={{color:'var(--muted)',fontSize:13}}>{m.email}</td>
                      <td style={{color:'var(--muted)',fontSize:13}}>{m.phone||'—'}</td>
                      <td><span className={`badge badge-${m.status?.toLowerCase()}`}>{m.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}