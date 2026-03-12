const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
    member:       { type: mongoose.Schema.Types.ObjectId, ref: 'Member', required: true },
    date:         { type: Date, required: true, default: Date.now },
    checkInTime:  { type: Date },
    checkOutTime: { type: Date }
}, { timestamps: true });

module.exports = mongoose.model('Attendance', attendanceSchema);