const Appointment = require('../models/Appointment');

// Get all appointments
exports.getAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find().populate('patient').populate('doctor');
    res.json(appointments);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

// Get appointment by ID
exports.getAppointmentById = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id).populate('patient').populate('doctor');
    if (!appointment) return res.status(404).json({ error: 'Appointment not found' });
    res.json(appointment);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

// Create new appointment
exports.createAppointment = async (req, res) => {
  try {
    const appointment = new Appointment(req.body);
    await appointment.save();
    // Fetch the saved appointment with populated fields
    const populated = await Appointment.findById(appointment._id).populate('patient').populate('doctor');
    res.status(201).json(populated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Update appointment
exports.updateAppointment = async (req, res) => {
  try {
    await Appointment.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    // Fetch the updated appointment with populated fields
    const populated = await Appointment.findById(req.params.id).populate('patient').populate('doctor');
    if (!populated) return res.status(404).json({ error: 'Appointment not found' });
    res.json(populated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Delete appointment
exports.deleteAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findByIdAndDelete(req.params.id);
    if (!appointment) return res.status(404).json({ error: 'Appointment not found' });
    res.json({ message: 'Appointment deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
}; 