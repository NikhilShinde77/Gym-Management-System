const mongoose = require('mongoose');

const subscriptionSchema = new mongoose.Schema({
    member:    { type: mongoose.Schema.Types.ObjectId, ref: 'Member', required: true },
    plan:      { type: mongoose.Schema.Types.ObjectId, ref: 'MembershipPlan', required: true },
    startDate: { type: Date, required: true },
    endDate:   { type: Date, required: true },
    status:    { type: String, enum: ['Active', 'Expired', 'Cancelled'], default: 'Active' }
}, { timestamps: true });

module.exports = mongoose.model('Subscription', subscriptionSchema);