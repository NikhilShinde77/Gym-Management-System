const WorkoutPlan = require('../models/WorkoutPlan');
const Member      = require('../models/Member');
const Trainer     = require('../models/Trainer');

exports.getProfile = async (req, res) => {
    try {
        const trainer = await Trainer.findById(req.user.id).select('-password');
        if (!trainer) return res.status(404).json({ message: 'Trainer not found' });
        res.json(trainer);
    } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.getAssignedMembers = async (req, res) => {
    try {
        const plans = await WorkoutPlan.find({ trainer: req.user.id })
            .populate('member', 'name email phone status');
        const members = [...new Map(plans.map(p => [p.member._id.toString(), p.member])).values()];
        res.json(members);
    } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.createWorkoutPlan = async (req, res) => {
    try {
        const { memberId, planDetails } = req.body;
        const member = await Member.findById(memberId);
        if (!member) return res.status(404).json({ message: 'Member not found' });

        const plan = await WorkoutPlan.create({
            trainer: req.user.id, member: memberId, planDetails
        });
        res.status(201).json(plan);
    } catch (err) { res.status(400).json({ message: err.message }); }
};

exports.updateWorkoutPlan = async (req, res) => {
    try {
        const plan = await WorkoutPlan.findOneAndUpdate(
            { _id: req.params.id, trainer: req.user.id },
            { planDetails: req.body.planDetails },
            { new: true }
        );
        if (!plan) return res.status(404).json({ message: 'Plan not found or not yours' });
        res.json(plan);
    } catch (err) { res.status(400).json({ message: err.message }); }
};

exports.getMyWorkoutPlans = async (req, res) => {
    try {
        const plans = await WorkoutPlan.find({ trainer: req.user.id })
            .populate('member', 'name email');
        res.json(plans);
    } catch (err) { res.status(500).json({ message: err.message }); }
};