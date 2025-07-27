const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  age: {
    type: Number,
    required: true
  },
  gender: {
    type: String,
    enum: ['Male', 'Female', 'Other'],
    required: true
  },
  contactInfo: {
    phone: { type: String },
    email: { type: String }
  },
  address: {
    type: String
  },
  medicalHistory: {
    type: String
  }
}, { timestamps: true });

module.exports = mongoose.model('Patient', patientSchema); 