const mongoose = require('mongoose');

const memberSchema = new mongoose.Schema({
    name:     { type: String, required: true, trim: true },
    email:    { type: String, required: true, unique: true, match: [/^\S+@\S+\.\S+$/, 'Invalid email'] },
    password: { type: String, required: true },
    phone:    { type: String, required: true },
    address:  { type: String },
    joinDate: { type: Date, default: Date.now },
    status:   { type: String, enum: ['Active', 'Inactive', 'Suspended'], default: 'Active' }
}, { timestamps: true });

module.exports = mongoose.model('Member', memberSchema);