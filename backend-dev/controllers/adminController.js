const Member         = require('../models/Member');
const Trainer        = require('../models/Trainer');
const MembershipPlan = require('../models/MembershipPlan');
const Attendance     = require('../models/Attendance');
const Payment        = require('../models/Payment');

// Members
exports.getAllMembers = async (req, res) => {
    try {
        const members = await Member.find().select('-password');
        res.json(members);
    } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.updateMember = async (req, res) => {
    try {
        const member = await Member.findByIdAndUpdate(req.params.id, req.body, { new: true }).select('-password');
        if (!member) return res.status(404).json({ message: 'Member not found' });
        res.json(member);
    } catch (err) { res.status(400).json({ message: err.message }); }
};

exports.deleteMember = async (req, res) => {
    try {
        await Member.findByIdAndDelete(req.params.id);
        res.json({ message: 'Member deleted' });
    } catch (err) { res.status(500).json({ message: err.message }); }
};

// Trainers
exports.getAllTrainers = async (req, res) => {
    try {
        const trainers = await Trainer.find().select('-password');
        res.json(trainers);
    } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.updateTrainer = async (req, res) => {
    try {
        const trainer = await Trainer.findByIdAndUpdate(req.params.id, req.body, { new: true }).select('-password');
        if (!trainer) return res.status(404).json({ message: 'Trainer not found' });
        res.json(trainer);
    } catch (err) { res.status(400).json({ message: err.message }); }
};

exports.deleteTrainer = async (req, res) => {
    try {
        await Trainer.findByIdAndDelete(req.params.id);
        res.json({ message: 'Trainer deleted' });
    } catch (err) { res.status(500).json({ message: err.message }); }
};

// Membership Plans
exports.createPlan = async (req, res) => {
    try {
        const plan = await MembershipPlan.create(req.body);
        res.status(201).json(plan);
    } catch (err) { res.status(400).json({ message: err.message }); }
};

exports.getAllPlans = async (req, res) => {
    try {
        const plans = await MembershipPlan.find();
        res.json(plans);
    } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.updatePlan = async (req, res) => {
    try {
        const plan = await MembershipPlan.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!plan) return res.status(404).json({ message: 'Plan not found' });
        res.json(plan);
    } catch (err) { res.status(400).json({ message: err.message }); }
};

exports.deletePlan = async (req, res) => {
    try {
        await MembershipPlan.findByIdAndDelete(req.params.id);
        res.json({ message: 'Plan deleted' });
    } catch (err) { res.status(500).json({ message: err.message }); }
};

// Attendance
exports.getAllAttendance = async (req, res) => {
    try {
        const records = await Attendance.find().populate('member', 'name email');
        res.json(records);
    } catch (err) { res.status(500).json({ message: err.message }); }
};

// Revenue Report
exports.revenueReport = async (req, res) => {
    try {
        const payments = await Payment.find()
            .populate('member', 'name email')
            .populate('subscription');

        const total = payments.reduce((sum, p) => sum + p.amount, 0);
        const byMethod = payments.reduce((acc, p) => {
            acc[p.paymentMethod] = (acc[p.paymentMethod] || 0) + p.amount;
            return acc;
        }, {});

        res.json({ totalRevenue: total, byMethod, payments });
    } catch (err) { res.status(500).json({ message: err.message }); }
};