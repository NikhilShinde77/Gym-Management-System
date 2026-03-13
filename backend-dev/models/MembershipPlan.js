const mongoose = require('mongoose');

const membershipPlanSchema = new mongoose.Schema({
    planName:       { type: String, required: true, trim: true },
    price:          { type: Number, required: true, min: 0 },
    durationMonths: { type: Number, required: true, min: 1 },
    features:       { type: String }
}, { timestamps: true });

module.exports = mongoose.model('MembershipPlan', membershipPlanSchema);