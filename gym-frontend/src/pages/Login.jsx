import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../api/axios'

export default function Login() {
  const { login } = useAuth()
  const navigate  = useNavigate()
  const [form, setForm]     = useState({ role:'member', email:'', password:'' })
  const [error, setError]   = useState('')
  const [loading, setLoading] = useState(false)

  const handle = async e => {
    e.preventDefault(); setError(''); setLoading(true)
    try {
      const { data } = await api.post('/auth/login', form)
      login({ id: data.id, name: data.name, role: data.role }, data.token)
      if (data.role === 'admin')        navigate('/admin')
      else if (data.role === 'trainer') navigate('/trainer')
      else navigate('/member')
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed')
    } finally { setLoading(false) }
  }

  return (
    <div className="auth-bg">
      <div className="card" style={{width:'100%',maxWidth:420}}>
        <div style={{textAlign:'center',marginBottom:28}}>
          <div style={{fontFamily:'var(--font-display)',fontSize:32,color:'var(--red)'}}>⚡ IRONFORGE</div>
          <div style={{fontSize:22,fontFamily:'var(--font-display)',marginTop:8}}>WELCOME BACK</div>
          <div style={{fontSize:13,color:'var(--muted)',marginTop:4}}>Sign in to your account</div>
        </div>
        {error && <div className="alert alert-error">{error}</div>}
        <form onSubmit={handle}>
          <div className="form-group">
            <label>Login As</label>
            <select value={form.role} onChange={e => setForm({...form,role:e.target.value})}>
              <option value="member">Member</option>
              <option value="trainer">Trainer</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <div className="form-group">
            <label>Email</label>
            <input type="email" placeholder="you@example.com" value={form.email}
              onChange={e => setForm({...form,email:e.target.value})} required />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input type="password" placeholder="••••••••" value={form.password}
              onChange={e => setForm({...form,password:e.target.value})} required />
          </div>
          <button className="btn btn-red btn-block" type="submit" disabled={loading}>
            {loading ? <span className="spinner"/> : 'Sign In'}
          </button>
        </form>
        <div style={{textAlign:'center',marginTop:20,fontSize:13,color:'var(--muted)'}}>
          No account? <Link to="/register" style={{color:'var(--red)'}}>Register here</Link>
        </div>
        <div style={{textAlign:'center',marginTop:8}}>
          <Link to="/" style={{color:'var(--muted)',fontSize:13}}>← Back to home</Link>
        </div>
      </div>
    </div>
  )
}