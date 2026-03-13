import { useState, useEffect } from 'react'
import Sidebar from '../../components/Sidebar'
import api from '../../api/axios'

export default function MemberWorkout() {
  const [plans,   setPlans]   = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/member/workout').then(r => setPlans(r.data)).finally(() => setLoading(false))
  }, [])

  return (
    <div className="layout dashboard-bg">
      <Sidebar />
      <main className="main">
        <div className="page-title">WORKOUT PLANS</div>
        <div className="page-sub">Plans created by your trainer</div>
        {loading ? <div className="loading-center"><span className="spinner"/></div> :
          plans.length === 0 ? (
            <div className="card"><div className="empty-state"><div style={{fontSize:48,marginBottom:16}}>🏋️</div>No workout plans assigned yet.</div></div>
          ) : (
            <div style={{display:'flex',flexDirection:'column',gap:20}}>
              {plans.map(plan => (
                <div key={plan._id} className="card">
                  <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:16}}>
                    <div>
                      <div style={{fontFamily:'var(--font-display)',fontSize:22}}>WORKOUT PLAN</div>
                      <div style={{fontSize:13,color:'var(--muted)'}}>By: <strong style={{color:'var(--gold)'}}>{plan.trainer?.name || 'Trainer'}</strong>{plan.trainer?.specialization && ` · ${plan.trainer.specialization}`}</div>
                    </div>
                    <div style={{fontSize:12,color:'var(--muted)'}}>{new Date(plan.createdDate).toLocaleDateString()}</div>
                  </div>
                  <div style={{background:'#111',borderRadius:8,padding:20,whiteSpace:'pre-wrap',fontSize:14,lineHeight:1.8,color:'#ddd'}}>
                    {plan.planDetails}
                  </div>
                </div>
              ))}
            </div>
          )
        }
      </main>
    </div>
  )
}