import { useState, useEffect } from 'react'
import Sidebar from '../../components/Sidebar'
import api from '../../api/axios'

export default function MemberPayments() {
  const [payments, setPayments] = useState([])
  const [loading,  setLoading]  = useState(true)

  useEffect(() => {
    api.get('/member/payments').then(r => setPayments(r.data)).finally(() => setLoading(false))
  }, [])

  const total = payments.reduce((s, p) => s + p.amount, 0)

  return (
    <div className="layout dashboard-bg">
      <Sidebar />
      <main className="main">
        <div className="page-title">PAYMENT HISTORY</div>
        <div className="page-sub">All your transactions</div>
        <div className="stats-grid" style={{gridTemplateColumns:'repeat(3,1fr)',marginBottom:28}}>
          <div className="stat-card"><div className="stat-label">Total Paid</div><div className="stat-value red">₹{total}</div></div>
          <div className="stat-card"><div className="stat-label">Transactions</div><div className="stat-value gold">{payments.length}</div></div>
          <div className="stat-card"><div className="stat-label">Last Payment</div><div className="stat-value" style={{fontSize:18}}>{payments[0] ? new Date(payments[0].paymentDate).toLocaleDateString() : '—'}</div></div>
        </div>
        <div className="card">
          {loading ? <div className="loading-center"><span className="spinner"/></div> :
            payments.length === 0 ? <div className="empty-state">No payments yet.</div> : (
            <div className="table-wrap">
              <table>
                <thead><tr><th>Date</th><th>Amount</th><th>Method</th></tr></thead>
                <tbody>
                  {payments.map(p => (
                    <tr key={p._id}>
                      <td>{new Date(p.paymentDate).toLocaleDateString()}</td>
                      <td style={{color:'var(--green)',fontWeight:600}}>₹{p.amount}</td>
                      <td><span className="badge badge-active">{p.paymentMethod}</span></td>
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
