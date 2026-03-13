const router    = require('express').Router();
const auth      = require('../middleware/auth');
const ctrl      = require('../controllers/trainerController');

const isTrainer = auth(['trainer']);

router.get('/profile',      isTrainer, ctrl.getProfile);
router.get('/members',      isTrainer, ctrl.getAssignedMembers);
router.get('/workout',      isTrainer, ctrl.getMyWorkoutPlans);
router.post('/workout',     isTrainer, ctrl.createWorkoutPlan);
router.put('/workout/:id',  isTrainer, ctrl.updateWorkoutPlan);

module.exports = router;
