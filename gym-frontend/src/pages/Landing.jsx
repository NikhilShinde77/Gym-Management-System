import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Landing() {
  const navigate = useNavigate()
  const { user } = useAuth()

  const goToDash = () => {
    if (user?.role === 'admin')        navigate('/admin')
    else if (user?.role === 'trainer') navigate('/trainer')
    else if (user?.role === 'member')  navigate('/member')
    else navigate('/login')
  }

  return (
    <div className="hero-bg" style={{flexDirection:'column'}}>
      <nav className="navbar">
        <div className="navbar-logo">⚡ IRONFORGE</div>
        <div className="navbar-links">
          {user ? (
            <button className="btn btn-red btn-sm" onClick={goToDash}>Go to Dashboard</button>
          ) : (
            <>
              <button className="btn btn-ghost btn-sm" onClick={() => navigate('/login')}>Login</button>
              <button className="btn btn-red btn-sm"   onClick={() => navigate('/register')}>Join Now</button>
            </>
          )}
        </div>
      </nav>

      <section className="hero">
        <div className="hero-content">
          <div className="hero-eyebrow">🔥 Premium Gym Management</div>
          <h1 className="hero-title">FORGE<br/>YOUR<br/><span>LIMITS</span></h1>
          <p className="hero-desc">
            A complete digital system to manage memberships, track attendance,
            assign trainers, and monitor your fitness journey — all in one place.
          </p>
          <div className="hero-btns">
            <button className="btn btn-red"     onClick={() => navigate('/register')}>Start Free Today</button>
            <button className="btn btn-outline" onClick={() => navigate('/login')}>Member Login</button>
          </div>
        </div>
      </section>

      <section className="features">
        <h2 className="features-title">THREE POWERFUL PANELS</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">👤</div>
            <div className="feature-title">MEMBER PANEL</div>
            <p className="feature-desc">Register, choose membership plans, track attendance, view workout schedules, and monitor payment history.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🏃</div>
            <div className="feature-title">TRAINER PANEL</div>
            <p className="feature-desc">View assigned members, create customized workout plans, update member progress, and manage your training schedule.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">👑</div>
            <div className="feature-title">ADMIN PANEL</div>
            <p className="feature-desc">Manage all members and trainers, create membership plans, monitor attendance, and generate revenue reports.</p>
          </div>
        </div>
        <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:24,marginTop:56,textAlign:'center'}}>
          {[['500+','Active Members'],['20+','Expert Trainers'],['15+','Plan Options'],['98%','Satisfaction']].map(([v,l])=>(
            <div key={l}>
              <div style={{fontFamily:'var(--font-display)',fontSize:48,color:'var(--red)'}}>{v}</div>
              <div style={{fontSize:13,color:'var(--muted)',marginTop:4}}>{l}</div>
            </div>
          ))}
        </div>
      </section>

      <div style={{textAlign:'center',padding:'24px',borderTop:'1px solid var(--border)',color:'var(--muted)',fontSize:13}}>
        © 2025 IronForge Gym Management System
      </div>
    </div>
  )
}