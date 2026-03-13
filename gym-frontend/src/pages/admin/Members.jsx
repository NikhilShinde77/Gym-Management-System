import { useState, useEffect } from 'react'
import Sidebar from '../../components/Sidebar'
import api from '../../api/axios'

export default function AdminMembers() {
  const [members,    setMembers]    = useState([])
  const [loading,    setLoading]    = useState(true)
  const [msg,        setMsg]        = useState({ type:'', text:'' })
  const [editMember, setEditMember] = useState(null)
  const [form,       setForm]       = useState({ status:'' })
  const [saving,     setSaving]     = useState(false)

  const fetch = () => api.get('/admin/members').then(r => setMembers(r.data)).finally(() => setLoading(false))
  useEffect(() => { fetch() }, [])

  const del = async id => {
    if (!confirm('Delete this member?')) return
    try { await api.delete(`/admin/members/${id}`); setMsg({ type:'success', text:'Member deleted' }); fetch() }
    catch (err) { setMsg({ type:'error', text: err.response?.data?.message||'Error' }) }
  }

  const saveEdit = async () => {
    setSaving(true)
    try { await api.put(`/admin/members/${editMember._id}`, form); setMsg({ type:'success', text:'Updated' }); setEditMember(null); fetch() }
    catch (err) { setMsg({ type:'error', text: err.response?.data?.message||'Error' }) }
    finally { setSaving(false) }
  }

  return (
    <div className="layout dashboard-bg">
      <Sidebar />
      <main className="main">
        <div className="page-title">MANAGE MEMBERS</div>
        <div className="page-sub">{members.length} total members</div>
        {msg.text && <div className={`alert alert-${msg.type}`}>{msg.text}</div>}
        <div className="card">
          {loading ? <div className="loading-center"><span className="spinner"/></div> :
            members.length === 0 ? <div className="empty-state">No members yet.</div> : (
            <div className="table-wrap">
              <table>
                <thead><tr><th>Name</th><th>Email</th><th>Phone</th><th>Status</th><th>Joined</th><th>Actions</th></tr></thead>
                <tbody>
                  {members.map(m => (
                    <tr key={m._id}>
                      <td><div style={{display:'flex',alignItems:'center',gap:10}}><div className="avatar" style={{width:32,height:32,fontSize:11}}>{m.name?.split(' ').map(w=>w[0]).join('').toUpperCase().slice(0,2)}</div><span style={{fontWeight:600}}>{m.name}</span></div></td>
                      <td style={{color:'var(--muted)',fontSize:13}}>{m.email}</td>
                      <td style={{color:'var(--muted)',fontSize:13}}>{m.phone}</td>
                      <td><span className={`badge badge-${m.status?.toLowerCase()}`}>{m.status}</span></td>
                      <td style={{fontSize:12,color:'var(--muted)'}}>{new Date(m.joinDate).toLocaleDateString()}</td>
                      <td>
                        <div style={{display:'flex',gap:8}}>
                          <button className="btn btn-outline btn-sm" onClick={() => { setEditMember(m); setForm({ status: m.status }) }}>Edit</button>
                          <button className="btn btn-sm" style={{background:'rgba(230,48,34,.1)',color:'var(--red)',border:'1px solid rgba(230,48,34,.2)'}} onClick={() => del(m._id)}>Delete</button>
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
      {editMember && (
        <div className="overlay" onClick={e => e.target===e.currentTarget && setEditMember(null)}>
          <div className="modal">
            <div className="modal-title">EDIT MEMBER</div>
            <div style={{marginBottom:16,color:'var(--muted)',fontSize:14}}>{editMember.name} · {editMember.email}</div>
            <div className="form-group"><label>Status</label>
              <select value={form.status} onChange={e => setForm({...form,status:e.target.value})}>
                <option value="Active">Active</option><option value="Inactive">Inactive</option><option value="Suspended">Suspended</option>
              </select>
            </div>
            <div className="modal-actions">
              <button className="btn btn-outline" onClick={() => setEditMember(null)}>Cancel</button>
              <button className="btn btn-red" onClick={saveEdit} disabled={saving}>{saving ? <span className="spinner"/> : 'Save'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}