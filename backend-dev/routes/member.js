const router   = require('express').Router();
const auth     = require('../middleware/auth');
const ctrl     = require('../controllers/memberController');

const isMember = auth(['member']);

router.get('/profile',      isMember, ctrl.getProfile);
router.get('/plans',        isMember, ctrl.getPlans);
router.post('/subscribe',   isMember, ctrl.subscribe);
router.get('/subscription', isMember, ctrl.getSubscription);
router.post('/attendance',  isMember, ctrl.markAttendance);
router.get('/attendance',   isMember, ctrl.getAttendance);
router.get('/payments',     isMember, ctrl.getPaymentHistory);
router.get('/workout',      isMember, ctrl.getWorkoutPlan);

module.exports = router;