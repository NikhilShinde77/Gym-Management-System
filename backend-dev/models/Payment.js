const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
    member:        { type: mongoose.Schema.Types.ObjectId, ref: 'Member', required: true },
    subscription:  { type: mongoose.Schema.Types.ObjectId, ref: 'Subscription', required: true },
    amount:        { type: Number, required: true, min: 0 },
    paymentDate:   { type: Date, default: Date.now },
    paymentMethod: { type: String, enum: ['Cash', 'Card', 'Online'], default: 'Cash' }
}, { timestamps: true });

module.exports = mongoose.model('Payment', paymentSchema);