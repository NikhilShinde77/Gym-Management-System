import { useEffect, useState } from 'react';
import API from '../api';

export default function AdminPanel() {
    const [members, setMembers] = useState([]);
    const [revenue, setRevenue] = useState(0);

    useEffect(() => {
        API.get('/admin/members').then(res => setMembers(res.data));
        API.get('/admin/revenue').then(res => setRevenue(res.data.totalRevenue));
    }, []);

    const deleteUser = async (id) => {
        if(window.confirm("Delete member?")) {
            await API.delete(`/admin/member/${id}`);
            setMembers(members.filter(m => m._id !== id));
        }
    };

    return (
        <div>
            <div style={{ background: '#f4f4f4', padding: '15px', margin: '10px 0' }}>
                <h3>Total Revenue: ${revenue}</h3>
            </div>
            <h3>Manage Members</h3>
            <table border="1" width="100%" style={{ borderCollapse: 'collapse' }}>
                <thead>
                    <tr><th>Name</th><th>Email</th><th>Status</th><th>Actions</th></tr>
                </thead>
                <tbody>
                    {members.map(m => (
                        <tr key={m._id}>
                            <td>{m.name}</td><td>{m.email}</td><td>{m.status}</td>
                            <td><button onClick={() => deleteUser(m._id)}>Delete</button></td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}