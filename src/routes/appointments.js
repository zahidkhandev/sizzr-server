const router = require('express').Router();
const verify = require('../../verifyToken');
const { getAppointmentStats, getAll, getAppointment, deleteAppointment, patchAppointment, createAppointment } = require('../controllers/appointments/appointments');

//GET ALL
router.get('/', verify, getAll);

//GET USER STATS

router.get('/stats', verify, getAppointmentStats);

//UPDATE    
router.patch('/:id', verify, patchAppointment)

//DELETE

router.delete('/:id', verify, deleteAppointment);

//GET
router.get('/:id', verify, getAppointment);

//CREATE
router.post('/', verify, createAppointment)


module.exports = router;
