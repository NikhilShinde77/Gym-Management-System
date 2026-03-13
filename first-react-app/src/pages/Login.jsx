import { useState } from 'react';
import API from '../api';

export default function Login({ setUser }) {
    const [form, setForm] = useState({ email: '', password: '', role: 'member' });

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const { data } = await API.post('/auth/login', form);
            localStorage.setItem('token', data.token);
            localStorage.setItem('role', data.role);
            setUser(data);
        } catch (err) { alert(err.response?.data?.message || "Login Error"); }
    };

    return (
        <div style={{ textAlign: 'center', marginTop: '100px' }}>
            <h2>Login to Gym</h2>
            <form onSubmit={handleLogin} style={{ display: 'inline-block', textAlign: 'left' }}>
                <label>Role:</label><br/>
                <select onChange={e => setForm({...form, role: e.target.value})}>
                    <option value="member">Member</option>
                    <option value="trainer">Trainer</option>
                    <option value="admin">Admin</option>
                </select><br/><br/>
                <input type="email" placeholder="Email" required onChange={e => setForm({...form, email: e.target.value})} /><br/><br/>
                <input type="password" placeholder="Password" required onChange={e => setForm({...form, password: e.target.value})} /><br/><br/>
                <button type="submit">Login</button>
            </form>
        </div>
    );
}
