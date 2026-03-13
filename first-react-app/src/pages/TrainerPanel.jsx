import { useEffect, useState } from 'react';
import API from '../api';

export default function TrainerPanel() {
    const [members, setMembers] = useState([]);

    useEffect(() => {
        API.get('/trainer/members').then(res => setMembers(res.data));
    }, []);

    return (
        <div>
            <h2>My Assigned Members</h2>
            {members.length === 0 ? <p>No members assigned yet.</p> : (
                <ul>
                    {members.map(m => (
                        <li key={m._id}>
                            <strong>{m.name}</strong> ({m.email}) - Status: {m.status}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}