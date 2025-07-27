const express = require('express');
const router = express.Router();
const doctorController = require('../controllers/doctorController');

// Get all doctors
router.get('/', doctorController.getDoctors);
// Get doctor by ID
router.get('/:id', doctorController.getDoctorById);
// Create new doctor
router.post('/', doctorController.createDoctor);
// Update doctor
router.put('/:id', doctorController.updateDoctor);
// Delete doctor
router.delete('/:id', doctorController.deleteDoctor);

module.exports = router; 