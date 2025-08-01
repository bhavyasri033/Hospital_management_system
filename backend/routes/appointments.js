const express = require('express');
const router = express.Router();
const appointmentController = require('../controllers/appointmentController');

// Get all appointments
router.get('/', appointmentController.getAppointments);
// Get appointment by ID
router.get('/:id', appointmentController.getAppointmentById);
// Create new appointment
router.post('/', appointmentController.createAppointment);
// Update appointment
router.put('/:id', appointmentController.updateAppointment);
// Delete appointment
router.delete('/:id', appointmentController.deleteAppointment);

module.exports = router; 