const mongoose = require('mongoose');

const workoutPlanSchema = new mongoose.Schema({
    trainer:     { type: mongoose.Schema.Types.ObjectId, ref: 'Trainer', required: true },
    member:      { type: mongoose.Schema.Types.ObjectId, ref: 'Member', required: true },
    planDetails: { type: String, required: true },
    createdDate: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('WorkoutPlan', workoutPlanSchema);