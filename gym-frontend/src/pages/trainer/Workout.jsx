import { useState, useEffect } from 'react'
import Sidebar from '../../components/Sidebar'
import api from '../../api/axios'

export default function TrainerWorkout() {
  const [plans,      setPlans]      = useState([])
  const [allMembers, setAllMembers] = useState([])
  const [loading,    setLoading]    = useState(true)
  const [showModal,  setShowModal]  = useState(false)
  const [editPlan,   setEditPlan]   = useState(null)
  const [form,       setForm]       = useState({ memberId:'', planDetails:'' })
  const [saving,     setSaving]     = useState(false)
  const [msg,        setMsg]        = useState({ type:'', text:'' })

  const fetchPlans   = () => api.get('/trainer/workout').then(r => setPlans(r.data))
  const fetchMembers = () => api.get('/trainer/members').then(r => setAllMembers(r.data))

  useEffect(() => { Promise.all([fetchPlans(), fetchMembers()]).finally(() => setLoading(false)) }, [])

  const openCreate = () => { setEditPlan(null); setForm({ memberId:'', planDetails:'' }); setShowModal(true) }
  const openEdit   = p   => { setEditPlan(p); setForm({ memberId: p.member?._id, planDetails: p.planDetails }); setShowModal(true) }

  const save = async () => {
    if (!form.planDetails) return
    setSaving(true); setMsg({type:'',text:''})
    try {
      if (editPlan) {
        await api.put(`/trainer/workout/${editPlan._id}`, { planDetails: form.planDetails })
        setMsg({ type:'success', text:'Plan updated!' })
      } else {
        if (!form.memberId) { setSaving(false); return }
        await api.post('/trainer/workout', { memberId: form.memberId, planDetails: form.planDetails })
        setMsg({ type:'success', text:'Plan created!' })
      }
      setShowModal(false); fetchPlans()
    } catch (err) {
      setMsg({ type:'error', text: err.response?.data?.message || 'Error' })
    } finally { setSaving(false) }
  }

  return (
    <div className="layout dashboard-bg">
      <Sidebar />
      <main className="main">
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:8}}>
          <div><div className="page-title">WORKOUT PLANS</div><div className="page-sub">Create and manage plans for your members</div></div>
          <button className="btn btn-red" onClick={openCreate}>＋ New Plan</button>
        </div>
        {msg.text && <div className={`alert alert-${msg.type}`}>{msg.text}</div>}
        {loading ? <div className="loading-center"><span className="spinner"/></div> :
          plans.length === 0 ? <div className="card"><div className="empty-state"><div style={{fontSize:48,marginBottom:12}}>📝</div>No plans yet.</div></div> : (
          <div style={{display:'flex',flexDirection:'column',gap:16}}>
            {plans.map(p => (
              <div key={p._id} className="card">
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start'}}>
                  <div>
                    <div style={{fontFamily:'var(--font-display)',fontSize:20,marginBottom:4}}>{p.member?.name||'Member'}</div>
                    <div style={{fontSize:12,color:'var(--muted)'}}>{p.member?.email} · {new Date(p.createdDate).toLocaleDateString()}</div>
                  </div>
                  <button className="btn btn-outline btn-sm" onClick={() => openEdit(p)}>✏️ Edit</button>
                </div>
                <div style={{marginTop:14,background:'#111',borderRadius:8,padding:16,whiteSpace:'pre-wrap',fontSize:13,lineHeight:1.8,color:'#ccc'}}>
                  {p.planDetails}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
      {showModal && (
        <div className="overlay" onClick={e => e.target===e.currentTarget && setShowModal(false)}>
          <div className="modal">
            <div className="modal-title">{editPlan ? 'EDIT PLAN' : 'NEW WORKOUT PLAN'}</div>
            {!editPlan && (
              <div className="form-group">
                <label>Select Member</label>
                <select value={form.memberId} onChange={e => setForm({...form,memberId:e.target.value})} required>
                  <option value="">— choose member —</option>
                  {allMembers.map(m => <option key={m._id} value={m._id}>{m.name}</option>)}
                </select>
              </div>
            )}
            <div className="form-group">
              <label>Plan Details</label>
              <textarea rows={7} placeholder="Day 1: Chest&#10;Day 2: Back&#10;..." value={form.planDetails}
                onChange={e => setForm({...form,planDetails:e.target.value})} style={{resize:'vertical'}} required />
            </div>
            <div className="modal-actions">
              <button className="btn btn-outline" onClick={() => setShowModal(false)}>Cancel</button>
              <button className="btn btn-red" onClick={save} disabled={saving}>{saving ? <span className="spinner"/> : editPlan ? 'Update' : 'Create'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}