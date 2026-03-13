import { useState, useEffect } from 'react'
import Sidebar from '../../components/Sidebar'
import api from '../../api/axios'

export default function MemberPlans() {
  const [plans,    setPlans]    = useState([])
  const [selected, setSelected] = useState(null)
  const [method,   setMethod]   = useState('Cash')
  const [loading,  setLoading]  = useState(true)
  const [msg,      setMsg]      = useState({ type:'', text:'' })
  const [subbing,  setSubbing]  = useState(false)

  useEffect(() => {
    api.get('/member/plans').then(r => setPlans(r.data)).finally(() => setLoading(false))
  }, [])

  const subscribe = async () => {
    if (!selected) return
    setSubbing(true); setMsg({type:'',text:''})
    try {
      await api.post('/member/subscribe', { planId: selected._id, paymentMethod: method })
      setMsg({ type:'success', text:`Subscribed to ${selected.planName}!` })
    } catch (err) {
      setMsg({ type:'error', text: err.response?.data?.message || 'Failed' })
    } finally { setSubbing(false) }
  }

  return (
    <div className="layout dashboard-bg">
      <Sidebar />
      <main className="main">
        <div className="page-title">MEMBERSHIP PLANS</div>
        <div className="page-sub">Choose the plan that fits your goals</div>
        {msg.text && <div className={`alert alert-${msg.type}`}>{msg.text}</div>}
        {loading ? <div className="loading-center"><span className="spinner"/></div> : (
          <>
            <div className="three-col" style={{marginBottom:32}}>
              {plans.map(plan => (
                <div key={plan._id} className={`plan-card ${selected?._id === plan._id ? 'selected' : ''}`}
                  onClick={() => setSelected(plan)}>
                  <div className="plan-name">{plan.planName}</div>
                  <div className="plan-price">₹{plan.price}<span>/plan</span></div>
                  <div className="plan-duration">⏱ {plan.durationMonths} Month{plan.durationMonths > 1 ? 's' : ''}</div>
                  {plan.features && <div className="plan-features">{plan.features}</div>}
                </div>
              ))}
              {plans.length === 0 && <div style={{gridColumn:'1/-1'}}><div className="empty-state">No plans available yet.</div></div>}
            </div>
            {selected && (
              <div className="card" style={{maxWidth:420}}>
                <div style={{fontFamily:'var(--font-display)',fontSize:22,marginBottom:16}}>CONFIRM SUBSCRIPTION</div>
                <p style={{color:'var(--muted)',marginBottom:16}}>
                  Plan: <strong style={{color:'var(--text)'}}>{selected.planName}</strong> — ₹{selected.price} for {selected.durationMonths} month(s)
                </p>
                <div className="form-group">
                  <label>Payment Method</label>
                  <select value={method} onChange={e => setMethod(e.target.value)}>
                    <option>Cash</option><option>Card</option><option>Online</option>
                  </select>
                </div>
                <button className="btn btn-red btn-block" onClick={subscribe} disabled={subbing}>
                  {subbing ? <span className="spinner"/> : `Subscribe for ₹${selected.price}`}
                </button>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  )
}