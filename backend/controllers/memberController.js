const Member         = require('../models/Member');
const MembershipPlan = require('../models/MembershipPlan');
const Subscription   = require('../models/Subscription');
const Attendance     = require('../models/Attendance');
const Payment        = require('../models/Payment');
const WorkoutPlan    = require('../models/WorkoutPlan');

exports.getProfile = async (req, res) => {
    try {
        const member = await Member.findById(req.user.id).select('-password');
        if (!member) return res.status(404).json({ message: 'Member not found' });
        res.json(member);
    } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.getPlans = async (req, res) => {
    try {
        const plans = await MembershipPlan.find();
        res.json(plans);
    } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.subscribe = async (req, res) => {
    try {
        const { planId, paymentMethod } = req.body;
        const plan = await MembershipPlan.findById(planId);
        if (!plan) return res.status(404).json({ message: 'Plan not found' });

        const startDate = new Date();
        const endDate   = new Date();
        endDate.setMonth(endDate.getMonth() + plan.durationMonths);

        const sub = await Subscription.create({
            member: req.user.id, plan: planId, startDate, endDate
        });

        await Payment.create({
            member: req.user.id, subscription: sub._id,
            amount: plan.price, paymentMethod: paymentMethod || 'Cash'
        });

        res.status(201).json({ message: 'Subscribed successfully', subscription: sub });
    } catch (err) { res.status(400).json({ message: err.message }); }
};

exports.getSubscription = async (req, res) => {
    try {
        const sub = await Subscription.findOne({ member: req.user.id, status: 'Active' }).populate('plan');
        if (!sub) return res.status(404).json({ message: 'No active subscription' });
        res.json(sub);
    } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.markAttendance = async (req, res) => {
    try {
        const today = new Date(); today.setHours(0, 0, 0, 0);
        let record = await Attendance.findOne({ member: req.user.id, date: { $gte: today } });

        if (!record) {
            record = await Attendance.create({ member: req.user.id, date: new Date(), checkInTime: new Date() });
            return res.status(201).json({ message: 'Checked in', record });
        }
        if (!record.checkOutTime) {
            record.checkOutTime = new Date();
            await record.save();
            return res.json({ message: 'Checked out', record });
        }
        res.json({ message: 'Already checked in and out today', record });
    } catch (err) { res.status(400).json({ message: err.message }); }
};

exports.getAttendance = async (req, res) => {
    try {
        const records = await Attendance.find({ member: req.user.id }).sort({ date: -1 });
        res.json(records);
    } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.getPaymentHistory = async (req, res) => {
    try {
        const payments = await Payment.find({ member: req.user.id })
            .populate('subscription').sort({ paymentDate: -1 });
        res.json(payments);
    } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.getWorkoutPlan = async (req, res) => {
    try {
        const plans = await WorkoutPlan.find({ member: req.user.id })
            .populate('trainer', 'name specialization').sort({ createdDate: -1 });
        res.json(plans);
    } catch (err) { res.status(500).json({ message: err.message }); }
};