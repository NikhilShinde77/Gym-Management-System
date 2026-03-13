import { useState, useEffect } from 'react';
import Login from './pages/Login';
import AdminPanel from './pages/AdminPanel';
import TrainerPanel from './pages/TrainerPanel';
import MemberPanel from './pages/MemberPanel';

function App() {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const role = localStorage.getItem('role');
        const token = localStorage.getItem('token');
        if (role && token) setUser({ role });
    }, []);

    const logout = () => {
        localStorage.clear();
        setUser(null);
    };

    if (!user) return <Login setUser={setUser} />;

    return (
        <div style={{ padding: '20px', fontFamily: 'Arial' }}>
            <nav style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '2px solid #333' }}>
                <h1>Gym System ({user.role.toUpperCase()})</h1>
                <button onClick={logout} style={{ height: '30px', marginTop: '20px' }}>Logout</button>
            </nav>
            <main>
                {user.role === 'admin' && <AdminPanel />}
                {user.role === 'trainer' && <TrainerPanel />}
                {user.role === 'member' && <MemberPanel />}
            </main>
        </div>
    );
}

export default App;