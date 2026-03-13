import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import api from '../api/axios'

export default function Register() {
  const navigate = useNavigate()
  const [role, setRole] = useState('member')
  const [form, setForm] = useState({ name:'', email:'', password:'', phone:'', specialization:'' })
  const [error,   setError]   = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)

  const handle = async e => {
    e.preventDefault(); setError(''); setSuccess(''); setLoading(true)
    try {
      const payload = { role, ...form }
      if (role === 'admin') { payload.username = form.name; delete payload.name }
      await api.post('/auth/register', payload)
      setSuccess('Registered! Redirecting to login...')
      setTimeout(() => navigate('/login'), 1500)
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed')
    } finally { setLoading(false) }
  }

  const f = (k, v) => setForm({...form,[k]:v})

  return (
    <div className="auth-bg">
      <div className="card" style={{width:'100%',maxWidth:460}}>
        <div style={{textAlign:'center',marginBottom:28}}>
          <div style={{fontFamily:'var(--font-display)',fontSize:32,color:'var(--red)'}}>⚡ IRONFORGE</div>
          <div style={{fontSize:22,fontFamily:'var(--font-display)',marginTop:8}}>CREATE ACCOUNT</div>
        </div>
        {error   && <div className="alert alert-error">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}
        <form onSubmit={handle}>
          <div className="form-group">
            <label>Register As</label>
            <select value={role} onChange={e => setRole(e.target.value)}>
              <option value="member">Member</option>
              <option value="trainer">Trainer</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <div className="form-group">
            <label>{role === 'admin' ? 'Username' : 'Full Name'}</label>
            <input placeholder="Your name" value={form.name}
              onChange={e => f('name', e.target.value)} required />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input type="email" placeholder="you@example.com" value={form.email}
              onChange={e => f('email', e.target.value)} required />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input type="password" placeholder="Min 6 chars" value={form.password}
              onChange={e => f('password', e.target.value)} required />
          </div>
          {role !== 'admin' && (
            <div className="form-group">
              <label>Phone</label>
              <input placeholder="9999999999" value={form.phone}
                onChange={e => f('phone', e.target.value)} required />
            </div>
          )}
          {role === 'trainer' && (
            <div className="form-group">
              <label>Specialization</label>
              <input placeholder="e.g. Yoga, CrossFit, Strength" value={form.specialization}
                onChange={e => f('specialization', e.target.value)} required />
            </div>
          )}
          <button className="btn btn-red btn-block" type="submit" disabled={loading}>
            {loading ? <span className="spinner"/> : 'Create Account'}
          </button>
        </form>
        <div style={{textAlign:'center',marginTop:20,fontSize:13,color:'var(--muted)'}}>
          Already have an account? <Link to="/login" style={{color:'var(--red)'}}>Login</Link>
        </div>
      </div>
    </div>
  )
}