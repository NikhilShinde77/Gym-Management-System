import { useState, useEffect } from 'react'
import Sidebar from '../../components/Sidebar'
import api from '../../api/axios'

export default function AdminTrainers() {
  const [trainers, setTrainers] = useState([])
  const [loading,  setLoading]  = useState(true)
  const [msg,      setMsg]      = useState({ type:'', text:'' })
  const [editT,    setEditT]    = useState(null)
  const [form,     setForm]     = useState({ status:'' })
  const [saving,   setSaving]   = useState(false)

  const fetch = () => api.get('/admin/trainers').then(r => setTrainers(r.data)).finally(() => setLoading(false))
  useEffect(() => { fetch() }, [])

  const del = async id => {
    if (!confirm('Delete this trainer?')) return
    try { await api.delete(`/admin/trainers/${id}`); setMsg({ type:'success', text:'Trainer deleted' }); fetch() }
    catch (err) { setMsg({ type:'error', text: err.response?.data?.message||'Error' }) }
  }

  const saveEdit = async () => {
    setSaving(true)
    try { await api.put(`/admin/trainers/${editT._id}`, form); setMsg({ type:'success', text:'Updated' }); setEditT(null); fetch() }
    catch (err) { setMsg({ type:'error', text: err.response?.data?.message||'Error' }) }
    finally { setSaving(false) }
  }

  return (
    <div className="layout dashboard-bg">
      <Sidebar />
      <main className="main">
        <div className="page-title">MANAGE TRAINERS</div>
        <div className="page-sub">{trainers.length} trainers registered</div>
        {msg.text && <div className={`alert alert-${msg.type}`}>{msg.text}</div>}
        <div className="card">
          {loading ? <div className="loading-center"><span className="spinner"/></div> :
            trainers.length === 0 ? <div className="empty-state">No trainers yet.</div> : (
            <div className="table-wrap">
              <table>
                <thead><tr><th>Name</th><th>Email</th><th>Specialization</th><th>Phone</th><th>Status</th><th>Actions</th></tr></thead>
                <tbody>
                  {trainers.map(t => (
                    <tr key={t._id}>
                      <td><div style={{display:'flex',alignItems:'center',gap:10}}><div className="avatar" style={{width:32,height:32,fontSize:11,background:'var(--gold)',color:'#000'}}>{t.name?.split(' ').map(w=>w[0]).join('').toUpperCase().slice(0,2)}</div><span style={{fontWeight:600}}>{t.name}</span></div></td>
                      <td style={{color:'var(--muted)',fontSize:13}}>{t.email}</td>
                      <td><span className="badge badge-trainer">{t.specialization}</span></td>
                      <td style={{color:'var(--muted)',fontSize:13}}>{t.phone}</td>
                      <td><span className={`badge badge-${t.status?.toLowerCase()}`}>{t.status}</span></td>
                      <td>
                        <div style={{display:'flex',gap:8}}>
                          <button className="btn btn-outline btn-sm" onClick={() => { setEditT(t); setForm({ status: t.status }) }}>Edit</button>
                          <button className="btn btn-sm" style={{background:'rgba(230,48,34,.1)',color:'var(--red)',border:'1px solid rgba(230,48,34,.2)'}} onClick={() => del(t._id)}>Delete</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
      {editT && (
        <div className="overlay" onClick={e => e.target===e.currentTarget && setEditT(null)}>
          <div className="modal">
            <div className="modal-title">EDIT TRAINER</div>
            <div style={{marginBottom:16,color:'var(--muted)',fontSize:14}}>{editT.name} · {editT.specialization}</div>
            <div className="form-group"><label>Status</label>
              <select value={form.status} onChange={e => setForm({...form,status:e.target.value})}>
                <option value="Active">Active</option><option value="Inactive">Inactive</option>
              </select>
            </div>
            <div className="modal-actions">
              <button className="btn btn-outline" onClick={() => setEditT(null)}>Cancel</button>
              <button className="btn btn-red" onClick={saveEdit} disabled={saving}>{saving ? <span className="spinner"/> : 'Save'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
