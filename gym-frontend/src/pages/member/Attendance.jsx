import { useState, useEffect } from 'react'
import Sidebar from '../../components/Sidebar'
import api from '../../api/axios'

export default function MemberAttendance() {
  const [records, setRecords] = useState([])
  const [loading, setLoading] = useState(true)
  const [marking, setMarking] = useState(false)
  const [msg,     setMsg]     = useState({ type:'', text:'' })

  const fetch = () => api.get('/member/attendance').then(r => setRecords(r.data)).finally(() => setLoading(false))
  useEffect(() => { fetch() }, [])

  const mark = async () => {
    setMarking(true); setMsg({type:'',text:''})
    try {
      const { data } = await api.post('/member/attendance')
      setMsg({ type:'success', text: data.message }); fetch()
    } catch (err) {
      setMsg({ type:'error', text: err.response?.data?.message || 'Error' })
    } finally { setMarking(false) }
  }

  const today = records.find(r => new Date(r.date).toDateString() === new Date().toDateString())

  return (
    <div className="layout dashboard-bg">
      <Sidebar />
      <main className="main">
        <div className="page-title">ATTENDANCE</div>
        <div className="page-sub">Mark and track your gym visits</div>
        {msg.text && <div className={`alert alert-${msg.type}`}>{msg.text}</div>}
        <div className="card" style={{marginBottom:24,maxWidth:360}}>
          <div style={{fontFamily:'var(--font-display)',fontSize:20,marginBottom:8}}>TODAY</div>
          <div style={{fontSize:14,color:'var(--muted)',marginBottom:16}}>{new Date().toDateString()}</div>
          {today ? (
            <div>
              <div style={{marginBottom:8}}>✅ Checked in: <strong>{new Date(today.checkInTime).toLocaleTimeString()}</strong></div>
              {today.checkOutTime
                ? <div>🚪 Checked out: <strong>{new Date(today.checkOutTime).toLocaleTimeString()}</strong></div>
                : <button className="btn btn-red btn-block" onClick={mark} disabled={marking}>{marking ? <span className="spinner"/> : '🚪 Check Out'}</button>}
            </div>
          ) : (
            <button className="btn btn-red btn-block" onClick={mark} disabled={marking}>
              {marking ? <span className="spinner"/> : '✅ Check In'}
            </button>
          )}
        </div>
        <div className="card">
          <div style={{fontFamily:'var(--font-display)',fontSize:20,marginBottom:16}}>HISTORY ({records.length} visits)</div>
          {loading ? <div className="loading-center"><span className="spinner"/></div> :
            records.length === 0 ? <div className="empty-state">No records yet.</div> : (
            <div className="table-wrap">
              <table>
                <thead><tr><th>Date</th><th>Check In</th><th>Check Out</th><th>Duration</th></tr></thead>
                <tbody>
                  {records.map(r => (
                    <tr key={r._id}>
                      <td>{new Date(r.date).toLocaleDateString()}</td>
                      <td>{r.checkInTime ? new Date(r.checkInTime).toLocaleTimeString() : '—'}</td>
                      <td>{r.checkOutTime ? new Date(r.checkOutTime).toLocaleTimeString() : <span className="badge badge-active">In Gym</span>}</td>
                      <td style={{color:'var(--gold)'}}>
                        {r.checkInTime && r.checkOutTime ? Math.round((new Date(r.checkOutTime)-new Date(r.checkInTime))/60000)+' min' : '—'}
                      </td>
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