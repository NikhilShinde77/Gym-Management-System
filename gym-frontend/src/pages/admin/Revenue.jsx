import { useState, useEffect } from 'react'
import Sidebar from '../../components/Sidebar'
import api from '../../api/axios'

export default function AdminRevenue() {
  const [data,    setData]    = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/admin/revenue').then(r => setData(r.data)).finally(() => setLoading(false))
  }, [])

  const payments     = data?.payments || []
  const byMethod     = data?.byMethod || {}
  const totalRevenue = data?.totalRevenue || 0

  return (
    <div className="layout dashboard-bg">
      <Sidebar />
      <main className="main">
        <div className="page-title">REVENUE REPORT</div>
        <div className="page-sub">Financial overview of the gym</div>
        {loading ? <div className="loading-center"><span className="spinner"/></div> : (
          <>
            <div className="stats-grid" style={{gridTemplateColumns:'repeat(3,1fr)',marginBottom:28}}>
              <div className="stat-card"><div className="stat-label">Total Revenue</div><div className="stat-value red">₹{totalRevenue.toLocaleString()}</div></div>
              <div className="stat-card"><div className="stat-label">Transactions</div><div className="stat-value gold">{payments.length}</div></div>
              <div className="stat-card"><div className="stat-label">Avg per Transaction</div><div className="stat-value green">₹{payments.length ? Math.round(totalRevenue/payments.length).toLocaleString() : 0}</div></div>
            </div>
            <div className="two-col" style={{marginBottom:28}}>
              <div className="card">
                <div style={{fontFamily:'var(--font-display)',fontSize:20,marginBottom:16}}>BY PAYMENT METHOD</div>
                {Object.keys(byMethod).length === 0 ? <div className="empty-state">No data.</div> : (
                  <div style={{display:'flex',flexDirection:'column',gap:16}}>
                    {Object.entries(byMethod).map(([method,amt]) => {
                      const pct = totalRevenue ? Math.round((amt/totalRevenue)*100) : 0
                      return (
                        <div key={method}>
                          <div style={{display:'flex',justifyContent:'space-between',marginBottom:6}}>
                            <span style={{fontWeight:600}}>{method}</span>
                            <span style={{color:'var(--green)'}}>₹{amt} ({pct}%)</span>
                          </div>
                          <div style={{height:8,background:'var(--border)',borderRadius:4,overflow:'hidden'}}>
                            <div style={{height:'100%',width:`${pct}%`,background:'var(--red)',borderRadius:4}}/>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
              <div className="card">
                <div style={{fontFamily:'var(--font-display)',fontSize:20,marginBottom:16}}>SUMMARY</div>
                <div style={{display:'flex',flexDirection:'column',gap:12}}>
                  {[['Total Revenue',`₹${totalRevenue.toLocaleString()}`,'var(--red)'],['Cash',`₹${byMethod['Cash']||0}`,'var(--gold)'],['Card',`₹${byMethod['Card']||0}`,'var(--green)'],['Online',`₹${byMethod['Online']||0}`,'#6c9aff']].map(([label,val,color])=>(
                    <div key={label} style={{display:'flex',justifyContent:'space-between',padding:'12px 16px',background:'#111',borderRadius:8}}>
                      <span style={{color:'var(--muted)'}}>{label}</span>
                      <span style={{fontFamily:'var(--font-display)',fontSize:20,color}}>{val}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="card">
              <div style={{fontFamily:'var(--font-display)',fontSize:20,marginBottom:16}}>ALL TRANSACTIONS</div>
              {payments.length === 0 ? <div className="empty-state">No transactions yet.</div> : (
                <div className="table-wrap">
                  <table>
                    <thead><tr><th>Date</th><th>Member</th><th>Amount</th><th>Method</th></tr></thead>
                    <tbody>
                      {payments.map(p => (
                        <tr key={p._id}>
                          <td style={{fontSize:13}}>{new Date(p.paymentDate).toLocaleDateString()}</td>
                          <td style={{fontWeight:600}}>{p.member?.name||'—'}</td>
                          <td style={{color:'var(--green)',fontWeight:700,fontFamily:'var(--font-display)',fontSize:18}}>₹{p.amount}</td>
                          <td><span className="badge badge-active">{p.paymentMethod}</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
        )}
      </main>
    </div>
  )
}