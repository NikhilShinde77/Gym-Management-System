import { useState, useEffect } from 'react'
import Sidebar from '../../components/Sidebar'
import api from '../../api/axios'

const empty = { planName:'', price:'', durationMonths:'', features:'' }

export default function AdminPlans() {
  const [plans,     setPlans]     = useState([])
  const [loading,   setLoading]   = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editPlan,  setEditPlan]  = useState(null)
  const [form,      setForm]      = useState(empty)
  const [saving,    setSaving]    = useState(false)
  const [msg,       setMsg]       = useState({ type:'', text:'' })

  const fetch = () => api.get('/admin/plans').then(r => setPlans(r.data)).finally(() => setLoading(false))
  useEffect(() => { fetch() }, [])

  const openCreate = () => { setEditPlan(null); setForm(empty); setShowModal(true) }
  const openEdit   = p   => { setEditPlan(p); setForm({ planName:p.planName, price:p.price, durationMonths:p.durationMonths, features:p.features||'' }); setShowModal(true) }

  const save = async () => {
    setSaving(true); setMsg({type:'',text:''})
    try {
      if (editPlan) { await api.put(`/admin/plans/${editPlan._id}`, form); setMsg({ type:'success', text:'Updated!' }) }
      else          { await api.post('/admin/plans', form);              setMsg({ type:'success', text:'Created!' }) }
      setShowModal(false); fetch()
    } catch (err) { setMsg({ type:'error', text: err.response?.data?.message||'Error' }) }
    finally { setSaving(false) }
  }

  const del = async id => {
    if (!confirm('Delete this plan?')) return
    try { await api.delete(`/admin/plans/${id}`); setMsg({ type:'success', text:'Deleted' }); fetch() }
    catch (err) { setMsg({ type:'error', text: err.response?.data?.message||'Error' }) }
  }

  return (
    <div className="layout dashboard-bg">
      <Sidebar />
      <main className="main">
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:8}}>
          <div><div className="page-title">MEMBERSHIP PLANS</div><div className="page-sub">Create and manage subscription plans</div></div>
          <button className="btn btn-red" onClick={openCreate}>＋ New Plan</button>
        </div>
        {msg.text && <div className={`alert alert-${msg.type}`}>{msg.text}</div>}
        {loading ? <div className="loading-center"><span className="spinner"/></div> : (
          <div className="three-col">
            {plans.map(plan => (
              <div key={plan._id} className="plan-card" style={{cursor:'default'}}>
                <div className="plan-name">{plan.planName}</div>
                <div className="plan-price">₹{plan.price}<span>/plan</span></div>
                <div className="plan-duration">⏱ {plan.durationMonths} Month{plan.durationMonths>1?'s':''}</div>
                {plan.features && <div className="plan-features" style={{marginBottom:16}}>{plan.features}</div>}
                <div style={{display:'flex',gap:8,justifyContent:'center'}}>
                  <button className="btn btn-outline btn-sm" onClick={() => openEdit(plan)}>✏️ Edit</button>
                  <button className="btn btn-sm" style={{background:'rgba(230,48,34,.1)',color:'var(--red)',border:'1px solid rgba(230,48,34,.2)'}} onClick={() => del(plan._id)}>🗑 Delete</button>
                </div>
              </div>
            ))}
            {plans.length === 0 && <div style={{gridColumn:'1/-1'}}><div className="empty-state">No plans yet.</div></div>}
          </div>
        )}
      </main>
      {showModal && (
        <div className="overlay" onClick={e => e.target===e.currentTarget && setShowModal(false)}>
          <div className="modal">
            <div className="modal-title">{editPlan ? 'EDIT PLAN' : 'NEW PLAN'}</div>
            <div className="form-group"><label>Plan Name</label><input placeholder="e.g. Gold Plan" value={form.planName} onChange={e => setForm({...form,planName:e.target.value})} required /></div>
            <div className="two-col">
              <div className="form-group"><label>Price (₹)</label><input type="number" placeholder="999" value={form.price} onChange={e => setForm({...form,price:e.target.value})} required /></div>
              <div className="form-group"><label>Duration (Months)</label><input type="number" placeholder="3" value={form.durationMonths} onChange={e => setForm({...form,durationMonths:e.target.value})} required /></div>
            </div>
            <div className="form-group"><label>Features</label><textarea rows={3} placeholder="Full gym access..." value={form.features} onChange={e => setForm({...form,features:e.target.value})} /></div>
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