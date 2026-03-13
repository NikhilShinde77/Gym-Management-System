import { useEffect, useState } from 'react';
import API from '../api';

export default function MemberPanel() {
    const [profile, setProfile] = useState({});
    const [attendance, setAttendance] = useState([]);

    useEffect(() => {
        API.get('/member/profile').then(res => setProfile(res.data));
        API.get('/member/attendance').then(res => setAttendance(res.data));
    }, []);

    const markAttendance = async () => {
        const { data } = await API.post('/member/attendance');
        alert(data.message);
        // Refresh list
        API.get('/member/attendance').then(res => setAttendance(res.data));
    };

    return (
        <div>
            <h2>Welcome, {profile.name}</h2>
            <button onClick={markAttendance} style={{ padding: '10px', background: 'blue', color: 'white' }}>
                Mark Attendance (Check In/Out)
            </button>
            <h3>Recent Attendance</h3>
            <ul>
                {attendance.map(a => (
                    <li key={a._id}>{new Date(a.date).toLocaleDateString()} - {a.checkInTime ? 'In' : ''} {a.checkOutTime ? '/ Out' : ''}</li>
                ))}
            </ul>
        </div>
    );
}
