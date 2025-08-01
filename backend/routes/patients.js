const express = require('express');
const router = express.Router();
const patientController = require('../controllers/patientController');

// Create a new patient
router.post('/', patientController.createPatient);

// Get all patients
router.get('/', patientController.getAllPatients);

// Get a single patient by ID
router.get('/:id', patientController.getPatientById);

// Update a patient by ID
router.put('/:id', patientController.updatePatient);

// Delete a patient by ID
router.delete('/:id', patientController.deletePatient);

module.exports = router; 