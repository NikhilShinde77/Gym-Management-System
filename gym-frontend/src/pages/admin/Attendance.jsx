import { useState, useEffect } from 'react'
import Sidebar from '../../components/Sidebar'
import api from '../../api/axios'

export default function AdminAttendance() {
  const [records, setRecords] = useState([])
  const [loading, setLoading] = useState(true)
  const [search,  setSearch]  = useState('')

  useEffect(() => {
    api.get('/admin/attendance').then(r => setRecords(r.data)).finally(() => setLoading(false))
  }, [])

  const filtered   = records.filter(r => r.member?.name?.toLowerCase().includes(search.toLowerCase()) || r.member?.email?.toLowerCase().includes(search.toLowerCase()))
  const todayCount = records.filter(r => new Date(r.date).toDateString() === new Date().toDateString()).length

  return (
    <div className="layout dashboard-bg">
      <Sidebar />
      <main className="main">
        <div className="page-title">ATTENDANCE MONITOR</div>
        <div className="page-sub">All member check-ins</div>
        <div className="stats-grid" style={{gridTemplateColumns:'repeat(3,1fr)',marginBottom:28}}>
          <div className="stat-card"><div className="stat-label">Total Records</div><div className="stat-value red">{records.length}</div></div>
          <div className="stat-card"><div className="stat-label">Today's Check-ins</div><div className="stat-value green">{todayCount}</div></div>
          <div className="stat-card"><div className="stat-label">Unique Members</div><div className="stat-value gold">{new Set(records.map(r=>r.member?._id)).size}</div></div>
        </div>
        <div className="card">
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:16}}>
            <div style={{fontFamily:'var(--font-display)',fontSize:20}}>ALL RECORDS</div>
            <input placeholder="Search by name or email..." value={search} onChange={e => setSearch(e.target.value)}
              style={{padding:'8px 14px',background:'#111',border:'1px solid var(--border)',borderRadius:8,color:'var(--text)',fontSize:13,width:260,outline:'none'}} />
          </div>
          {loading ? <div className="loading-center"><span className="spinner"/></div> :
            filtered.length === 0 ? <div className="empty-state">No records found.</div> : (
            <div className="table-wrap">
              <table>
                <thead><tr><th>Member</th><th>Email</th><th>Date</th><th>Check In</th><th>Check Out</th><th>Duration</th></tr></thead>
                <tbody>
                  {filtered.map(r => {
                    const dur = r.checkInTime && r.checkOutTime ? Math.round((new Date(r.checkOutTime)-new Date(r.checkInTime))/60000)+' min' : r.checkInTime ? <span className="badge badge-active">In Gym</span> : '—'
                    return (
                      <tr key={r._id}>
                        <td style={{fontWeight:600}}>{r.member?.name||'—'}</td>
                        <td style={{color:'var(--muted)',fontSize:12}}>{r.member?.email}</td>
                        <td style={{fontSize:13}}>{new Date(r.date).toLocaleDateString()}</td>
                        <td style={{fontSize:13}}>{r.checkInTime ? new Date(r.checkInTime).toLocaleTimeString() : '—'}</td>
                        <td style={{fontSize:13}}>{r.checkOutTime ? new Date(r.checkOutTime).toLocaleTimeString() : '—'}</td>
                        <td style={{color:'var(--gold)'}}>{dur}</td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
