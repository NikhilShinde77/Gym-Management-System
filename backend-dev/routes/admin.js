const router = require('express').Router();
const auth   = require('../middleware/auth');
const ctrl   = require('../controllers/adminController');

const isAdmin = auth(['admin']);

router.get('/members',         isAdmin, ctrl.getAllMembers);
router.put('/members/:id',     isAdmin, ctrl.updateMember);
router.delete('/members/:id',  isAdmin, ctrl.deleteMember);

router.get('/trainers',        isAdmin, ctrl.getAllTrainers);
router.put('/trainers/:id',    isAdmin, ctrl.updateTrainer);
router.delete('/trainers/:id', isAdmin, ctrl.deleteTrainer);

router.post('/plans',          isAdmin, ctrl.createPlan);
router.get('/plans',           isAdmin, ctrl.getAllPlans);
router.put('/plans/:id',       isAdmin, ctrl.updatePlan);
router.delete('/plans/:id',    isAdmin, ctrl.deletePlan);

router.get('/attendance',      isAdmin, ctrl.getAllAttendance);
router.get('/revenue',         isAdmin, ctrl.revenueReport);

module.exports = router;