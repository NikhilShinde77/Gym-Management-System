const bcrypt = require('bcryptjs');
const jwt    = require('jsonwebtoken');
const Admin   = require('../models/Admin');
const Member  = require('../models/Member');
const Trainer = require('../models/Trainer');

const SECRET = process.env.JWT_SECRET || 'gym_secret';
const modelMap = { admin: Admin, member: Member, trainer: Trainer };

// POST /api/auth/register
exports.register = async (req, res) => {
    try {
        const { role, password, ...rest } = req.body;
        const Model = modelMap[role];
        if (!Model) return res.status(400).json({ message: 'Invalid role' });

        const hashed = await bcrypt.hash(password, 10);
        const user   = await Model.create({ ...rest, password: hashed });
        res.status(201).json({ message: `${role} registered`, id: user._id });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// POST /api/auth/login
exports.login = async (req, res) => {
    try {
        const { role, email, password } = req.body;
        const Model = modelMap[role];
        if (!Model) return res.status(400).json({ message: 'Invalid role' });

        const user = await Model.findOne({ email });
        if (!user) return res.status(404).json({ message: 'User not found' });

        const match = await bcrypt.compare(password, user.password);
        if (!match) return res.status(401).json({ message: 'Wrong password' });

        const token = jwt.sign({ id: user._id, role }, SECRET, { expiresIn: '7d' });
        res.json({ token, role, id: user._id, name: user.name || user.username });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};