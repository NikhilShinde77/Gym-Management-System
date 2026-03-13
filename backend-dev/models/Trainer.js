const mongoose = require('mongoose');

const trainerSchema = new mongoose.Schema({
    name:           { type: String, required: true, trim: true },
    email:          { type: String, required: true, unique: true, match: [/^\S+@\S+\.\S+$/, 'Invalid email'] },
    password:       { type: String, required: true },
    specialization: { type: String, required: true, trim: true },
    phone:          { type: String, required: true },
    status:         { type: String, enum: ['Active', 'Inactive'], default: 'Active' }
}, { timestamps: true });

module.exports = mongoose.model('Trainer', trainerSchema);